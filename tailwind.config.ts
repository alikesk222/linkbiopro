import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#17171C',
          soft: '#4A4A52',
          faint: '#8A8A92',
        },
        paper: {
          DEFAULT: '#FAF9F6',
          alt: '#F1EEE8',
        },
        line: '#E5E1D8',
        brand: {
          50: '#FFF3EC',
          100: '#FFE3D2',
          200: '#FFC49E',
          300: '#FFA066',
          400: '#F87F3B',
          500: '#F0641E',
          600: '#D6510F',
          700: '#B33F0A',
          800: '#8A310C',
          900: '#6B270C',
        },
        teal: {
          DEFAULT: '#17A589',
          soft: '#E1F4EF',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
