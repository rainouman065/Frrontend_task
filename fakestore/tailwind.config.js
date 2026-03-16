/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontSize: {
        xs: ['0.6875rem', { lineHeight: '1rem' }],     // 11px
        sm: ['0.8125rem', { lineHeight: '1.25rem' }],  // 13px
        base: ['0.875rem', { lineHeight: '1.5rem' }],  // 14px
        lg: ['1rem', { lineHeight: '1.75rem' }],       // 16px
        xl: ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
        '2xl': ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        '3xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
        '4xl': ['1.875rem', { lineHeight: '2.25rem' }],// 30px
      },
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        }
      },
      spacing: {
        '68': '17rem',
      }
    },
  },
  plugins: [],
}