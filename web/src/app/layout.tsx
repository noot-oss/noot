"use client";
import "~/styles/globals.css";
import { Providers } from "~/app/providers";
import { Navbar } from "~/components/Navbar";
import { useTheme } from "next-themes";
import { api } from "~/utils/api";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();

  return (
    <html lang="en" className={`h-full ${theme ?? "dark"}`}>
      <body className="h-full">
        <Providers>
          <Navbar />
          <main className="mx-4 my-16 grow lg:mx-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
};

export default api.withTRPC(RootLayout);
