import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import "~/styles/globals.css";
import { Providers } from "~/app/providers";

const RootLayout: React.FC<
  React.PropsWithChildren<{
    session: Session | null;
  }>
> = ({ children, session }) => {
  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
