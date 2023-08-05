import { NavbarInner } from "../components/Navbar/Navbar";
import { FooterInner } from "~ui/components/Footer";
import { cn } from "~ui/lib/utils";
import { SessionContextValue } from "next-auth/react";

export const mainStyles = "mx-4 my-8 grow lg:mx-16";

const mockSession = {
  data: {
    expires: "2021-10-10T20:00:00.000Z",
    user: {
      id: "1",
      email: "",
      name: "userName",
      image: "https://avatars.githubusercontent.com/u/9919?s=200&v=4",
    },
  },
  status: "authenticated",
  update: async () => {
    return null;
  },
} satisfies SessionContextValue & {
  data: {
    user: {
      id: string;
    }
  }
}

export const PageWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className="flex h-full flex-col">
    <NavbarInner theme={"dark"} setTheme={() => {}} session={mockSession} />
    <main className={cn(mainStyles, className)}>{children}</main>
    <FooterInner NODE_ENV={"development"} />
  </div>
);
