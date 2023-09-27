import { H1 } from "~ui/components/Typography";
import { Button } from "~ui/components/Button";

export interface Provider {
  onClick: () => void;
  name: string;
}

export interface SignInInnerPageProps {
  providers: Provider[];
}

const EmailPasswordInner = () => (
  <div className="grid grid-cols-1 grid-rows-3 gap-4">
    <input
      className="rounded-md border border-white/20 bg-white/5 px-8 py-4"
      placeholder="Email"
    />
    <input
      className="rounded-md border border-white/20 bg-white/5 px-8 py-4"
      placeholder="Password"
      type={"password"}
    />
    <Button className="mt-auto w-full rounded px-24 py-2" size={"lg"}>
      Sign in
    </Button>
  </div>
);

export const SignInInnerPage = (props: SignInInnerPageProps) => (
  <div className="flex h-full w-full flex-col items-center justify-center">
    <H1 className="text-center">Sign in</H1>
    <div className="mx-auto my-auto w-full rounded-md border border-white/20 bg-white/5 p-8 sm:w-2/3 xl:w-1/3">
      <EmailPasswordInner />
      <hr className="my-8 border border-white/20" />
      <ul className="grid grid-flow-row gap-4">
        {props.providers.map((provider, index) => (
          <li className="" key={`provider-${index}-${provider.name}`}>
            <Button
              key={index}
              className="w-full rounded px-24 py-2"
              size={"lg"}
              variant={"outline"}
              onClick={provider.onClick}
            >
              {provider.name}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
