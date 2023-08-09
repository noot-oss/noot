import { Hono } from "hono";
import { Redis } from "@upstash/redis/cloudflare";
import { Ratelimit } from "@upstash/ratelimit";

type EnvVars = {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
};

const app = new Hono<{
  Bindings: EnvVars;
}>();

app.use("*", async (context, next) => {
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv({
      UPSTASH_REDIS_REST_URL: context.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: context.env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(10, "10 s"),
    analytics: true,
    /**
     * Optional prefix for the keys used in redis. This is useful if you want to share a redis
     * instance with other applications and want to avoid key collisions. The default prefix is
     * "@upstash/ratelimit"
     */
    prefix: "@upstash/ratelimit/api",
  });

  // TODO: Rate limit by identifier/ip
  const success = await ratelimit.limit("all");

  console.log(success);

  return context.json(
    {
      error: "Too many requests",
    },
    429
  );
});

app.get("/", (c) => c.text("Welcome to the Noot API!"));
export default app;
