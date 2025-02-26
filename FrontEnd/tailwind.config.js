/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      scrollBehavior: ['smooth'],
      backgroundImage:{
        bannerImg: "url('./images/Homepage.png')",
        iconImg1: "url('./images/image 6.png')",
        iconImg2: "url('./images/image 5.png')",
        iconImg3: "url('./images/image 4.png')",
        iconImg4: "url('./images/image 3.png')",
        uploadPage: "url('./images/Upload Page.png')",
        logo: "url('./images/datalysis-high-resolution-logo-removebg-preview.png')",
        uploadIcon: "url('./images/upload-icon.png')",
        cat: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU_ExB1xf8RbWlWqRDENEIiYG6salXfzLIoWOG3sN84bzE6R2O9ZomrzGeVFmhEUR1IvA&usqp=CAU')",
        valenin: "url('https://exponential-university.com/wp-content/uploads/2025/02/Valenin-only-new-color-1-e1739186362844-300x150.png')",
        gencys: "url('https://exponential-university.com/wp-content/uploads/2025/01/Untitled-design-300x150.png')"
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

