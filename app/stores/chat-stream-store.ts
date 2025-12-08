import { create } from "zustand";

type StreamingState = {
  chatIdToStreamingMessage: Record<string, string>;
  isStreaming: Record<string, boolean>;
};

type ChatStreamStore = StreamingState & {
  startStreaming: (chatId: string) => void;
  appendToken: (chatId: string, token: string) => void;
  clearStreaming: (chatId: string) => void;
  reset: () => void;
};

export const useChatStreamStore = create<ChatStreamStore>((set) => ({
  chatIdToStreamingMessage: {},
  isStreaming: {},

  startStreaming: (chatId: string) =>
    set((state) => ({
      isStreaming: { ...state.isStreaming, [chatId]: true },
      chatIdToStreamingMessage: {
        ...state.chatIdToStreamingMessage,
        [chatId]: "",
      },
    })),

  appendToken: (chatId: string, token: string) =>
    set((state) => ({
      chatIdToStreamingMessage: {
        ...state.chatIdToStreamingMessage,
        [chatId]: (state.chatIdToStreamingMessage[chatId] || "") + token,
      },
    })),

  clearStreaming: (chatId: string) =>
    set((state) => {
      const newChatIdToStreamingMessage = { ...state.chatIdToStreamingMessage };
      const newIsStreaming = { ...state.isStreaming };
      delete newChatIdToStreamingMessage[chatId];
      delete newIsStreaming[chatId];
      return {
        chatIdToStreamingMessage: newChatIdToStreamingMessage,
        isStreaming: newIsStreaming,
      };
    }),

  reset: () =>
    set({
      chatIdToStreamingMessage: {},
      isStreaming: {},
    }),
}));
