import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";

export const LayoutWithNavAndFooter = (props: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <Navbar />
      <main className="mx-4 my-16 grow lg:mx-16">{props.children}</main>
      <Footer />
    </>
  );
};

export const LayoutWithoutNav = (props: { children: React.ReactNode }) => (
  <main className="mx-4 my-16 grow lg:mx-16">{props.children}</main>
);
