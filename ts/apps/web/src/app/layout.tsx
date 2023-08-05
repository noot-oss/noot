"use client";

import "~/styles/globals.css";
import { api } from "~/utils/api";
import { Providers } from "~/app/providers";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default api.withTRPC(RootLayout);
