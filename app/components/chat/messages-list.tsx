"use client";

import { cn } from "../../lib/utils";
import { useChatStreamStore } from "../../stores/chat-stream-store";
import { trpc } from "../trpc-provider";

type Props = {
  chatId: string;
};

export default function MessagesList({ chatId }: Props) {
  const { data: messages } = trpc.chat.responses.useQuery({ chatId });

  return (
    <div className="grow flex flex-col gap-6">
      {messages?.map((message) => {
        const isUser = message.role === "USER";
        return (
          <div
            key={message.id}
            className={cn(
              "flex w-full",
              isUser ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "p-2 rounded-md text-sm",
                isUser && "bg-secondary text-secondary-foreground"
              )}
            >
              {message.content}
            </div>
          </div>
        );
      })}
      <StreamingMessage chatId={chatId} />
    </div>
  );
}

export function StreamingMessage({ chatId }: { chatId: string }) {
  const { chatIdToStreamingMessage } = useChatStreamStore();
  const streamingContent = chatIdToStreamingMessage[chatId];

  if (!streamingContent) {
    return null;
  }

  return (
    <div className="flex w-full justify-start">
      <div className="p-2 rounded-md text-sm">{streamingContent}</div>
    </div>
  );
}
