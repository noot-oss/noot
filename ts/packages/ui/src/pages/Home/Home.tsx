import { H1 } from "~ui/components/Typography";
import { Button } from "~ui/components/Button";

const LandingSection = () => (
  <section className="flex h-full w-full flex-col items-center justify-center gap-1">
    <H1 className="text-8xl lg:text-7xl">Noot.</H1>
    <h2 className="mb-4 text-2xl font-light italic text-black/90 dark:text-white/90">
      Shine a light on your environment
    </h2>
    <Button size={"lg"} className="font-bold">
      Explore
    </Button>
  </section>
);

export const Home = () => {
  return (
    <div className="h-full flex-col">
      <LandingSection />
    </div>
  );
};
