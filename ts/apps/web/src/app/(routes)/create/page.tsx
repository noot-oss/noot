import { getServerAuthSession } from "~web/server/auth";
import crypto from "node:crypto";
import { CreatePageInner } from "@noot/ui/src/pages/Create/CreatePage";

const CreatePage = async () => {
  const session = await getServerAuthSession();

  const userBoxInit = await ctx.boxInit.findFirst({
    where: {
      creatorId: session.user.id,
    },
  });

  if (userBoxInit.verificationCode) {
    return <CreatePageInner code={userBoxInit.verificationCode} />;
  }

  const EightDigitCode = crypto.randomInt(10000000, 99999999);

  const boxInit = await db.boxInit.create({
    data: {
      verificationCode: EightDigitCode.toString(),
      creatorId: session.user.id,
    },
  });

  return <CreatePageInner code={boxInit.verificationCode} />;
};

export default CreatePage;
