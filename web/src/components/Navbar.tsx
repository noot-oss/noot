"use client";

import {
  NavbarBrand,
  NavbarContent,
  Navbar as NavbarNextUI,
  NavbarItem,
  Switch,
  Button,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";

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
    <NavbarNextUI isBordered>
      <Link href="/">
        <NavbarBrand>
          {/*<AcmeLogo />*/}
          <p className="font-bold text-inherit">Noot</p>
        </NavbarBrand>
      </Link>

      <NavbarContent justify="end">
        <NavbarItem>
          {session.data ? (
            <Button
              as={Link}
              color="primary"
              href="/api/auth/signout"
              variant="flat"
            >
              Sign Out
            </Button>
          ) : (
            <Button
              as={Link}
              color="primary"
              href="/auth/signin"
              variant="flat"
            >
              Sign In
            </Button>
          )}
        </NavbarItem>
        <NavbarItem>
          <Switch
            className="mx-8"
            defaultSelected={theme === "dark" ?? false}
            onValueChange={(e: boolean) => setTheme(e ? "dark" : "light")}
            aria-label={"Toggle theme"}
          />
        </NavbarItem>
      </NavbarContent>
    </NavbarNextUI>
  );
};
