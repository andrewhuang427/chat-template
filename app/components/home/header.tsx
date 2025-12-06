"use client";

import { trpc } from "../../components/trpc-provider";

export default function Header() {
  const { data } = trpc.hello.useQuery({ text: "Andrew" });

  return <div className="text-xl">{data?.greeting ?? "Hello!"}</div>;
}
