"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface ProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export const Providers = (props: ProviderProps) => (
  <NextUIProvider>
    <SessionProvider session={props.session}>{props.children}</SessionProvider>
  </NextUIProvider>
);
