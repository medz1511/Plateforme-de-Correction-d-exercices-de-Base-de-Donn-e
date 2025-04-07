/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          dark: '#8183f4'
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          dark: '#9d7cf7'
        }
      },
      backgroundColor: {
        dark: '#111827',
        light: '#f9fafb'
      },
      textColor: {
        dark: '#f3f4f6',
        light: '#111827'
      }
    },
  },
  plugins: [],
}