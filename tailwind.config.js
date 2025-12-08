/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}', // Make sure it looks for React components
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB", // Blue color for buttons and accents
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        }
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
