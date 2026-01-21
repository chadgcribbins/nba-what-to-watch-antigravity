import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // NBA Jam-inspired palette
        court: {
          orange: '#E64921',
          blue: '#1D428A',
        },
        hardwood: {
          light: '#D4A373',
          medium: '#8B6F47',
          dark: '#5D4E37',
        },
        vintage: {
          cream: '#F5F0E8',
          gold: '#FFD700',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-nba': 'bounceNBA 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        bounceNBA: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-25%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
