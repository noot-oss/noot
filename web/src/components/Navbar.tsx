"use client";

import {
  NavbarBrand,
  NavbarContent,
  Navbar as NavbarNextUI,
  NavbarItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { useSession } from "next-auth/react";
import { Switch } from "@nextui-org/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();
  const session = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ height: "4rem", width: "100%" }}></div>;
  }

  return (
    <NavbarNextUI position={"sticky"}>
      <NavbarBrand></NavbarBrand>
      <NavbarContent>
        <NavbarItem>Noot</NavbarItem>
      </NavbarContent>
      <Switch
        className="mx-8"
        defaultSelected={theme === "dark" ?? false}
        // @ts-expect-error - incorrect typing
        onValueChange={(e: boolean) => setTheme(e ? "dark" : "light")}
        aria-label={"Toggle theme"}
      />
      <NavbarContent className={"ml-auto"}>
        <NavbarItem>
          {session.data ? (
            <Link href={"/api/auth/signout"}>Sign out</Link>
          ) : (
            <Link href={"/api/auth/signin"}>Sign in</Link>
          )}
        </NavbarItem>
      </NavbarContent>
    </NavbarNextUI>
  );
};
