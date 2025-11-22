/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#2C1810',
          gold: '#D4AF37',
          cream: '#F8F4E9'
        },
        accent: {
          bronze: '#CD7F32',
          emerald: '#10B981'
        },
        neutral: {
          charcoal: '#374151',
          slate: '#6B7280'
        }
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        mono: ['Monaco', 'Consolas', 'monospace']
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease-out',
        float: 'float 6s ease-in-out infinite'
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      },
      boxShadow: {
        'premium': '0 20px 40px rgba(44, 24, 16, 0.1)',
        'gold': '0 10px 30px rgba(212, 175, 55, 0.3)'
      }
    },
  },
  plugins: [],
}