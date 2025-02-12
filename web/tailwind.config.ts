import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          current: "currentColor",
          transparent: "transparent",
          stroke: "#EEEEEE",
          strokedark: "#2D2F40",
          hoverdark: "#252A42",
          titlebg: "#ADFFF8",
          titlebg2: "#FFEAC2",
          titlebgdark: "#46495A",
          btndark: "#292E45",
          white: "#FFFFFF",
          black: "#181C31",
          blackho: "#2C3149",
          blacksection: "#1C2136",
          primary: "#006BFF",
          primaryho: "#0063EC",
          meta: "#20C5A8",
          waterloo: "#757693",
          manatee: "#999AA1",
          alabaster: "#FBFBFB",
          zumthor: "#EDF5FF",
          socialicon: "#D1D8E0",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
} satisfies Config;
