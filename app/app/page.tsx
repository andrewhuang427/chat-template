import NewChatInput from "@/components/home/new-chat-input";
import ChatSidebarLayout from "../components/chat-sidebar-layout";
import { SidebarTrigger } from "../components/ui/sidebar";
import { HydrateClient, trpc } from "../server/server";

export default async function Home() {
  await trpc.chat.list.prefetch();

  return (
    <HydrateClient>
      <ChatSidebarLayout>
        <div className="grow flex flex-col justify-center">
          <div className="absolute top-0 left-0 flex items-center p-4">
            <SidebarTrigger className="cursor-pointer" />
          </div>
          <div className="grow flex flex-col gap-6 items-center justify-center p-4">
            <div className="font-mono">Creator</div>
            <NewChatInput />
          </div>
        </div>
      </ChatSidebarLayout>
    </HydrateClient>
  );
}
