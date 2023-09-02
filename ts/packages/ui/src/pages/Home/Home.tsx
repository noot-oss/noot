import { H1 } from "~ui/components/Typography";
import { Button } from "~ui/components/Button";
import Link from "next/link";

const LandingSection = () => (
  <section className="flex h-full w-full flex-col items-center justify-center gap-1">
    <H1 className="text-8xl lg:text-7xl">Noot.</H1>
    <h2 className="mb-4 text-2xl font-light italic text-black/90 dark:text-white/90">
      Shine a light on your environment
    </h2>
    <div className="md:gris-rows-1 grid grid-cols-1 grid-rows-2 gap-4 md:grid-cols-2 md:grid-rows-1">
      <Button size={"lg"} className="font-bold">
        Get Started
      </Button>
      <Button size={"lg"} className="font-bold" variant={"secondary"} asChild>
        <Link href={"/auth/signin"}>Sign In</Link>
      </Button>
    </div>
  </section>
);

export const Home = () => {
  return (
    <div className="h-full flex-col">
      <LandingSection />
    </div>
  );
};
