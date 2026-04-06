import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        hack: {
          black: "#000000",
          green: "#00FF41",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Consolas", "Monaco", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
