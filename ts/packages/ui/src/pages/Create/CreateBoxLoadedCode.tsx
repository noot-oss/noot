"use client";

import { Button } from "~ui/components/Button";
import { useMemo, useRef, useState } from "react";

export const CreateBoxLoadedCode = (props: { verificationCode: string }) => {
  const codeToDisplay =
    props.verificationCode.substring(0, 4) +
    "-" +
    props.verificationCode.substring(4);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copyCode = useMemo(() => {
    return () => {
      clearInterval(timeoutRef.current ?? undefined);
      navigator.clipboard.writeText(props.verificationCode);
      setCopied(true);
      timeoutRef.current = setTimeout(() => setCopied(false), 1000);
    };
  }, [props.verificationCode]);

  return (
    <code
      className={
        "flex w-full w-full flex-row items-center justify-between rounded-md bg-secondary/50 px-4 py-2"
      }
    >
      <span>{codeToDisplay}</span>
      <Button variant={"secondary"} onClick={() => copyCode()}>
        {copied ? "Copied" : "Copy"}
      </Button>
    </code>
  );
};
