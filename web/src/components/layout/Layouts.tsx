import { Navbar } from "~/components/Navbar";

export const LayoutWithNav = (props: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="mx-4 my-16 grow lg:mx-16">{props.children}</main>
    </>
  );
};

export const LayoutWithoutNav = (props: { children: React.ReactNode }) => (
  <main className="mx-4 my-16 grow lg:mx-16">{props.children}</main>
);
