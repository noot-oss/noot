"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { TrpcProvider } from "~web/components/layout/trpcProvider";

interface ProviderProps {
  children: React.ReactNode;
}

export const Providers = (props: ProviderProps) => {
  return (
    <TrpcProvider>
      <ThemeProvider attribute="class">
        <SessionProvider>{props.children}</SessionProvider>
      </ThemeProvider>
    </TrpcProvider>
  );
};
