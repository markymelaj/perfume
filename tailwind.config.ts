import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        panel: '#111113',
        muted: '#71717a',
        border: '#27272a',
        accent: '#f4f4f5'
      },
      boxShadow: {
        soft: '0 12px 40px rgba(0,0,0,0.25)'
      }
    }
  },
  plugins: []
};

export default config;
