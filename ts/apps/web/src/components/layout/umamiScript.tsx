import { env } from "~web/env.mjs";
import Script from "next/script";

export const UmamiScript = () => {
  if (env.NODE_ENV !== "production") return null;

  return (
    <Script
      async
      src="https://analytics.umami.is/script.js"
      data-website-id={env.NEXT_PUBLIC_UMAMI_CODE}
    />
  );
};
