"use client";

import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { PropsWithChildren, useState } from "react";
import superjson from "superjson";
import { makeQueryClient } from "../server/query-client";
import type { AppRouter } from "../server/routers/app-router";

export const trpc = createTRPCReact<AppRouter>();

let clientQueryClientSingleton: QueryClient;
function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  return (clientQueryClientSingleton ??= makeQueryClient());
}

function getUrl() {
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/trpc`;
  }
  return `http://localhost:3000/api/trpc`;
}

export default function TRPCProvider(props: PropsWithChildren) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchStreamLink({
          transformer: superjson,
          url: getUrl(),
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
