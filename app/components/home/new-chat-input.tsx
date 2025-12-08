"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ChatInputForm from "../chat-input-form";
import { trpc } from "../trpc-provider";

export default function NewChatInput() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: createNewChat } = trpc.chat.new.useMutation();
  const utils = trpc.useUtils();
  const router = useRouter();

  async function handleSubmit(message: string) {
    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await createNewChat({ message });
      for await (const chunk of response) {
        if (chunk.type === "new-chat") {
          router.push(`/${chunk.content}`);
          utils.chat.list.invalidate();
        }
        if (chunk.type === "message") {
          console.log(chunk.content);
        }
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
