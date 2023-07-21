import { type SignInServerPageParams } from "next-auth/core/pages/signin";
import { getProviders } from "next-auth/react";
import { SignInInner } from "~/components/auth/signin/SignInInner";
import { Card } from "@nextui-org/react";

const SignInPage = async (props: {
  params: SignInServerPageParams;
  searchParams: {
    callbackUrl: string;
  };
}) => {
  const providers = await getProviders();

  if (!providers) {
    return <div>Providers not found</div>;
  }

  return (
    <div className="flex grow flex-col items-center justify-center px-4 sm:px-0">
      <SignInInner
        providers={providers}
        callbackUrl={props.searchParams.callbackUrl}
      />
    </div>
  );
};

export default SignInPage;
