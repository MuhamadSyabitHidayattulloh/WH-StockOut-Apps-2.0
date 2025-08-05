/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: '#FFFFFF',
          dark: '#000000',
        },
        card: {
          light: '#F3F4F6',
          dark: '#1C1C1E',
        },
        text: {
          primary: {
            light: '#111827',
            dark: '#FFFFFF',
          },
          secondary: {
            light: '#6B7280',
            dark: '#9CA3AF',
          },
        },
        border: {
          light: '#E5E7EB',
          dark: '#374151',
        },
        primary: {
          light: '#111827',
          dark: '#FFFFFF',
        },
        secondary: {
          light: '#F3F4F6',
          dark: '#374151',
        },
      },
    },
  },
  plugins: [],
}
