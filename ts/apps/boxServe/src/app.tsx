import { useState } from "react";
import "./app.css";
import { H1, H2 } from "@noot/ui/src/components/Typography";
import { cn } from "~ui/lib/utils";
import { BackgroundSvg } from "./components/BackgroundSvg";
import { StepsSection } from "./components/StepsSection";
import { Chevron } from "./components/Chevron";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="main-bg h-full">
      <section className="z-0 flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-background/95 to-background">
        <H1 className="text-center text-6xl lg:text-6xl">
          Welcome to NootBox!
        </H1>
        <span className="text-2xl font-light">Let's get you set up.</span>
        <button
          aria-label="Chevron downwards"
          className="absolute bottom-20 left-1/2 -translate-x-1/2"
          onClick={() => {
            // Move page down
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            });
          }}
        >
          <Chevron className="h-12 w-12 animate-bounce" />
        </button>
      </section>

      <StepsSection />
    </div>
  );
}
