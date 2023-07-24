"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

interface ProviderProps {
  children: React.ReactNode;
}

export const Providers = (props: ProviderProps) => {
  return (
    <ThemeProvider attribute="class">
      <NextUIProvider>
        <SessionProvider>{props.children}</SessionProvider>
      </NextUIProvider>
    </ThemeProvider>
  );
};
