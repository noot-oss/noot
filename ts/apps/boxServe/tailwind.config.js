import twConfigContent from "@noot/tailwind-config"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
      '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: twConfigContent.theme,
  safelist: twConfigContent.safelist,
  plugins: twConfigContent.plugins
}
