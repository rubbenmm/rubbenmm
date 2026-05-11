/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        accent:  '#515151',
        page:    'var(--page-bg)',
        surface: '#ffffff',
        card:    '#ffffff',
        muted:   '#9A9A9A',
        border:  '#E5E5E5',
        label:   '#515151',
        // kept for semantic HTML (danger zone etc.)
        danger:  '#515151',
      },
      opacity: {
        55: '0.55',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

