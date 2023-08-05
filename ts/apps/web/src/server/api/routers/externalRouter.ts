import { createTRPCRouter, publicProcedure } from "~web/server/api/trpc";

export const externalRouter = createTRPCRouter({
  initBox: publicProcedure.mutation(async ({ ctx, input }) => {
    return {};
  }),
});
