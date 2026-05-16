/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg:        '#0f0f10',
        bg2:       '#1a1a1e',
        bg3:       '#222228',
        bg4:       '#2a2a32',
        border1:   '#2e2e3a',
        border2:   '#3e3e4e',
        text1:     '#f0ede6',
        text2:     '#9090a0',
        text3:     '#505060',
        accent:    '#5b7cf6',
        accent2:   '#7c9bff',
        win:       '#4ade80',
        winBg:     '#0d2818',
        loss:      '#f87171',
        lossBg:    '#2a0d0d',
      },
    },
  },
  plugins: [],
}
