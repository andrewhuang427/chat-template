import { PrismaPg } from "@prisma/adapter-pg";
import { OpenAI } from "openai";
import { cache } from "react";
import { PrismaClient } from "../prisma/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type TRPCContext = {
  prisma: PrismaClient;
  openai: OpenAI;
};

export const createTRPCContext = cache((): TRPCContext => {
  return {
    prisma,
    openai,
  };
});
