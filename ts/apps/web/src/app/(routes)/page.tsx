"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@noot/ui/src/components/Button";
import { Home as HomeComponent } from "@noot/ui/src/pages/Home/Home";

export default function Home() {
  const session = useSession();

  return <HomeComponent />;
}
