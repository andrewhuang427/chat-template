"use client";

import { cn } from "@/lib/utils";
import { Chat } from "@/prisma/generated/prisma/client";
import { useChatStreamStore } from "@/stores/chat-stream-store";
import { Loader2, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { trpc } from "./trpc-provider";
import { Button } from "./ui/button";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

type Props = {
  chatId?: string;
};

export default function ChatSidebarConversationsList({ chatId }: Props) {
  const { data: chats = [] } = trpc.chat.list.useQuery();

  return (
    <SidebarMenu>
      {chats.map((chat) => (
        <ConversationItem key={chat.id} chat={chat} selectedChatId={chatId} />
      ))}
    </SidebarMenu>
  );
}

type ConversationItemProps = {
  chat: Chat;
  selectedChatId?: string;
};

function ConversationItem({ chat, selectedChatId }: ConversationItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const { mutate: deleteChat } = trpc.chat.delete.useMutation();
  const router = useRouter();
  const utils = trpc.useUtils();

  const { isStreaming } = useChatStreamStore();

  const isStreamingInProgress = isStreaming[chat.id] === true;
  const isSelected = chat.id === selectedChatId;
  const isUserAwayFromStreamingChat = !isSelected && isStreamingInProgress;

  function handleDelete() {
    deleteChat({ chatId: chat.id });

    if (isSelected) {
      router.push("/");
    }

    utils.chat.list.setData(undefined, (prevConversations) =>
      prevConversations?.filter((c) => c.id !== chat.id)
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={chat.id === selectedChatId}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-2">
          <Link
            href={`/${chat.id}`}
            className={cn(
              "grow line-clamp-1",
              isUserAwayFromStreamingChat && "text-muted-foreground"
            )}
          >
            {chat.name}
          </Link>
          {/* Only show loading spinner if user has navigated away from chat while
          streaming */}
          {isUserAwayFromStreamingChat ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            isHovered && (
              <Button
                size="icon-sm"
                variant="ghost"
                className="p-0! cursor-pointer size-3.5 mr-0.5"
                onClick={handleDelete}
              >
                <Trash className="size-3.5" />
              </Button>
            )
          )}
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
