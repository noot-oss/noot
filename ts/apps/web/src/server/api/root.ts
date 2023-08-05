import { boxWebRouter } from "~web/server/api/routers/boxWebRouter";
import { createTRPCRouter } from "~web/server/api/trpc";
import { externalRouter } from "~web/server/api/routers/externalRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  box: boxWebRouter,
  external: externalRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
