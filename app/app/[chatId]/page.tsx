import ChatSidebarLayout from "../../components/chat-sidebar-layout";
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
        <div className="grow flex items-center justify-center">{chatId}</div>
      </ChatSidebarLayout>
    </HydrateClient>
  );
}
