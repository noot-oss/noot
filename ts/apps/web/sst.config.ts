import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "noot",
      region: "eu-north-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site", {
        customDomain: "noot.site",
        environment: {
          DATABASE_URL: process.env.DATABASE_URL,
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
          NEXTAUTH_URL: "https://noot.site",
          DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
          DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
          UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
          UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
