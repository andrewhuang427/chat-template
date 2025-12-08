import { trpc } from "../components/trpc-provider";

export default function useOptimisticChatResponsesUpdate() {
  const utils = trpc.useUtils();

  function optimisticChatResponsesUpdate(
    chatId: string,
    role: "USER" | "ASSISTANT",
    message: string
  ) {
    const optimisticMessage = {
      id: crypto.randomUUID(),
      role,
      content: message,
      chatId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    utils.chat.responses.setData({ chatId }, (previousMessages = []) => {
      return [...previousMessages, optimisticMessage];
    });
  }

  return {
    optimisticChatResponsesUpdate,
  };
}
