import "~web/styles/globals.css";
import { Providers } from "~web/app/providers";
import { UmamiScript } from "~web/components/layout/umamiScript";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <UmamiScript />
      <body className="flex h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
