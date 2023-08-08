import { Hono } from "hono";
import { Redis } from "@upstash/redis/cloudflare";
import { Ratelimit } from "@upstash/ratelimit";

const app = new Hono();

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit/api",
});

app.use("*", async (context, next) => {
  // TODO: Rate limit by identifier/ip
  const success = await ratelimit.limit("all");

  return context.json(
    {
      error: "Too many requests",
    },
    429
  );
});

app.get("/", (c) => c.text("Welcome to the Noot API!"));
export default app;
