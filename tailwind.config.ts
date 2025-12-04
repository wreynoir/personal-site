import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        roomWood: '#8B4513',
        roomTurquoise: '#00A8A8',
        roomMustard: '#FFD700'
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-heading)']
      },
      boxShadow: {
        'room-glow': '0 0 40px rgba(255, 215, 0, 0.35)'
      }
    }
  },
  plugins: []
};

export default config;
