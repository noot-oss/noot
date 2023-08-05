import tw from "@noot/tailwind-config";

/** @type {import('tailwindcss').Config} */
export default {
  ...tw,
  content: [...tw.content, "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"],
};
