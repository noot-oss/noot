"use client";

import { SessionContextValue } from "next-auth/react";
import Link from "next/link";
import { Button } from "~ui/components/Button";
import { SignInOutInner } from "~ui/components/Navbar/SignInOutInner";
export const NavbarInner = (props: {
  theme: string;
  setTheme: (theme: "dark" | "light") => void;
  session: SessionContextValue;
}) => {
  return (
    <nav className="flex w-full flex-row items-center border-b-2 border-b-secondary/50 bg-background px-4 py-4 lg:px-16">
      <Link
        href={props.session.data ? "/dashboard" : "/"}
        className={"mr-auto text-2xl font-bold text-inherit"}
      >
        Noot
      </Link>
      <Button
        onClick={() =>
          props.setTheme(props.theme === "dark" ? "light" : "dark")
        }
        aria-label={"Toggle theme"}
        className="mx-4 lg:mx-8"
      >
        Switch Theme
      </Button>
      <SignInOutInner session={props.session} />
    </nav>
  );
};
