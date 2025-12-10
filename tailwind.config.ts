/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bulletin: {
          50: '#fef8f0',
          100: '#fcecd9',
          200: '#f8d6b2',
          300: '#f4bb82',
          400: '#ef9750',
          500: '#eb7a2f',
          600: '#dc5f24',
          700: '#b74920',
          800: '#923b22',
          900: '#75331e',
        },
      },
    },
  },
  plugins: [],
}
