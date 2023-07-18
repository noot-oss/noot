"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

interface ProviderProps {
  children: React.ReactNode;
}

export const Providers = (props: ProviderProps) => {
  return (
    <NextUIProvider>
      <SessionProvider>{props.children}</SessionProvider>
    </NextUIProvider>
  );
};
