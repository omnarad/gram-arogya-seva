/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#16211F',
        paper: '#F6F1E7',
        teal: {
          DEFAULT: '#0F5E56',
          dark: '#0A423C',
          light: '#E4EFEC'
        },
        marigold: {
          DEFAULT: '#D98E04',
          dark: '#B9770A'
        },
        sage: '#CFE0D3',
        clay: '#E1613D'
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: []
};
