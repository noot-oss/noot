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
        NootWeb_Version: {PRODUCTION ? "PROD_" : "DEVELOPMENT"}{PRODUCTION && (
          <span>{props.NEXT_PUBLIC_GITHUB_SHA.substring(0, 7)}</span>
      )}
      </span>
    </footer>
  );
};
