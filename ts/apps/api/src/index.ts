import { Hono } from "hono";
import { Redis } from "@upstash/redis/cloudflare";
import { Ratelimit } from "@upstash/ratelimit";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { nanoid } from "nanoid";
import { PrismaClient } from "@prisma/client/edge";

type EnvVars = {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  DATABASE_URL: string;
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
// Returns box data
app.post(
  "/verify",
  zValidator(
    "json",
    z.object({
      code: z.string(),
    })
  ),
  async (c) => {
    const { code } = c.req.valid("json");
    const db = new PrismaClient({
      datasources: {
        db: {
          url: c.env.DATABASE_URL,
        },
      },
    });

    const boxInitFound = await db.boxInit.findUnique({
      where: {
        verificationCode: code,
      },
    });

    if (!boxInitFound) {
      return c.json(
        {
          error: "Invalid code",
        },
        400
      );
    }

    const boxId = nanoid();
    const generatedToken = nanoid();

    const box = db.box
      .create({
        data: {
          id: boxId,
          ownerId: boxInitFound.creatorId,
          token: generatedToken,
          name: `NootBOX-${boxId.substring(0, 4)}`,
        },
      })
      .catch((e) => {
        console.error(e);
        return c.json(
          {
            error: "Failed to generate box",
          },
          500
        );
      });

    const fetchedBox = await db.box.findUnique({
      where: {
        id: boxId,
        token: generatedToken,
      },
    });

    if (!fetchedBox) {
      return c.json(
        {
          error: "Failed to generate box",
        },
        500
      );
    }

    await db.boxInit.delete({
      where: {
        verificationCode: code,
      },
    });

    return c.json({
      id: boxId,
      token: generatedToken,
    });
  }
);
// POST /push   - NootBOX sends data to this endpoint. - {co2: 123, temp: 25, humidity: 75, token: "BOX_TOKEN}
app.post(
  "/push",
  zValidator(
    "json",
    z.object({
      co2: z.number(),
      temp: z.number(),
      humidity: z.number(),
      token: z.string(),
    })
  ),
  async (c) => {
    const { co2, temp, humidity, token } = c.req.valid("json");

    const redis = Redis.fromEnv({
      UPSTASH_REDIS_REST_URL: c.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: c.env.UPSTASH_REDIS_REST_TOKEN,
    });

    const db = new PrismaClient({
      datasources: {
        db: {
          url: c.env.DATABASE_URL,
        },
      },
    });

    const box = await db.box.findUnique({
      where: {
        token,
      },
    });

    if (!box) {
      return c.json(
        {
          error: "Invalid token",
        },
        400
      );
    }

    const logId = nanoid();

    try {
      const data = await db.dataLog.create({
        data: {
          id: logId,
          boxId: box.id,
          co2,
          temp,
          humidity,
        },
      });
    } catch (e) {
      return c.json(
        {
          error: "Failed to log data",
        },
        500
      );
    }

    await redis.set(`nootbox:${box.id}:latest`, {
      co2,
      temp,
      humidity,
    });

    return c.json({
      success: true,
      logId,
    });
  }
);

export default app;
