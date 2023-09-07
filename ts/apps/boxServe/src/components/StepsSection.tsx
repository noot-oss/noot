import { H2 } from "@noot/ui/src/components/Typography";
import { useState } from "react";
import { Chevron } from "./Chevron";

const steps = [
  {
    title: "Plug in your NootBox",
    description: "lorem ipsum 1",
  },
  {
    title: "Connect to the NootBox WiFi",
    description: "lorem ipsum 2",
  },
  {
    title: "Configure your NootBox",
    description: "lorem ipsum 3",
  },
] as const;

interface StepProps {
  title: string;
  description: string;
  current: boolean;
  setCurrent: (index: number) => void;
  index: number;
}

const Step = ({
  title,
  description,
  current,
  setCurrent,
  index,
}: StepProps) => {
  return (
    <button
      className={`flex flex-col items-center rounded-md border border-border bg-foreground/[0.01] transition-all duration-300 hover:bg-foreground/5 ${
        current ? "grow" : ""
      }`}
      onClick={() => {
        setCurrent(index);
      }}
    >
      <div className="flex w-full flex-row items-center justify-between gap-4 px-8 py-4 transition-colors duration-300">
        <h3 className="text-center text-lg font-bold text-white/90">{title}</h3>
        <Chevron
          className={`h-8 w-8 text-white/75 ${current ? "rotate-180" : ""}`}
        />
      </div>
      <div className={current ? "block" : "hidden"}>{description}</div>
    </button>
  );
};

export const StepsSection = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  return (
    <section className="flex h-screen w-full flex-col gap-4 px-8 py-16 md:px-32">
      <div className="flex flex-col items-center justify-center">
        <H2 className="text-center text-5xl">3 Simple Steps.</H2>
        <h3 className="mb-8 text-center text-2xl font-light">
          Soon your NootBox will be ready to go!
        </h3>
      </div>

      <div className="grid h-full w-full grid-cols-1 grid-rows-2 gap-16 md:grid-cols-2 md:grid-rows-1">
        <div className="flex h-full w-full flex-col gap-4">
          {steps.map((step, i) => {
            return (
              <Step
                title={step.title}
                description={step.description}
                current={currentStep === i}
                setCurrent={() => {
                  setCurrentStep(i);
                }}
                index={i}
                key={`step-${i}`}
              />
            );
          })}
        </div>
        <div className="h-full w-full rounded-md border border-border"></div>
      </div>
    </section>
  );
};
