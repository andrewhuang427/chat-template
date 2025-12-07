import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { TRPCContext } from "./context";

const t = initTRPC.context<TRPCContext>().create({ transformer: superjson });
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
