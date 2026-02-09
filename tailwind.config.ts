import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Layout.tsx'te tanımladığımız CSS değişkenlerini buraya bağlıyoruz
        sans: ["var(--font-jakarta)", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-instrument)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        // Daktilo kağıdı rengini buraya sabitleyebiliriz
        paper: "#f5f3ea",
        brand: "#f92743",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // Blog yazıları için şart
  ],
};

export default config;
