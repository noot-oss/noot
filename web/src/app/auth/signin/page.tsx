import { type SignInServerPageParams } from "next-auth/core/pages/signin";
import { SignInInner } from "~/components/auth/signin/SignInInner";

const SignInPage = (props: {
  params: SignInServerPageParams;
  searchParams: {
    callbackUrl: string;
  };
}) => {
  return (
    <div className="flex grow flex-col items-center justify-center px-4 sm:px-0">
      <SignInInner callbackUrl={props.searchParams.callbackUrl} />
    </div>
  );
};

export default SignInPage;
