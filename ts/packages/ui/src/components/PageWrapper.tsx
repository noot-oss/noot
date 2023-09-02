import { NavbarInner } from "../components/Navbar/Navbar";
import { FooterInner } from "~ui/components/Footer";
import { cn } from "~ui/lib/utils";
import type { SessionContextValue } from "next-auth/react";
import { MouseGlow } from "~ui/components/MouseGlow";
import { MouseEvent, useState } from "react";

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
    };
  };
};

export const PageWrapper = ({
  children,
  className,
  shouldMouseGlow,
}: {
  children: React.ReactNode;
  className?: string;
  shouldMouseGlow?: boolean;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
  };

  return (
    <div
      className="flex h-full flex-col"
      onMouseMove={(event) => onMouseMove(event)}
    >
      <NavbarInner theme={"dark"} setTheme={() => {}} session={mockSession} />
      <main className={cn(mainStyles, className)}>{children}</main>
      <FooterInner NODE_ENV={"development"} />
      {shouldMouseGlow && <MouseGlow x={mousePosition.x} y={mousePosition.y} />}
    </div>
  );
};
