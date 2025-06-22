// homepagelinks.js
import { useNavigate } from "react-router-dom"; // Import useNavigate

const homepagelinks = ({ isOpen, setIsLoginOpen }) => {
  const navigate = useNavigate(); // Initialize navigate

  const handleGetStartedClick = () => {
    // Navigate to the upload page
    navigate("/upload-page");
  };

  return (
    <div
      className={`flex-col md:flex-row md:flex transition-transform transform ${
        isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 hidden"
      } md:opacity-100 md:scale-100 md:items-center md:justify-end w-full md:w-auto`}
    >
   
      <a
        href="#team"
        className="px-4 py-2 mt-2 text-xl font-semibold rounded-lg hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 transition-all duration-300 ease-in focus:bg-gray-200 md:mt-0 md:ml-4"
      >
        Team
      </a>
      <a
        href="#services"
        className="px-4 py-2 mt-2 text-xl font-semibold rounded-lg hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 transition-all duration-300 ease-in focus:bg-gray-200 md:mt-0 md:ml-4"
      >
        Services
      </a>
      <a
        href="#contact"
        className="px-4 py-2 mt-2 text-xl font-semibold rounded-lg hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 transition-all duration-300 ease-in focus:bg-gray-200 md:mt-0 md:ml-4"
      >
        Contact
      </a>

      <button
        className="ml-5 px-4 py-2 text-xl rounded-lg bg-amber-400 text-black font-semibold hover:text-white hover:bg-amber-600 transition-all duration-300"
        onClick={handleGetStartedClick} // Handle the click
      >
        Get Started!
      </button>
    </div>
  );
};

export default homepagelinks;
