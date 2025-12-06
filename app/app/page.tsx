import Header from "@/components/home/header";
import NewChatInput from "@/components/home/new-chat-input";
import { HydrateClient, trpc } from "../server/server";

export default async function Home() {
  await trpc.hello.prefetch({ text: "Andrew" });

  return (
    <HydrateClient>
      <div className="flex flex-col gap-6 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <Header />
        <NewChatInput />
      </div>
    </HydrateClient>
  );
}
