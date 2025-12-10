import { Message } from "@/prisma/generated/prisma/client";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";
import { TRPCContext } from "../context";

function listChats(ctx: TRPCContext) {
  return ctx.prisma.chat.findMany({
    orderBy: { createdAt: "desc" },
  });
}

function getChatResponses(ctx: TRPCContext, chatId: string) {
  return ctx.prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
  });
}

type NewChatChunkType = {
  type: "new-chat";
  chatId: string;
};

type NewChatNameChunkType = {
  type: "new-chat-name";
  chatId: string;
  name: string;
};

type AssistantMessageChunkType = {
  type: "message";
  chatId: string;
  content: string;
};

async function* createChatAndStreamMessage(
  ctx: TRPCContext,
  initialMessage: string
): AsyncGenerator<
  NewChatChunkType | NewChatNameChunkType | AssistantMessageChunkType
> {
  try {
    // 1. create a new chat
    const newChat = await ctx.prisma.chat.create({
      data: { name: "New Chat" },
    });

    yield {
      type: "new-chat",
      chatId: newChat.id,
    };

    // 2. (fire and forget) create user's initial message
    const userMessagePromise = ctx.prisma.message.create({
      data: {
        role: "USER",
        content: initialMessage,
        chatId: newChat.id,
      },
    });

    // 3. (fire and forget) kick off chat name completion
    const chatNameResponsePromise = ctx.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
              # Instructions:
              You are a helpful assistant that generates names for conversations.
              
              # Response format:
              - Only include the name of the chat
              - Exclude any additional artifacts from the name including quotes, parenthesis, punctuation, etc.`,
        },
        {
          role: "user",
          content: `Generate a name for a conversation that starts with the following: ${initialMessage}`,
        },
      ],
    });

    // 4. stream assistant's response
    const assistantResponseGenerator = await ctx.openai.chat.completions.create(
      {
        stream: true,
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: initialMessage },
        ],
      }
    );

    let fullMessage = "";
    for await (const chunk of assistantResponseGenerator) {
      const delta = chunk.choices[0]?.delta?.content ?? "";
      fullMessage += delta;

      yield {
        type: "message",
        chatId: newChat.id,
        content: delta,
      };
    }

    // 5. wait for chat name response promise to finish + (fire and forget) save name
    const chatNameResponse = await chatNameResponsePromise;
    const chatName = chatNameResponse.choices[0]?.message?.content ?? "";

    const updatedChatNamePromise = ctx.prisma.chat.update({
      where: { id: newChat.id },
      data: { name: chatName },
    });

    yield {
      type: "new-chat-name",
      chatId: newChat.id,
      name: chatName,
    };

    // 6. create assistant's response message with the full streamed message
    await userMessagePromise;
    await Promise.all([
      ctx.prisma.message.create({
        data: {
          role: "ASSISTANT",
          content: fullMessage,
          chatId: newChat.id,
        },
      }),
      updatedChatNamePromise,
    ]);
  } catch (error) {
    throw error;
  }
}

async function* streamMessage(
  ctx: TRPCContext,
  chatId: string,
  message: string
): AsyncGenerator<AssistantMessageChunkType> {
  try {
    // 1. get all previous messages for context
    const previousMessages = await ctx.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    // 2. (fire and forget) create user's message
    const userMessagePromise = ctx.prisma.message.create({
      data: {
        role: "USER",
        content: message,
        chatId,
      },
    });

    // 3. create chat completion input + stream next message
    const messages = _toChatCompletionInput(previousMessages, message);

    const stream = await ctx.openai.chat.completions.create({
      stream: true,
      model: "gpt-4o-mini",
      messages,
    });

    let fullMessage = "";
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? "";
      fullMessage += delta;
      yield {
        type: "message",
        chatId,
        content: delta,
      };
    }

    // 4. create assistant's response message with the full streamed message
    await userMessagePromise;
    await ctx.prisma.message.create({
      data: {
        role: "ASSISTANT",
        content: fullMessage,
        chatId,
      },
    });
  } catch (error) {
    throw error;
  }
}

function _toChatCompletionInput(
  previousMessages: Message[],
  newMessage: string
): ChatCompletionMessageParam[] {
  const previousMessageParams: ChatCompletionMessageParam[] =
    previousMessages.map((msg) => ({
      role: msg.role === "USER" ? "user" : "assistant",
      content: msg.content,
    }));

  return [...previousMessageParams, { role: "user", content: newMessage }];
}

const ChatService = {
  listChats,
  getChatResponses,
  createChatAndStreamMessage,
  streamMessage,
};

export default ChatService;
