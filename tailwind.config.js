/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./public/index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',     // main purple
        secondary: '#60A5FA',   // blue for gradients
        accent: '#C084FC',      // pinky-purple hover
        'light-bg': '#ffffff',  // light mode background
        'light-card': '#f3f4f6' // light mode card surface
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,0.35)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: [],
};
