/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Dark mode colors (current design)
        dark: {
          primary: '#1f2937',      // bg-gray-900
          secondary: '#111827',    // bg-gray-800
          surface: '#374151',      // bg-gray-700
          card: '#1f2937',         // bg-gray-800/50
          border: '#4b5563',       // border-gray-600
          text: '#ffffff',         // text-white
          textSecondary: '#9ca3af', // text-gray-400
          textMuted: '#6b7280',    // text-gray-500
          accent: '#3b82f6',       // bg-blue-600
          accentHover: '#2563eb',  // bg-blue-700
          success: '#10b981',      // bg-green-600
          error: '#ef4444',        // bg-red-600
          warning: '#f59e0b',      // bg-yellow-600
        },
        // Light mode colors
        light: {
          primary: '#ffffff',      // bg-white
          secondary: '#f9fafb',    // bg-gray-50
          surface: '#f3f4f6',      // bg-gray-100
          card: '#ffffff',         // bg-white
          border: '#e5e7eb',       // border-gray-200
          text: '#111827',         // text-gray-900
          textSecondary: '#6b7280', // text-gray-500
          textMuted: '#9ca3af',    // text-gray-400
          accent: '#3b82f6',       // bg-blue-600
          accentHover: '#2563eb',  // bg-blue-700
          success: '#10b981',      // bg-green-600
          error: '#ef4444',        // bg-red-600
          warning: '#f59e0b',      // bg-yellow-600
        }
      }
    },
  },
  plugins: [],
}

