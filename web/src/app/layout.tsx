"use client";
import "~/styles/globals.css";
import { api } from "~/utils/api";
import { LayoutWithoutNav } from "~/components/layout/Layouts";
import { Providers } from "~/app/providers";
import { Navbar } from "~/components/Navbar";
import { useTheme } from "next-themes";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  return (
    <html lang="en" className={`h-full ${theme ?? "dark"}`}>
      <body className="h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default api.withTRPC(RootLayout);
