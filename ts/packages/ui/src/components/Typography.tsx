import { cn } from "~ui/lib/utils";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const H1 = (props: TypographyProps) => (
  <h1
    className={cn(
      "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      props.className
    )}
  >
    {props.children}
  </h1>
);

export const H2 = (props: TypographyProps) => (
  <h2
    className={cn(
      "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
      props.className
    )}
  >
    {props.children}
  </h2>
);
