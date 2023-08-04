"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

interface ProviderProps {
  children: React.ReactNode;
}

export const Providers = (props: ProviderProps) => {
  return (
    <ThemeProvider attribute="class">
      <SessionProvider>{props.children}</SessionProvider>
    </ThemeProvider>
  );
};
