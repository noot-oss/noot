interface TypographyProps {
  children: React.ReactNode;
}

export const H1 = (props: TypographyProps) => (
  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
    {props.children}
  </h1>
);

export const H2 = (props: TypographyProps) => (
  <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
    {props.children}
  </h2>
);
