"use client";
import "~/styles/globals.css";
import { Providers } from "~/app/providers";
import { Navbar } from "~/components/Navbar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className="h-full dark">
      <body className="h-full">
        <Providers>
          <Navbar />
          <main className="grow">{children}</main>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
