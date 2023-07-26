import { CreateBoxLoadedCode } from "~/components/create/CreateBoxLoadedCode";
import { useSession } from "next-auth/react";
import { getServerAuthSession } from "~/server/auth";
import crypto from "node:crypto";
import { prisma } from "~/server/db";

const CreatePage = async () => {
  const session = await getServerAuthSession();

  const EightDigitCode = crypto.randomInt(10000000, 99999999);

  // const boxInit = await prisma.boxInit.create({
  //   data: {
  //     verificationCode: EightDigitCode.toString(),
  //     creatorId: session.user.id,
  //   },
  // });

  return (
    <div className="flex h-full flex-col items-center gap-16">
      <h1 className="text-center text-4xl font-bold md:text-6xl">
        Create A Box
      </h1>
      {/*<CreateBoxLoadedCode verificationCode={boxInit.verificationCode} />*/}
      Coming soon
    </div>
  );
};

export default CreatePage;
