import {
  createTRPCRouter,
  protectedProcedure,
  rateLimitedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const boxWebRouter = createTRPCRouter({
  getUserBoxes: protectedProcedure.query(async ({ ctx }) => {
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
  getBoxFromCode: rateLimitedProcedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const initBox = await ctx.prisma.boxInit.findUnique({
        where: {
          verificationCode: input.code,
        },
      });

      if (!initBox) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return {
        boxId: initBox.boxId,
      };
    }),
});

export interface UserBoxReturned {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
