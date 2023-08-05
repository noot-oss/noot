"use client";
import { LayoutWithNavAndFooter } from "~/components/layout/Layouts";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <LayoutWithNavAndFooter>{children}</LayoutWithNavAndFooter>
);

export default Layout;
