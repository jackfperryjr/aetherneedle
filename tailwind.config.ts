import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}', './src/sidepanel/index.html'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
