import { NavbarInner } from "@components/Navbar/Navbar.tsx";
import { FooterInner } from "@components/Footer.tsx";
import { useSession } from "next-auth/react";
import { cn } from "~lib/utils.ts";
export const mainStyles = "mx-4 my-8 grow lg:mx-16";

type Session = ReturnType<typeof useSession>;

const mockSession: Session = {
  data: {
    expires: "2021-10-10T20:00:00.000Z",
    user: {
      email: "",
      name: "userName",
      image: "https://avatars.githubusercontent.com/u/9919?s=200&v=4",
    },
  },
  status: "authenticated",
  update: async () => {
    return null;
  },
};

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
