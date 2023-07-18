"use client";

import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();

  return (
    <div className={"flex h-full flex-col items-center justify-center"}>
      <h1 className="text-6xl font-bold">Welcome to Noot</h1>
      Username: {session.data ? session.data.user.name : "Not logged in"}
    </div>
  );
}
