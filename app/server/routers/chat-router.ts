import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../trpc";

export type ChatStreamedChunkType = "new-chat" | "message";

export const chatRouter = createTRPCRouter({
  list: baseProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.chat.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  responses: baseProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.message.findMany({
        where: {
          chatId: input.chatId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    }),
  new: baseProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async function* ({
      ctx,
      input,
    }): AsyncGenerator<{ type: ChatStreamedChunkType; content: string }> {
      try {
        // 1. create a new chat
        const newChat = await ctx.prisma.chat.create({
          data: {
            name: "New Chat",
          },
        });

        yield { type: "new-chat", content: newChat.id };

        // 2. create user's initial message
        await ctx.prisma.message.create({
          data: {
            role: "USER",
            content: input.message,
            chatId: newChat.id,
          },
        });

        // 3. stream assistant's response
        const stream = await ctx.openai.chat.completions.create({
          stream: true,
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: input.message },
          ],
        });

        let fullMessage = "";
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content ?? "";
          fullMessage += delta;
          yield { type: "message", content: delta };
        }

        // 4. create assistant's response message with the full streamed message
        await ctx.prisma.message.create({
          data: {
            role: "ASSISTANT",
            content: fullMessage,
            chatId: newChat.id,
          },
        });
      } catch (error) {
        console.error("error", error);
      }
    }),
});

export type ChatRouter = typeof chatRouter;
