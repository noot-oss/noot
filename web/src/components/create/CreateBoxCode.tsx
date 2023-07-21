"use client";

import { Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { z } from "zod";

const codeSchema = z.object({
  code: z.string().min(0).max(6),
});

export const CreateBoxCode = () => {
  const [code, setCode] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const isSchemaValid = codeSchema.safeParse({ code }).success;

    setIsValid(isSchemaValid);
  }, [code]);

  return (
    <div className="mt-8 flex flex-col gap-8 lg:mt-32">
      <h2 className="text-2xl">Enter Box Code</h2>
      <Input
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        variant="bordered"
        aria-label="Box code"
        className="md:max-w-xl lg:max-w-6xl"
        max={6}
        classNames={{
          input: "text-2xl lg:text-4xl text-center",
          inputWrapper: "h-16 lg:h-32",
        }}
        validationState={isValid ? "valid" : "invalid"}
        errorMessage={!isValid && "That doesn't look like a valid code..."}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button variant="solid" size="lg" color="primary">
        Continue
      </Button>
    </div>
  );
};
