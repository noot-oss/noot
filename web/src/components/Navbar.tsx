import {
  NavbarBrand,
  NavbarContent,
  Navbar as NavbarNextUI,
  NavbarItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { useSession } from "next-auth/react";

export const Navbar = () => {
  const session = useSession();

  return (
    <NavbarNextUI position={"sticky"}>
      <NavbarBrand></NavbarBrand>
      <NavbarContent>
        <NavbarItem>Noot</NavbarItem>
      </NavbarContent>
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
