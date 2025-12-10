import { z } from "zod";
import ChatService from "../services/chat-service";
import { baseProcedure, createTRPCRouter } from "../trpc";

export const chatRouter = createTRPCRouter({
  list: baseProcedure.query(async ({ ctx }) => {
    return ChatService.listChats(ctx);
  }),
  responses: baseProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ChatService.getChatResponses(ctx, input.chatId);
    }),
  new: baseProcedure
    .input(z.object({ message: z.string() }))
    .mutation(function ({ ctx, input }) {
      return ChatService.createChatAndStreamMessage(ctx, input.message);
    }),
  send: baseProcedure
    .input(z.object({ chatId: z.string(), message: z.string() }))
    .mutation(function ({ ctx, input }) {
      return ChatService.streamMessage(ctx, input.chatId, input.message);
    }),
  delete: baseProcedure
    .input(z.object({ chatId: z.string() }))
    .mutation(function ({ ctx, input }) {
      return ChatService.deleteChat(ctx, input.chatId);
    }),
});

export type ChatRouter = typeof chatRouter;
