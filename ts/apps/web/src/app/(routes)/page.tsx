"use client";

import { useSession } from "next-auth/react";
import { Home as HomeComponent } from "@noot/ui/src/pages/Home/Home";
import { useRouter } from "next/navigation";

export default function Home() {
  const session = useSession();
  const router = useRouter();

  if (session.data?.user) {
    router.replace("/dashboard");
  }

  return <HomeComponent />;
}
