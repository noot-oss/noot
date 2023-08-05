"use client";
import { LayoutWithNavAndFooter } from "~web/components/layout/Layouts";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <LayoutWithNavAndFooter>{children}</LayoutWithNavAndFooter>
);

export default Layout;
