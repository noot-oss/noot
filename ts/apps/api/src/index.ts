import { Hono } from "hono";
import { Redis } from "@upstash/redis/cloudflare";
import { Ratelimit } from "@upstash/ratelimit";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { nanoid } from "nanoid";

type EnvVars = {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  IS_DEV?: string;
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

  const isDev = context.env.IS_DEV;

  if (isDev) {
    return next();
  }

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

  const { success } = await ratelimit.limit(ip);

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

// POST /verify - Takes a code, and outputs a token for /init.
// Returns {
//     "token": "xMR0j_QFsuo8CgpT281eX"
// }
app.post(
  "/verify",
  zValidator(
    "json",
    z.object({
      code: z.string(),
    })
  ),
  async (c) => {
    const redis = Redis.fromEnv({
      UPSTASH_REDIS_REST_URL: c.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: c.env.UPSTASH_REDIS_REST_TOKEN,
    });
    const { code } = c.req.valid("json");

    const accountId = await redis.get(`noot:verifyCode:${code}`);

    if (!accountId) {
      return c.json(
        {
          error: "Invalid code",
        },
        400
      );
    }

    const token = nanoid();

    const generatedToken = await redis.set(
      `noot:initToken:${token}`,
      accountId
    );

    if (generatedToken !== "OK") {
      return c.json(
        {
          error: "Failed to generate token",
        },
        500
      );
    }

    await redis.del(`noot:verifyCode:${code}`);

    return c.json({
      token,
    });
  }
);

// POST /init   - Takes the token from /verify and enrolls the box onto NootWEB.
app.post(
  "/init",
  zValidator(
    "json",
    z.object({
      token: z.string(),
    })
  ),
  async (c) => {
    return c.text("HAIII!!!! HEWOOO!!!! nyaaaa uwu");
  }
);
// POST /push   - NootBOX sends data to this endpoint. - {co2: 123, temp: 25, hu: 75}

export default app;
