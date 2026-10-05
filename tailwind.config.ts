import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        canvas: '#F1F1EE',
        ink: '#0A0A0A',
        void: '#000000',
        paper: '#FFFFFF',
        mist: '#E8E8E5',
        soft: '#DDDDD9',
        mute: '#B8B8B3',
        quiet: '#8A8A86',
        sage: '#B8D0CA',
        navy: '#0F2C3A',
        live: '#22C55E',
      },
      maxWidth: {
        content: '1280px',
      },
      screens: {
        'event-md': '880px',
      },
    },
  },
  plugins: [],
}

export default config
