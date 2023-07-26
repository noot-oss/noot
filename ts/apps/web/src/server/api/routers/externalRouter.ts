import {
  boxTokenProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import crypto from "node:crypto";

export const externalRouter = createTRPCRouter({
  initBox: publicProcedure.mutation(async ({ ctx, input }) => {
    return {};
  }),
});
