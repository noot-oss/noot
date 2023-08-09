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

  const cfIp = context.req.headers.get("cf-connecting-ip");
  const primaryIp = context.req.headers.get("x-real-ip");
  const finalIp = context.req.headers.get("x-forwarded-for");
  const ip = cfIp || primaryIp || finalIp;

  if (!ip) {
    return context.json(
      {
        error: "No IP address",
      },
      400
    );
  }

  const success = await ratelimit.limit(ip);

  if (!success) {
    return context.json(
      {
        error: "Too many requests",
      },
      429
    );
  }

  return next();
});

app.get("/", (c) => c.text("Welcome to the Noot API!"));
export default app;
