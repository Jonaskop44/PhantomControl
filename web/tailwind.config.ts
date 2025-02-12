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
      fontSize: {
        sm: "0.800rem", // 12.8px
        base: "1rem", // 16px
        xl: "1.250rem", // 20px
        "2xl": "1.563rem", // 25px
        "3xl": "1.954rem", // 31.25px
        "4xl": "2.442rem", // 39.07px
        "5xl": "3.053rem", // 48.85px
      },
      fontFamily: {
        heading: "Inter",
        body: "Roboto",
      },
      fontWeight: {
        normal: "400",
        bold: "700",
      },
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
        text: {
          50: "#edf0f7",
          100: "#dce2ef",
          200: "#b8c5e0",
          300: "#95a8d0",
          400: "#718ac1",
          500: "#4e6db1",
          600: "#3e578e",
          700: "#2f426a",
          800: "#1f2c47",
          900: "#101623",
          950: "#080b12",
        },
        background: {
          50: "#fdfdfd",
          100: "#e6e6e6",
          200: "#cccccc",
          300: "#b3b3b3",
          400: "#999999",
          500: "#808080",
          600: "#666666",
          700: "#4d4d4d",
          800: "#333333",
          900: "#1a1a1a",
          950: "#0d0d0d",
        },
        primary: {
          50: "#e9edfb",
          100: "#d3dcf8",
          200: "#a8b9f0",
          300: "#7c96e9",
          400: "#5172e1",
          500: "#254fda",
          600: "#1e3fae",
          700: "#163083",
          800: "#0f2057",
          900: "#07102c",
          950: "#040816",
        },
        secondary: {
          50: "#e7f0fe",
          100: "#cee0fd",
          200: "#9ec1fa",
          300: "#6da2f8",
          400: "#3c83f6",
          500: "#0b64f4",
          600: "#0950c3",
          700: "#073c92",
          800: "#052861",
          900: "#021431",
          950: "#010a18",
        },
        accent: {
          50: "#e8eefd",
          100: "#d0defb",
          200: "#a2bcf6",
          300: "#739bf2",
          400: "#447aee",
          500: "#1659e9",
          600: "#1147bb",
          700: "#0d358c",
          800: "#09235d",
          900: "#04122f",
          950: "#020917",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
} satisfies Config;
