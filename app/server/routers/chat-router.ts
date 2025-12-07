import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../trpc";

export type ChatStreamedChunkType = "new-chat" | "message";

export const chatRouter = createTRPCRouter({
  list: baseProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.chat.findMany();
  }),
  new: baseProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async function* ({
      ctx,
      input,
    }): AsyncGenerator<{ type: ChatStreamedChunkType; content: string }> {
      try {
        const newChat = await ctx.prisma.chat.create({
          data: {
            name: "New Chat",
          },
        });

        yield { type: "new-chat", content: newChat.id };

        const message = await ctx.prisma.message.create({
          data: {
            role: "USER",
            content: input.message,
            chatId: newChat.id,
          },
        });

        yield { type: "message", content: message.content };
      } catch (error) {
        console.error("error", error);
      }
    }),
});

export type ChatRouter = typeof chatRouter;
