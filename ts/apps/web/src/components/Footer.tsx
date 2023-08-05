import { env } from "~/env.mjs";

export const Footer = () => {
  const PRODUCTION = process.env.NODE_ENV === "production";

  return (
    <footer className="flex h-16 w-full flex-row items-center justify-between border-t px-16">
      <span>
        Currently running in {PRODUCTION ? "production" : "development"} mode
      </span>
      {PRODUCTION && <span>Version: {process.env.NEXT_PUBLIC_GITHUB_SHA}</span>}
    </footer>
  );
};
