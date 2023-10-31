import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        text: "#102310",
        background: "#eef7ed",
        primary: "#4c7ca9",
        "primary-dark": "#3a5e81",
        "primary-darker": "#2c4a6e",
        "primary-light": "#a3c1d9",
        secondary: "#e5c7e6",
        accent: "#E97101",
        "accent-alt": "#4C9749",
      },
      dropShadow: {
        // hard drop shadow
        hard: "3px 3px 0 rgba(76, 124, 169, 0.2)",
        pink: "3px 3px 0 rgba(228, 199, 230, 0.2)",
      },
    },
  },
  plugins: [],
} satisfies Config;
