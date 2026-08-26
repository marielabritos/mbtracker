/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gym: {
          dark: "#0F172A",
          card: "#1E293B",
          cardHover: "#334155",
          accent: "#38BDF8",       // Electric Blue / Sky
          accentGlow: "#0284C7",
          green: "#10B981",        // Neon green for success / PR
          amber: "#F59E0B",        // Warn / Rest timer
          rose: "#F43F5E"          // Red for delete / high intensity
        }
      }
    },
  },
  plugins: [],
}
