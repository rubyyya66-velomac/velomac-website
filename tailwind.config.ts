import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#061426",
          900: "#071A2D",
          800: "#0D2D4D"
        },
        industrial: {
          700: "var(--editable-main-brand-blue-dark, #004A9C)",
          600: "var(--editable-main-brand-blue, #0057B8)",
          500: "#0072CE",
          400: "var(--editable-supporting-blue, #00AEEF)"
        },
        metal: {
          50: "var(--editable-light-background, #F5F8FC)",
          100: "#EEF3F8",
          200: "#D8E1EC",
          400: "#A7B0BE",
          600: "#5B677A",
          800: "#273545"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(6, 20, 38, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
