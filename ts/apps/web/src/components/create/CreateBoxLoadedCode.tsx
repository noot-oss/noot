"use client";

import { Code } from "@nextui-org/react";
import { Snippet } from "@nextui-org/react";

export const CreateBoxLoadedCode = (props: { verificationCode: string }) => {
  const codeToDisplay =
    props.verificationCode.substring(0, 4) +
    "-" +
    props.verificationCode.substring(4);

  return (
    <Snippet className={"w-1/2 lg:w-full"} hideSymbol>
      {codeToDisplay}
    </Snippet>
  );
};
