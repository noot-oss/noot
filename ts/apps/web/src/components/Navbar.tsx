"use client";

import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "@noot/ui/src/components/Button";

const SignInOut = () => {
  const session = useSession();

  return (
    <>
      {session.data ? (
        <Button color="primary" variant={"secondary"} asChild>
          <Link href="/api/auth/signout">Sign Out</Link>
        </Button>
      ) : (
        <Button color="primary" asChild variant={"secondary"}>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      )}
    </>
  );
};

export const Navbar = () => {
  const { setTheme, theme } = useTheme();

  return (
    <nav className="w-full flex-row items-center border-b-2 border-b-white bg-background px-16 py-4">
      <Link href={"/"} className={"text-2xl font-bold text-inherit"}>
        Noot
      </Link>
      <Button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label={"Toggle theme"}
        className="mx-8"
      >
        Switch Theme
      </Button>
      <SignInOut />
    </nav>
  );
};
