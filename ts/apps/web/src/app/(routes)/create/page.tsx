import { CreateBoxLoadedCode } from "~web/components/create/CreateBoxLoadedCode";
import { getServerAuthSession } from "~web/server/auth";
import crypto from "node:crypto";
import { prisma } from "~web/server/db";

const StepSection = (props: { children: React.ReactNode }) => (
  <section className="flex flex-col gap-4">{props.children}</section>
);

const StepTitle = (props: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold">{props.children}</h2>
);

const CreatePageInner = (props: { code: string }) => (
  <div className="flex h-full flex-col items-center">
    <h1 className="text-center text-4xl font-bold md:text-6xl">Create A Box</h1>
    <h2 className="my-4 text-center text-xl">
      It{"'"}s so easy to set up a new NootBox! Just follow our 3 step guide and
      <br />
      you{"'"}ll be on your way to monitoring your environment!
    </h2>
    <div className="mt-16 flex w-full flex-col gap-16 px-64 lg:grid lg:grid-cols-3 lg:grid-rows-1">
      <StepSection>
        <StepTitle>1. Plug in your NootBox</StepTitle>
        {/*TODO: Animation of plugging in NootBox*/}
        <div className="h-96 w-full bg-white/10"></div>
      </StepSection>
      <StepSection>
        <StepTitle>2. Visit myip:1234</StepTitle>
        {/*TODO: Animation of plugging in NootBox*/}
        <div className="h-96 w-full bg-white/10"></div>
      </StepSection>
      <StepSection>
        <StepTitle>3. Enter the following code:</StepTitle>
        <CreateBoxLoadedCode verificationCode={props.code} />
      </StepSection>
    </div>
  </div>
);

const CreatePage = async () => {
  const session = await getServerAuthSession();

  const userBoxInit = await prisma.boxInit.findFirst({
    where: {
      creatorId: session.user.id,
    },
  });

  if (userBoxInit.verificationCode) {
    return <CreatePageInner code={userBoxInit.verificationCode} />;
  }

  const EightDigitCode = crypto.randomInt(10000000, 99999999);

  const boxInit = await prisma.boxInit.create({
    data: {
      verificationCode: EightDigitCode.toString(),
      creatorId: session.user.id,
    },
  });

  return <CreatePageInner code={boxInit.verificationCode} />;
};

export default CreatePage;
