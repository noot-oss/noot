import "~web/styles/globals.css";
import { api } from "~web/utils/api";
import { Providers } from "~web/app/providers";
import Script from "next/script";
import { env } from "~web/env.mjs";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      {env.NODE_ENV === "production" && (
        <Script
          async
          src="https://analytics.umami.is/script.js"
          data-website-id={env.NEXT_PUBLIC_UMAMI_CODE}
        />
      )}

      <body className="flex h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default api.withTRPC(RootLayout);
