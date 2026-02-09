/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  // corePlugins: {
  //   preflight: false, // 禁用默认样式重置
  // },
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
};

