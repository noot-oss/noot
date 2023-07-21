"use client";

import { type Provider } from "next-auth/providers";
import { type getProviders, signIn, useSession } from "next-auth/react";
import { Button, Card } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export interface SIgnInInnerProps {
  providers: Awaited<ReturnType<typeof getProviders>>;
  callbackUrl: string;
}

export const SignInInner = (props: SIgnInInnerProps) => {
  const session = useSession();
  const router = useRouter();

  if (session.data) router.push(props.callbackUrl);

  if (!props.providers) return <div>Providers not found</div>;

  return (
    <Card className="mx-4 flex w-full flex-col gap-8 px-8 py-16 text-center sm:mx-0 sm:max-w-xs md:max-w-md md:px-32 lg:max-w-2xl">
      <h1 className="text-4xl">Sign In</h1>
      {Object.values(props.providers).map((provider, index) => {
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
