"use client";

import useOptimisticChatResponsesUpdate from "../../hooks/use-optimistic-chat-responses-update";
import { useChatStreamStore } from "../../stores/chat-stream-store";
import ChatInputForm from "../chat-input-form";
import { trpc } from "../trpc-provider";

type Props = {
  chatId: string;
};

export default function ChatInput({ chatId }: Props) {
  const { mutateAsync: sendMessage } = trpc.chat.send.useMutation();
  const { isStreaming, startStreaming, appendToken, clearStreaming } =
    useChatStreamStore();
  const { optimisticChatResponsesUpdate } = useOptimisticChatResponsesUpdate();
  const utils = trpc.useUtils();

  const isStreamingInProgress = isStreaming[chatId] === true;

  async function handleSubmit(message: string) {
    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return;
    }

    // 1. cancel any outgoing refetches to avoid overwriting optimistic update
    await utils.chat.responses.cancel({ chatId });
    optimisticChatResponsesUpdate(chatId, "USER", trimmedMessage);

    // 2. start streaming the response
    startStreaming(chatId);
    const response = await sendMessage({ chatId, message: trimmedMessage });
    for await (const chunk of response) {
      appendToken(chatId, chunk.content);
    }

    // 3. get the full streamed content before clearing
    const { chatIdToStreamingMessage } = useChatStreamStore.getState();
    const assistantContent = chatIdToStreamingMessage[chatId] ?? "";
    clearStreaming(chatId);

    // 4. update the messages with the assistant's response
    optimisticChatResponsesUpdate(chatId, "ASSISTANT", assistantContent);
  }

  return (
    <ChatInputForm
      placeholder="Ask me anything..."
      isSubmitting={isStreamingInProgress}
      onSubmit={handleSubmit}
      className="max-w-3xl w-full"
    />
  );
}
