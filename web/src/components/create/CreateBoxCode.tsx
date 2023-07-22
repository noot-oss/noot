"use client";

import { Button, Input } from "@nextui-org/react";
import { createRef, useEffect, useState } from "react";
import { z } from "zod";

const CODEINPUT_LENGTH = 8;

const codeSchema = z.object({
  code: z.string().min(0).max(9),
});

const CodeInput = () => {
  const [code, setCode] = useState<string[]>(Array.from({ length: 8 }));
  const [refs, setRefs] = useState<React.RefObject<HTMLInputElement>[]>([]);

  useEffect(() => {
    Array.from({ length: CODEINPUT_LENGTH }).forEach(() => {
      setRefs((refs) => [...refs, createRef()]);
    });
  }, []);

  return (
    <div className={"grid grid-cols-8 gap-8"}>
      {Array.from({ length: CODEINPUT_LENGTH }).map((_, i) => {
        return (
          <Input
            key={i}
            type="number"
            min="0"
            max="10"
            pattern={"[0-9]*"}
            size={"lg"}
            classNames={{
              input: "text-center text-4xl font-bold",
              inputWrapper: "w-16 h-32",
            }}
            variant={"bordered"}
            ref={refs[i]}
            placeholder={"0"}
            value={code[i] ?? "0"}
            onKeyDown={(e) => {
              e.preventDefault();
              if (e.key.match(/[0-9]/)) {
                setCode((prev) => {
                  return prev.map((v, index) => {
                    if (index === i) {
                      return e.key;
                    } else {
                      return v;
                    }
                  });
                });

                if (i < CODEINPUT_LENGTH - 1) {
                  refs[i + 1]?.current?.focus();
                }
              }

              if (e.key === "Backspace") {
                setCode((prev) => {
                  return prev.map((v, index) => {
                    if (index === i) {
                      return "";
                    } else {
                      return v;
                    }
                  });
                });

                if (i > 0) {
                  refs[i - 1]?.current?.focus();
                }
              }
            }}
          />
        );
      })}
    </div>
  );
};

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

      <CodeInput />

      <Button variant="solid" size="lg" color="primary">
        Continue
      </Button>
    </div>
  );
};
