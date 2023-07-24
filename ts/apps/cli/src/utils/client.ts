import { externalRouter } from "../../../../web/src/server/api/routers/externalRouter";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

export const client = createTRPCProxyClient<typeof externalRouter>({
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
});
