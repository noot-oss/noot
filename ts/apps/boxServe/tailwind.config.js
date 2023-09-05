import twConfigContent from "@noot/tailwind-config";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    ...twConfigContent.theme,
    keyframes: {
      "boxServe-step-down": {
        from: { height: 0 },
        to: { height: "90rem" },
      },
      "boxServe-step-up": {
        from: { height: "90rem" },
        to: { height: 0 },
      },
    },
    animation: {
      "boxServe-step-down": "boxServe-step-down 1s ease-out",
      "boxServe-step-up": "boxServe-step-up 1s ease-out",
    },
  },
  safelist: twConfigContent.safelist,
  plugins: twConfigContent.plugins,
};
