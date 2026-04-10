/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        'app-bg': '#0A0A0A',
        'app-card': '#1C1C1E',
        'app-border': '#2C2C2E',
        'app-text-primary': '#FFFFFF',
        'app-text-secondary': '#8E8E93',
        'app-success': '#30D158',
        'app-danger': '#FF453A',
      },
      borderRadius: {
        'card': '28px',
        'mini': '20px',
      },
    },
  },
  plugins: [],
}

