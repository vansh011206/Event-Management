import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-jakarta)", "sans-serif"],
        "display-lg": ["var(--font-playfair)", "serif"],
        "display-lg-mobile": ["var(--font-playfair)", "serif"],
        "headline-lg": ["var(--font-playfair)", "serif"],
        "headline-lg-mobile": ["var(--font-playfair)", "serif"],
        "headline-md": ["var(--font-playfair)", "serif"],
        "body-lg": ["var(--font-jakarta)", "sans-serif"],
        "body-md": ["var(--font-jakarta)", "sans-serif"],
        "label-caps": ["var(--font-jakarta)", "sans-serif"],
        quote: ["var(--font-playfair)", "serif"],
      },
      colors: {
        background: "#fcf9f4",
        "on-background": "#1c1c19",
        primary: {
          DEFAULT: "#000000",
          container: "#1c1b1b",
          fixed: "#e5e2e1",
          "fixed-dim": "#c8c6c5",
        },
        "on-primary": "#ffffff",
        "on-primary-container": "#858383",
        secondary: {
          DEFAULT: "#755a28",
          container: "#fdd79a",
          fixed: "#ffdeaa",
          "fixed-dim": "#e6c185",
        },
        "on-secondary": "#ffffff",
        "on-secondary-container": "#785c2a",
        tertiary: {
          DEFAULT: "#000000",
          container: "#1f1b14",
          fixed: "#eae1d5",
          "fixed-dim": "#cdc5ba",
        },
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#898379",
        surface: {
          DEFAULT: "#fcf9f4",
          bright: "#fcf9f4",
          dim: "#dcdad5",
          container: "#f0ede9",
          "container-low": "#f6f3ee",
          "container-high": "#ebe8e3",
          "container-highest": "#e5e2dd",
          "container-lowest": "#ffffff",
          variant: "#e5e2dd",
        },
        "on-surface": "#1c1c19",
        "on-surface-variant": "#444748",
        "surface-tint": "#5f5e5e",
        outline: {
          DEFAULT: "#747878",
          variant: "#c4c7c7",
        },
        "inverse-surface": "#31302d",
        "inverse-on-surface": "#f3f0eb",
        "inverse-primary": "#c8c6c5",
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      borderRadius: {
        editorial: "40px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "fade-up": "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up-delay": "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards",
        "ken-burns": "kenBurns 20s ease-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        kenBurns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;