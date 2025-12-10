"use client";

import { MessageCirclePlus } from "lucide-react";
import Link from "next/link";
import { trpc } from "../components/trpc-provider";
import { Button } from "./ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./ui/sidebar";

type Props = {
  children: React.ReactNode;
  chatId?: string;
};

export default function ChatSidebarLayout({ children, chatId }: Props) {
  const { data: chats = [] } = trpc.chat.list.useQuery();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <Sidebar collapsible="offcanvas" variant="inset">
        <SidebarHeader className="flex flex-row items-center h-12 mb-2 font-mono">
          Creator
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Button
                  variant="ghost"
                  className="text-left w-full justify-start"
                  asChild
                >
                  <Link href="/">
                    <MessageCirclePlus className="size-4" />
                    New Chat
                  </Link>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel>Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={chat.id === chatId}
                      className="line-clamp-1"
                    >
                      <Link href={`/${chat.id}`}>{chat.name}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <SidebarInset>
        <div className="sticky top-0 left-0 flex items-center p-4 z-10">
          <SidebarTrigger className="cursor-pointer" />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
