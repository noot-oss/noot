import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
});

export interface UserBoxReturned {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
