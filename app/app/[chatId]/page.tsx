import ChatSidebarLayout from "../../components/chat-sidebar-layout";
import ChatInput from "../../components/chat/chat-input";
import MessagesList from "../../components/chat/messages-list";
import { HydrateClient, trpc } from "../../server/server";

type Props = {
  params: Promise<{ chatId: string }>;
};

export default async function Home({ params }: Props) {
  const { chatId } = await params;
  await trpc.chat.list.prefetch();

  return (
    <HydrateClient>
      <ChatSidebarLayout chatId={chatId}>
        <div className="grow flex flex-col relative max-w-3xl mx-auto w-full px-4">
          <MessagesList chatId={chatId} />
          <div className="sticky bottom-0 flex justify-center py-4 bg-background">
            <ChatInput chatId={chatId} />
          </div>
        </div>
      </ChatSidebarLayout>
    </HydrateClient>
  );
}
