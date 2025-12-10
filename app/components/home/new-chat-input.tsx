"use client";

import useOptimisticChatNameUpdate from "@/hooks/use-optimistic-chat-name-update";
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

  const { optimisticChatNameUpdate } = useOptimisticChatNameUpdate();
  const { optimisticChatResponsesUpdate } = useOptimisticChatResponsesUpdate();

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
          chatId = chunk.chatId;
          optimisticChatResponsesUpdate(chatId, "USER", trimmedMessage);
          startStreaming(chatId);
          router.replace(`/${chatId}`);
        }
        if (chatId != null && chunk.type === "new-chat-name") {
          optimisticChatNameUpdate(chatId, chunk.name);
        }
        if (chatId != null && chunk.type === "message") {
          appendToken(chatId, chunk.content);
        }
      }

      if (chatId != null) {
        const { chatIdToStreamingMessage } = useChatStreamStore.getState();
        const assistantContent = chatIdToStreamingMessage[chatId] ?? "";
        clearStreaming(chatId);
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
