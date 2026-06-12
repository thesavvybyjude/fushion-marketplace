import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ember: {
          DEFAULT: '#E8642A',
          50: '#FDF0E9',
          100: '#FBDDD0',
          200: '#F5B89E',
          300: '#F0946D',
          400: '#EC7C4B',
          500: '#E8642A',
          600: '#C94F1A',
          700: '#993C14',
          800: '#6A2A0E',
          900: '#3A1708',
        },
        coal: {
          DEFAULT: '#1A0E08',
          50: '#F5F3F2',
          100: '#E8E3E0',
          200: '#C4B9B2',
          300: '#9F8F85',
          400: '#6B584C',
          500: '#3D312A',
          600: '#2C2119',
          700: '#1A0E08',
          800: '#110A05',
          900: '#090503',
        },
        'market-green': {
          DEFAULT: '#2C5F4A',
          50: '#EDF5F1',
          100: '#D4E8DF',
          200: '#A9D1BF',
          300: '#7EBA9F',
          400: '#53A37F',
          500: '#3D7D62',
          600: '#2C5F4A',
          700: '#224A3A',
          800: '#18352A',
          900: '#0E201A',
        },
        'gold-dust': {
          DEFAULT: '#C4A35A',
          50: '#FAF6EC',
          100: '#F3EAD3',
          200: '#E7D5A7',
          300: '#DBC07B',
          400: '#CFAB4F',
          500: '#C4A35A',
          600: '#A68840',
          700: '#7D6630',
          800: '#544420',
          900: '#2B2210',
        },
        paper: {
          DEFAULT: '#F9F7F3',
          50: '#FFFFFF',
          100: '#FDFCFB',
          200: '#F9F7F3',
          300: '#F0ECE3',
          400: '#E7E1D3',
          500: '#DED6C3',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      screens: {
        xs: '375px',
      },
      animation: {
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
