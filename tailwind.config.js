/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        melly: {
          50: '#FAF8F5',
          100: '#F4EFEA',
          200: '#E8DED6',
          300: '#D9C8BC',
          400: '#C7ADA0',
          500: '#B08E7E',
          600: '#926F60',
          700: '#735245',
          800: '#54392F',
          900: '#34211A',
          950: '#1C120E',
        },
        champagne: {
          50: '#FDFBF7',
          100: '#F8F4EC',
          200: '#EFE6D5',
          300: '#E4D5B9',
          400: '#D6C097',
          500: '#C5A875',
          600: '#A98A53',
        },
        noir: {
          50: '#F6F6F6',
          100: '#E7E7E7',
          200: '#D1D1D1',
          300: '#9E9E9E',
          400: '#6E6E6E',
          500: '#525252',
          600: '#383838',
          700: '#2B2B2B',
          800: '#1F1F1F',
          900: '#141414',
          950: '#0A0A0A',
        },
        stone: {
          50: '#FAF8F5',
          100: '#F5F2ED',
          200: '#E7E2DA',
          300: '#D4CDC3',
          400: '#756D66', // High-contrast for secondary labels
          500: '#524B44', // Dark legible body copy
          600: '#3B352F', // Strong contrast text
          700: '#29241F',
          800: '#1C1815',
          900: '#120F0D',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(28, 18, 14, 0.07)',
        'luxury-hover': '0 25px 50px -12px rgba(28, 18, 14, 0.15)',
        'luxury-sm': '0 4px 20px -2px rgba(28, 18, 14, 0.05)',
      },
      letterSpacing: {
        'luxury': '0.12em',
        'luxury-wide': '0.2em',
      }
    },
  },
  plugins: [],
}
