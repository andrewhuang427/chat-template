"use client";

import { cn } from "../../lib/utils";
import { trpc } from "../trpc-provider";

type Props = {
  chatId: string;
};

export default function MessagesList({ chatId }: Props) {
  const { data: messages } = trpc.chat.responses.useQuery({ chatId });

  return (
    <div className="flex flex-col gap-4">
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
    </div>
  );
}
