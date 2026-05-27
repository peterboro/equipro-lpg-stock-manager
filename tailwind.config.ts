import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18202f",
        charcoal: "#2f3440",
        petrol: "#006f6f",
        flame: "#f05a28",
        leaf: "#2e8b57",
        amberline: "#f5b642",
        paper: "#f7f8f6"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(24, 32, 47, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
