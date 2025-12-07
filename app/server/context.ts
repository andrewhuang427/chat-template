import { PrismaPg } from "@prisma/adapter-pg";
import { cache } from "react";
import { PrismaClient } from "../prisma/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export type TRPCContext = {
  prisma: PrismaClient;
};

export const createTRPCContext = cache((): TRPCContext => {
  return {
    prisma,
  };
});
