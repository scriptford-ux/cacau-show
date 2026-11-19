/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cacau Show brand colors
        'cs-brown': {
          DEFAULT: '#3d1a0a',
          dark: '#2a1007',
          light: '#5c2a14',
        },
        'cs-orange': {
          DEFAULT: '#f5a623',
          dark: '#e8941a',
          light: '#f7b94a',
        },
        'cs-red': {
          DEFAULT: '#8b1a1a',
          dark: '#6d1414',
          light: '#a52020',
        },
        'cs-cream': {
          DEFAULT: '#f5e6d3',
          light: '#fff8f0',
          dark: '#e8d5be',
        },
        'cs-gold': {
          DEFAULT: '#d4a843',
          dark: '#b8922d',
        },
      },
      fontFamily: {
        logo: ['Georgia', 'serif'],
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      },
    },
  },
  plugins: [],
}
