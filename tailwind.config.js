/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        'card-foreground': 'rgb(var(--card-foreground) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'primary-foreground': 'rgb(var(--primary-foreground) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        'secondary-foreground': 'rgb(var(--secondary-foreground) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--muted-foreground) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-foreground': 'rgb(var(--accent-foreground) / <alpha-value>)',
        destructive: 'rgb(var(--destructive) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        /* Atlas UI Guide */
        workspace: '#18181B',
        panel: '#232326',
        surface: '#1C1C1E',
        'primary-orange': '#FF9900',
        cyan: '#22D3EE',
        purple: '#A78BFA',
        pink: '#F472B6',
        amber: '#F59E42',
        divider: '#27272A',
        outline: '#3F3F46',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['3rem', { lineHeight: '1.1' }],
        'display': ['2rem', { lineHeight: '1.2' }],
        'title': ['1.25rem', { lineHeight: '1.3' }],
        'body': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      borderRadius: {
        card: '0.5rem',
        'card-lg': '1rem',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0,0,0,0.6), 0 2px 4px -2px rgba(0,0,0,0.4)',
        'card-hover': '0 10px 15px -3px rgba(0,0,0,0.6), 0 4px 6px -4px rgba(0,0,0,0.4)',
        glow: '0 0 20px -5px rgb(255 153 0 / 0.3)',
        'glow-cyan': '0 0 20px -5px rgb(34 211 238 / 0.3)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
        fast: '150ms',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
