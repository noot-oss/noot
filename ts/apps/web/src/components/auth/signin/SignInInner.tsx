"use client";

import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@noot/ui/src/components/Button";

export interface SIgnInInnerProps {
  callbackUrl: string;
}

type ProvidersReturned = Awaited<ReturnType<typeof getProviders>>;

export const SignInInner = () => {
  const session = useSession();
  const router = useRouter();

  const [providers, setProviders] = useState<ProvidersReturned>(null);

  useEffect(() => {
    getProviders()
      .then((providers) => setProviders(providers))
      .catch((err) => console.error(err));
  }, []);

  if (!providers) {
    return <div>Loading login providers...</div>;
  }

  if (session.data) router.push("/");

  if (!providers) return <div>Loading login providers...</div>; // If this keeps saying this, and doesn't load providers, it means it cant actually find them.
  // I changed this cus it kept saying it for a short amount of time when clicking "sign in", and THEN loading providers. --ac.

  return (
    <div className="mx-4 flex w-full flex-col gap-8 px-8 py-16 text-center sm:mx-0 sm:max-w-xs md:max-w-md md:px-32 lg:max-w-2xl">
      <h1 className="text-4xl">Sign In</h1>
      {Object.values(providers).map((provider, index) => {
        return (
          <Button
            key={index}
            size="lg"
            className="text-xl"
            color="primary"
            onClick={() => void signIn(provider.id)}
          >
            {provider.name}
          </Button>
        );
      })}
    </div>
  );
};
