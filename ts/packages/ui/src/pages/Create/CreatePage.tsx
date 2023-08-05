import { CreateBoxLoadedCode } from "./CreateBoxLoadedCode";
import { Button } from "~ui/components/Button";
import { H1 } from "~ui/components/Typography";

const StepSection = (props: { children: React.ReactNode }) => (
  <section className="flex flex-col gap-4">{props.children}</section>
);

const StepTitle = (props: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold">{props.children}</h2>
);

export const CreatePageInner = (props: { code: string }) => (
  <div className="flex h-full flex-col items-center">
    <H1>Create A Box</H1>
    <h2 className="my-4 text-center text-xl">
      It{"'"}s so easy to set up a new NootBox! Just follow our 3 step guide and
      <br />
      you{"'"}ll be on your way to monitoring your environment!
    </h2>
    <div className="mt-16 flex w-full flex-col gap-16 md:grid md:grid-cols-3 md:grid-rows-1">
      <StepSection>
        <StepTitle>1. Plug in your NootBox</StepTitle>
        {/*TODO: Animation of plugging in NootBox*/}
        <div className="h-96 w-full rounded-md bg-white/10"></div>
      </StepSection>
      <StepSection>
        <StepTitle>2. Visit myip:1234</StepTitle>
        {/*TODO: Animation of plugging in NootBox*/}
        <div className="mt-auto h-96 w-full rounded-md bg-white/10"></div>
      </StepSection>
      <StepSection>
        <StepTitle>3. Enter the following code:</StepTitle>
        <CreateBoxLoadedCode verificationCode={props.code} />
        <Button className={"mt-2"} size={"lg"}>
          Continue
        </Button>
      </StepSection>
    </div>
  </div>
);
