import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../trpc";
import { chatRouter } from "./chat-router";

export const appRouter = createTRPCRouter({
  hello: baseProcedure.input(z.object({ text: z.string() })).query((opts) => {
    return {
      greeting: `Hello, ${opts.input.text}!`,
    };
  }),
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
