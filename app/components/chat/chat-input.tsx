"use client";

import ChatInputForm from "../chat-input-form";

type Props = {
  chatId: string;
};

export default function ChatInput({}: Props) {
  return (
    <ChatInputForm
      placeholder="Ask me anything..."
      isSubmitting={false}
      onSubmit={() => {}}
      className="max-w-3xl w-full"
    />
  );
}
