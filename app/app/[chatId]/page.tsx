import ChatSidebarLayout from "../../components/chat-sidebar-layout";
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
        <div className="max-w-3xl mx-auto w-full">
          <MessagesList chatId={chatId} />
        </div>
      </ChatSidebarLayout>
    </HydrateClient>
  );
}
