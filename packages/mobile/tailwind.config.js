/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(0 0% 18%)',
        input: 'hsl(0 0% 18%)',
        ring: 'hsl(212.7 26.8% 83.9%)',
        background: 'hsl(0 0% 4%)',
        foreground: 'hsl(210 40% 98%)',
        primary: {
          DEFAULT: 'hsl(217.2 91.2% 59.8%)',
          foreground: 'hsl(222.2 47.4% 11.2%)',
        },
        secondary: {
          DEFAULT: 'hsl(217.2 32.6% 17.5%)',
          foreground: 'hsl(210 40% 98%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 62.8% 30.6%)',
          foreground: 'hsl(210 40% 98%)',
        },
        muted: {
          DEFAULT: 'hsl(217.2 32.6% 17.5%)',
          foreground: 'hsl(215 20.2% 65.1%)',
        },
        accent: {
          DEFAULT: 'hsl(217.2 32.6% 17.5%)',
          foreground: 'hsl(210 40% 98%)',
        },
        card: {
          DEFAULT: 'hsl(0 0% 6%)',
          foreground: 'hsl(210 40% 98%)',
        },
      },
    },
  },
  plugins: [],
}
