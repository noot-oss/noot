"use client";

import { Code, Spinner } from "@nextui-org/react";

export const CreateBoxLoadedCode = (props: { verificationCode: string }) => {
  return (
    <>
      <Code>
        {props.verificationCode.substring(0, 4)}-
        {props.verificationCode.substring(4)}
      </Code>
    </>
  );
};
