"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import useOptimisticChatResponsesUpdate from "../../hooks/use-optimistic-chat-responses-update";
import { useChatStreamStore } from "../../stores/chat-stream-store";
import ChatInputForm from "../chat-input-form";
import { trpc } from "../trpc-provider";

export default function NewChatInput() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: createNewChat } = trpc.chat.new.useMutation();
  const { startStreaming, appendToken, clearStreaming } = useChatStreamStore();
  const { optimisticChatResponsesUpdate } = useOptimisticChatResponsesUpdate();

  const utils = trpc.useUtils();
  const router = useRouter();

  async function handleSubmit(message: string) {
    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return;
    }
    try {
      setIsSubmitting(true);

      let chatId: string | null = null;
      const response = await createNewChat({ message: trimmedMessage });
      for await (const chunk of response) {
        if (chunk.type === "new-chat") {
          chatId = chunk.content;

          // 1. cancel any outgoing refetches to avoid overwriting optimistic update
          await utils.chat.responses.cancel({ chatId: chatId });

          // 2. optimistically add user's message
          optimisticChatResponsesUpdate(chatId, "USER", trimmedMessage);
          startStreaming(chatId);
          router.push(`/${chatId}`);
          utils.chat.list.invalidate();
        }
        if (chatId != null && chunk.type === "message") {
          appendToken(chatId, chunk.content);
        }
      }

      if (chatId != null) {
        // 3. get the full streamed content before clearing
        const { chatIdToStreamingMessage } = useChatStreamStore.getState();
        const assistantContent = chatIdToStreamingMessage[chatId] ?? "";
        clearStreaming(chatId);

        // 4. update the messages with the assistant's response
        optimisticChatResponsesUpdate(chatId, "ASSISTANT", assistantContent);
      }
    } catch {
      toast.error("Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ChatInputForm
      placeholder="Ask me anything..."
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
}
