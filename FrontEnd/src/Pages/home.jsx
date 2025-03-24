import { useState, useEffect } from "react";
import NavBar from "../Components/Navbar/Navbar";
import Cards from "../Components/Cards";


const Home = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className={`transition-colors duration-300 dark:bg-gray-950 ${darkMode ? "dark" : ""}`}>
      <section className="bg-bannerImg bg-no-repeat bg-cover bg-bottom w-full h-screen dark:bg-gray-950">
        <div className="flex justify-between">
          <NavBar />
        </div>

        <h1 className="text-center text-white dark:text-gray-300 text-8xl font-medium pt-40 px-14">
          Clarity in every <br /> number
        </h1>
        <p className="text-center text-white dark:text-gray-400 text-xl font-light pt-10 px-14 mb-60">
          Turn Your Data into Smart Decisions. Upload your database, <br /> get instant insights, and unlock powerful analytics—all in one <br /> secure platform. No coding required
        </p>
      </section>

      <div className="flex flex-row justify-center bg-gray-100 dark:bg-gray-800">
        <a href="https://www.facebook.com/valenin.it.services">
          <div className="px-48 py-16 bg-valenin bg-contain bg-no-repeat bg-center mx-40"></div>
        </a>
        <a href="https://www.facebook.com/gencysecommercesolutions">
          <div className="px-48 py-16 bg-gencys bg-contain bg-no-repeat bg-center mx-40"></div>
        </a>
      </div>

      {/* Services Section */}
      <section className="bg-white dark:bg-gray-950 transition-all">
        <div className="container mx-auto px-4">
          <h2 id="services" className="text-3xl font-bold text-gray-500 dark:text-gray-300 mb-3 text-center py-10">
            Drive smarter with powerful analytics
          </h2>
        </div>
      </section>

      <Cards />

      {/* Details Section */}
      <div className="bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-300 transition-all">
        <p className="text-2xl mx-14 font-medium mb-3 text-center py-10">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia dignissimos porro magnam voluptatibus reiciendis exercitationem facilis provident sequi quibusdam id.
        </p>
      </div>

      {/* Team Section */}
      <section className="bg-gray-300 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 id="team" className="text-3xl font-bold text-gray-500 dark:text-gray-300 mb-3 text-center py-10">
            Meet the Team!
          </h2>
          <Team />
        </div>
      </section>
    </div>
  );
};

export default Home;
