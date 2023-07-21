"use client";
import { LayoutWithNav } from "~/components/layout/Layouts";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <LayoutWithNav>{children}</LayoutWithNav>
);

export default Layout;
