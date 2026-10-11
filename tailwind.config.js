/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#4A0914',
          secondary: '#701D32',
          dark: '#32060D',
          hover: '#5A0D1B',
          glow: 'rgba(74, 9, 20, 0.15)',
        },
        beige: {
          champagne: '#D8C3A5',
          warm: '#E8D8C3',
          ivory: '#F8F3EC',
          soft: '#FAF6F0',
          card: '#FFFFFF',
          border: 'rgba(216, 195, 165, 0.45)',
        },
        gold: {
          DEFAULT: '#C7A476',
          light: '#DEC199',
          dark: '#9F7E4F',
          shimmer: 'rgba(199, 164, 118, 0.25)',
        },
        espresso: {
          DEFAULT: '#281B1B',
          muted: '#806F6B',
          light: '#A3928E',
        },
        positive: {
          DEFAULT: '#39755C',
          light: '#EAF3EF',
          border: 'rgba(57, 117, 92, 0.3)',
        },
        warning: {
          DEFAULT: '#C58A3D',
          light: '#FCF5EB',
          border: 'rgba(197, 138, 61, 0.3)',
        },
        danger: {
          DEFAULT: '#B94A52',
          light: '#FBF0F1',
          border: 'rgba(185, 74, 82, 0.3)',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'luxury': '18px',
        'luxury-sm': '14px',
        'luxury-lg': '22px',
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(74, 9, 20, 0.08), 0 4px 12px -2px rgba(40, 27, 27, 0.04)',
        'luxury-hover': '0 16px 36px -12px rgba(74, 9, 20, 0.14), 0 6px 16px -2px rgba(40, 27, 27, 0.06)',
        'gold-glow': '0 0 20px -3px rgba(199, 164, 118, 0.35)',
      },
    },
  },
  plugins: [],
}
