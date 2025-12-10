import NewChatInput from "@/components/home/new-chat-input";
import ChatSidebarLayout from "../components/chat-sidebar-layout";
import { HydrateClient, trpc } from "../server/server";
import { AGENT_NAME } from "@/components/utils";

export default async function Home() {
  await trpc.chat.list.prefetch();

  return (
    <HydrateClient>
      <ChatSidebarLayout>
        <div className="grow flex flex-col gap-6 items-center justify-center p-4">
          <div className="font-mono">{AGENT_NAME}</div>
          <NewChatInput />
        </div>
      </ChatSidebarLayout>
    </HydrateClient>
  );
}
