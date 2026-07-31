import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-alt": "rgb(var(--color-surface-alt) / <alpha-value>)",
        surfaceBorder: "rgb(var(--color-primary) / 0.08)",
        surfaceHover: "rgb(var(--color-primary) / 0.03)",
        textMuted: "rgb(var(--color-text-muted) / <alpha-value>)",
        
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          hover: "rgb(var(--color-primary-hover) / <alpha-value>)",
        },
        
        gold: {
          DEFAULT: "rgb(var(--color-gold) / <alpha-value>)",
          soft: "rgb(var(--color-gold-soft) / <alpha-value>)",
          dark: "rgb(var(--color-gold-dark) / <alpha-value>)",
        },
        
        accent: "rgb(var(--color-gold) / <alpha-value>)",
        
        secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
        muted: "rgb(var(--color-text-muted) / <alpha-value>)",
        inverse: "rgb(var(--color-text-inverse) / <alpha-value>)",
        
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        
        border: "rgb(var(--color-border) / <alpha-value>)",
        
        transparent: "transparent",
        current: "currentColor",
        white: "#ffffff",
        black: "#000000",
      },
      extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        ui: ["var(--font-ui)"],
      },
      backgroundImage: {
        'islamic-pattern': "url('/pattern.svg')",
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 0 3px rgba(0,0,0,0.02)',
        'soft-hover': '0 10px 40px -4px rgba(0, 0, 0, 0.08), 0 0 4px rgba(0,0,0,0.03)',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '14px',
        'xl': '18px',
        '2xl': '24px',
        'button': '12px',
        'input': '14px',
        'modal': '24px',
      },
      keyframes: {
        watermark: {
          '0%': { top: '10%', left: '10%', transform: 'rotate(-15deg)' },
          '25%': { top: '70%', left: '20%', transform: 'rotate(-15deg)' },
          '50%': { top: '30%', left: '60%', transform: 'rotate(-15deg)' },
          '75%': { top: '15%', left: '40%', transform: 'rotate(-15deg)' },
          '100%': { top: '10%', left: '10%', transform: 'rotate(-15deg)' },
        }
      },
      animation: {
        watermark: 'watermark 25s linear infinite',
      }
    },
  },
  plugins: [],
};

export default config;
