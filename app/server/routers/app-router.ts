import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../trpc";

export const appRouter = createTRPCRouter({
  hello: baseProcedure.input(z.object({ text: z.string() })).query((opts) => {
    return {
      greeting: `Hello, ${opts.input.text}!`,
    };
  }),
  stream: baseProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async function* () {
      for (let i = 0; i < 3; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        yield i;
      }
    }),
});
export type AppRouter = typeof appRouter;
