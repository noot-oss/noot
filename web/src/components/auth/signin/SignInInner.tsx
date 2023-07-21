"use client";

import { getProviders, signIn, useSession } from "next-auth/react";
import { Button, Card } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface SIgnInInnerProps {
  callbackUrl: string;
}

type ProvidersReturned = Awaited<ReturnType<typeof getProviders>>;

export const SignInInner = (props: SIgnInInnerProps) => {
  const session = useSession();
  const router = useRouter();

  const [providers, setProviders] = useState<ProvidersReturned>(null);

  useEffect(() => {
    getProviders()
      .then((providers) => setProviders(providers))
      .catch((err) => console.error(err));
  }, []);

  if (!providers) {
    return <div>Providers not found</div>;
  }

  if (session.data) router.push(props.callbackUrl);

  if (!providers) return <div>Providers not found</div>;

  return (
    <Card className="mx-4 flex w-full flex-col gap-8 px-8 py-16 text-center sm:mx-0 sm:max-w-xs md:max-w-md md:px-32 lg:max-w-2xl">
      <h1 className="text-4xl">Sign In</h1>
      {Object.values(providers).map((provider, index) => {
        return (
          <Button
            key={index}
            size="lg"
            className="text-xl"
            color="primary"
            onPress={() => void signIn(provider.id)}
          >
            {provider.name}
          </Button>
        );
      })}
    </Card>
  );
};
