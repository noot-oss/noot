import { type Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
import { tailwindTremorSafelist, tailwindTremorTheme } from "./tailwindTremor";
import headlessUi from "@headlessui/tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    ...tailwindTremorTheme,
    extend: {},
  },
  safelist: tailwindTremorSafelist,
  darkMode: "class",
  plugins: [nextui(), headlessUi({})],
} satisfies Config;
