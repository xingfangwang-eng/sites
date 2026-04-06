import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fafafa",
        foreground: "#1a1a1a",
        card: "#ffffff",
        "card-foreground": "#09090b",
        "primary": "#18181b",
        "primary-foreground": "#fafafa",
        muted: "#f4f4f5",
        "muted-foreground": "#71717a",
        accent: "#f4f4f5",
        "accent-foreground": "#18181b",
        border: "#e4e4e7",
        input: "#e4e4e7",
        ring: "#18181b",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
