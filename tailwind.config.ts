import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#4F46E5",
          600: "#4338CA",
        },
        success: {
          500: "#22C55E",
        },
        warning: {
          500: "#F59E0B",
        },
        danger: {
          500: "#EF4444",
        },
        info: {
          500: "#3B82F6",
        },
        sidebar: {
          bg: "#1E293B",
          hover: "#334155",
          active: "#4F46E5",
        },
        gray: {
          50:  "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          700: "#334155",
          900: "#0F172A",
        }
      },
      fontFamily: {
        primary: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        xl: "12px",
        lg: "8px",
      }
    },
  },
  plugins: [],
};
export default config;
