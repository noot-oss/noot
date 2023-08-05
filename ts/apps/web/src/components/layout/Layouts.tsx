import { NavbarInner } from "@noot/ui/src/components/Navbar/Navbar";
import { FooterInner } from "@noot/ui/src/components/Footer";
import { useTheme } from "next-themes";
import { mainStyles } from "@noot/ui/src/components/PageWrapper";

export const LayoutWithNavAndFooter = (props: {
  children: React.ReactNode;
}) => {
  const footerProps: React.ComponentProps<typeof FooterInner> =
    process.env.NODE_ENV === "production"
      ? {
          NODE_ENV: "production",
          NEXT_PUBLIC_GITHUB_SHA: process.env.NEXT_PUBLIC_GITHUB_SHA,
        }
      : { NODE_ENV: "development" };
  const { theme, setTheme } = useTheme();

  return (
    <>
      <NavbarInner theme={theme} setTheme={setTheme} />
      <main className={mainStyles}>{props.children}</main>
      <FooterInner {...footerProps} />
    </>
  );
};

export const LayoutWithoutNav = (props: { children: React.ReactNode }) => (
  <main className="mx-4 my-16 grow lg:mx-16">{props.children}</main>
);
