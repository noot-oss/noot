"use client";
import { LayoutWithNavAndFooter } from "~web/components/layout/Layouts";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <LayoutWithNavAndFooter shouldMouseGlow>{children}</LayoutWithNavAndFooter>
);

export default Layout;
