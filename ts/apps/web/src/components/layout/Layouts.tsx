"use client";

import { NavbarInner } from "@noot/ui/src/components/Navbar/Navbar";
import { FooterInner } from "@noot/ui/src/components/Footer";
import { useTheme } from "next-themes";
import { mainStyles } from "@noot/ui/src/components/PageWrapper";
import { useSession } from "next-auth/react";
import { MouseEvent, useState } from "react";
import { MouseGlow } from "~ui/components/MouseGlow";

export const LayoutWithNavAndFooter = (props: {
  children: React.ReactNode;
  shouldMouseGlow?: boolean;
}) => {
  const footerProps: React.ComponentProps<typeof FooterInner> =
    process.env.NODE_ENV === "production"
      ? {
          NODE_ENV: "production",
          NEXT_PUBLIC_GITHUB_SHA: process.env.NEXT_PUBLIC_GITHUB_SHA,
        }
      : { NODE_ENV: "development" };
  const { theme, setTheme } = useTheme();
  const session = useSession();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
  };

  return (
    <div
      onMouseMove={(event) => onMouseMove(event)}
      className="flex h-full flex-col"
    >
      <NavbarInner theme={theme} setTheme={setTheme} session={session} />
      <main className={mainStyles}>{props.children}</main>
      <FooterInner {...footerProps} />
      {props.shouldMouseGlow && (
        <MouseGlow x={mousePosition.x} y={mousePosition.y} />
      )}
    </div>
  );
};

export const LayoutWithoutNav = (props: { children: React.ReactNode }) => (
  <main className="mx-4 my-16 grow lg:mx-16">{props.children}</main>
);
