"use client";

import { Chat } from "@/prisma/generated/prisma/client";
import { Trash } from "lucide-react";
import Link from "next/link";
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
  const utils = trpc.useUtils();

  function handleDelete() {
    deleteChat({ chatId: chat.id });
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
          <Link href={`/${chat.id}`} className="grow line-clamp-1">
            {chat.name}
          </Link>
          {isHovered && (
            <Button
              size="icon-sm"
              variant="ghost"
              className="!p-0 cursor-pointer"
              onClick={handleDelete}
            >
              <Trash className="size-4" />
            </Button>
          )}
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
