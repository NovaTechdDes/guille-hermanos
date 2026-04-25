/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#F18825",
        secondary: "#8CC63F",
        tertiary: "#231F20",
        neutral: "#F4F5F7",
      },
    },
  },
  plugins: [],
};
