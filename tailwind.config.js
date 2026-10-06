/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050505',
        coal: '#0A0A0A',
        gold: '#C9A227',
        'gold-light': '#E0BD3D',
        paper: '#F5F5F5',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 0 90px rgba(201,162,39,0.14), 0 30px 80px rgba(0,0,0,0.7)',
      },
      keyframes: {
        cue: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '50%': { transform: 'translateY(6px)', opacity: '1' },
        },
      },
      animation: {
        cue: 'cue 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}