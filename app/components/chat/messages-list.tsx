"use client";

import { Loader } from "lucide-react";
import { memo } from "react";
import { useChatStreamStore } from "../../stores/chat-stream-store";
import { trpc } from "../trpc-provider";
import MessageMarkdown from "./message-markdown";
import AssistantMessage from "./messages/assistant-message";
import UserMessage from "./messages/user-message";
import { AGENT_NAME } from "../utils";

type Props = {
  chatId: string;
};

const UserMessageMemo = memo(UserMessage, (prevProps, nextProps) => {
  return prevProps.content === nextProps.content;
});

const AssistantMessageMemo = memo(AssistantMessage, (prevProps, nextProps) => {
  return prevProps.content === nextProps.content;
});

export default function MessagesList({ chatId }: Props) {
  const { data: messages } = trpc.chat.responses.useQuery({ chatId });

  return (
    <div className="grow flex flex-col gap-6 my-8 px-2">
      {messages?.map((message) => {
        const isUser = message.role === "USER";
        if (isUser) {
          return <UserMessageMemo key={message.id} content={message.content} />;
        }
        return (
          <AssistantMessageMemo key={message.id} content={message.content} />
        );
      })}
      <StreamingMessage chatId={chatId} />
    </div>
  );
}

export function StreamingMessage({ chatId }: { chatId: string }) {
  const { chatIdToStreamingMessage, isStreaming } = useChatStreamStore();

  const isStreamingInProgress = isStreaming[chatId] === true;
  const streamingContent = chatIdToStreamingMessage[chatId] ?? "";

  if (!isStreamingInProgress) {
    return null;
  }

  return (
    <div className="flex w-full justify-start">
      {streamingContent === "" ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader className="animate-spin size-4" />
          <span className="font-mono text-sm">{AGENT_NAME} thinking ...</span>
        </div>
      ) : (
        <MessageMarkdown content={streamingContent} />
      )}
    </div>
  );
}
