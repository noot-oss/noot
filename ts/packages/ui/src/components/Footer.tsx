"use client";

export const FooterInner = (
  props:
    | {
        NODE_ENV: "development" | "test";
      }
    | {
        NODE_ENV: "production";
        NEXT_PUBLIC_GITHUB_SHA: string;
      }
) => {
  const PRODUCTION = props.NODE_ENV === "production";

  return (
    <footer className="flex min-h-[4rem] w-full flex-col items-center justify-center gap-2 border-t px-4 sm:flex-row sm:justify-between lg:gap-0 lg:px-16">
      <span>
        Currently running in {PRODUCTION ? "production" : "development"} mode
      </span>
      {PRODUCTION && <span>Version: {props.NEXT_PUBLIC_GITHUB_SHA}</span>}
    </footer>
  );
};
