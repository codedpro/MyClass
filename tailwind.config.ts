import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",

  ],
  theme: {
    extend: {
      colors: {
        primary: "#212121",
        secondary: "#171717",
        accent: "#2f2f2f",
        'dark-1': '#212121',
        'dark-2': '#2f2f2f',
        'dark-3': '#171717',
      },
    },
  },
  variants: {},

  plugins: [],
};
export default config;
