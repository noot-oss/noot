import "./tw.css";
import "./globals.css";
import type { GlobalProvider } from "@ladle/react";
import { ThemeProvider } from "next-themes";

export const Provider: GlobalProvider = ({ children }) => (
  <>
    <ThemeProvider defaultTheme="dark" attribute="class">
      {children}
    </ThemeProvider>
  </>
);
