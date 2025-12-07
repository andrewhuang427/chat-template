import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { createTRPCContext } from "./context";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/app-router";
import { createCallerFactory } from "./trpc";

export const getQueryClient = cache(makeQueryClient);

const caller = createCallerFactory(appRouter)(createTRPCContext);

const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient
);

export { HydrateClient, trpc };
