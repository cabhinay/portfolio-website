/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./public/index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['"Roboto Mono"', 'monospace'],
      },
      colors: {
        primary: '#8B5CF6',     // main purple
        secondary: '#60A5FA',   // blue for gradients
        accent: '#C084FC',      // pinky-purple hover
        'light-bg': '#ffffff',  // light mode background
        'light-card': '#f3f4f6' // light mode card surface
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,0.35)',
        'glass': '0 8px 32px rgba(0,0,0,0.05), 0 4px 16px rgba(255,255,255,0.05)',
        'glass-dark': '0 8px 32px rgba(0,0,0,0.2), 0 4px 16px rgba(255,255,255,0.05)',
        'neon': '0 0 5px theme("colors.primary.400"), 0 0 20px rgba(139, 92, 246, 0.3)',
      },
      borderRadius: {
        xl2: '1.25rem'
      },
      animation: {
        'bounce-slow': 'bounce 1.5s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'floating 3s ease-in-out infinite',
        'wave': 'wave 2.5s ease-in-out infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'drift': 'drift 7s ease-in-out infinite',
      },
      keyframes: {
        floating: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(14deg)' },
          '20%': { transform: 'rotate(-8deg)' },
          '30%': { transform: 'rotate(14deg)' },
          '40%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(10deg)' },
          '60%, 100%': { transform: 'rotate(0deg)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    }
  },
  plugins: [],
};
