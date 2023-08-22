import {
  createTRPCRouter,
  protectedProcedure,
  rateLimitedProtectedProcedure,
} from "~web/server/api/trpc";
import { TRPCError } from "@trpc/server";
import crypto from "node:crypto";
import { z } from "zod";

export const boxWebRouter = createTRPCRouter({
  getUserBoxes: rateLimitedProtectedProcedure.query(async ({ ctx }) => {
    const userBoxes = await ctx.prisma.box.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
    });

    return userBoxes.map((box) => ({
      id: box.id,
      name: box.name,
      createdAt: box.createdAt,
      updatedAt: box.updatedAt,
    })) satisfies UserBoxReturned[];
  }),
  getBoxByVerificationCode: rateLimitedProtectedProcedure
    .input(
      z.object({
        verificationCode: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return ctx.prisma.box.findMany({
          where: {
            ownerId: ctx.session.user.id,
            verificationCode: input.verificationCode,
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  fetchCode: protectedProcedure.query(async ({ ctx }) => {
    console.log(ctx.ip, "ip");
    if (!ctx.ip) {
      throw new TRPCError({
        code: "BAD_REQUEST",
      });
    }

    const existingCode = await ctx.prisma.boxInit.findFirst({
      where: {
        creatorId: ctx.session.user.id,
      },
    });

    if (existingCode && existingCode.verificationCode) {
      return {
        verificationCode: existingCode.verificationCode,
      };
    }

    const EightDigitCode = crypto.randomInt(10000000, 99999999);

    const boxInit = await ctx.prisma.boxInit.create({
      data: {
        verificationCode: EightDigitCode.toString(),
        creatorId: ctx.session.user.id,
      },
    });

    return {
      verificationCode: boxInit.verificationCode,
    };
  }),
});

export interface UserBoxReturned {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
