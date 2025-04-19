import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'media', // Use 'media' to respect the user's system preference
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          background: "var(--card-background)",
          border: "var(--card-border)",
        },
        input: {
          background: "var(--input-background)",
          border: "var(--input-border)",
        },
        button: {
          primary: "var(--button-primary)",
          "primary-text": "var(--button-primary-text)",
          secondary: "var(--button-secondary)",
          "secondary-text": "var(--button-secondary-text)",
        },
        hover: {
          background: "var(--hover-background)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
