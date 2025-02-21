/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      backgroundImage:{
        bannerImg: "url('./images/Homepage.png')",
        iconImg1: "url('./images/image 6.png')",
        iconImg2: "url('./images/image 5.png')",
        iconImg3: "url('./images/image 4.png')",
        iconImg4: "url('./images/image 3.png')",
        uploadPage: "url('./images/Upload Page.png')",
        logo: "url('./images/datalysis-high-resolution-logo-removebg-preview.png')",
        uploadIcon: "url('./images/upload-icon.png')"
      },
      colors: {
        primary: "#14323D"
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}

