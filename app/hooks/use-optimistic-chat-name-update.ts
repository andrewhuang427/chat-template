import { trpc } from "@/components/trpc-provider";

export default function useOptimisticChatNameUpdate() {
  const utils = trpc.useUtils();

  function optimisticChatNameUpdate(chatId: string, name: string) {
    utils.chat.list.setData(undefined, (previousChats) => {
      return previousChats?.map((c) => (c.id === chatId ? { ...c, name } : c));
    });
  }

  return { optimisticChatNameUpdate };
}
