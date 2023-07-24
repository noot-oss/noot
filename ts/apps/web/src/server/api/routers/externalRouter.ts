import {
  boxTokenProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import crypto from "node:crypto";

export const externalRouter = createTRPCRouter({
  initBox: publicProcedure.mutation(async ({ ctx, input }) => {
    if (!ctx.ip) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const fetchBoxesForIp = await ctx.prisma.boxInit.findFirst({
      where: {
        ip: ctx.ip,
      },
    });

    if (fetchBoxesForIp) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
      });
    }

    const EightDigitCode = crypto.randomInt(10000000, 99999999);

    const createdInitBox = await ctx.prisma.boxInit.create({
      data: {
        ip: ctx.ip,
        verificationCode: EightDigitCode.toString(),
      },
    });

    return {
      verificationCode: createdInitBox.verificationCode,
    };
  }),
});
