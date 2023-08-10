import type { AppRouter } from "~web/server/api/root";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/trpc",
      // You can pass any HTTP headers you wish here
      async headers() {
        return {
          authorization: "",
        };
      },
    }),
  ],
  transformer: superjson,
});
