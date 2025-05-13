import { useState, useEffect } from "react";
import MobileMenuButton from "./MobileMenuButton";
import { Sun, Moon } from "lucide-react"; // Import icons
import HomePageLinks from "./homepagelinks"; // Correct import

const homenav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
    const [animating, setAnimating] = useState(false); // Controls animation
    const [isOnProfilePage, setIsOnProfilePage] = useState(false);
    // Retrieve profile image and user info from localStorage (if available)
    const profileImage = localStorage.getItem("profileImage") || "https://via.placeholder.com/40"; // Default to placeholder if no image
    const user = localStorage.getItem("User");

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setAnimating(true);
        setTimeout(() => {
            setDarkMode(!darkMode);
            setAnimating(false);
        }, 300); // Delay animation
    };

    const handleImageClick = () => {
        const currentPath = window.location.pathname;
        if (currentPath === '/profile') {
            window.location.href = "/homepage";
        } else {
            window.location.href = "/profile";
        }
    };

    return (
        <nav className="w-full bg-gray-800 text-white z-50 transition-colors duration-300">
            <div className="max-w-screen-xl flex flex-col md:flex-row items-center justify-between px-4 mx-auto">
                <div className="flex items-center justify-between w-full md:w-auto">
                    <div className="mt-2 py-9 bg-logo bg-no-repeat bg-cover bg-center outline-transparent w-44 rounded-xl"></div>
                    <MobileMenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
                </div>

                <div className="flex items-center space-x-4">
                    {/* Use HomePageLinks Component */}
                    <HomePageLinks isOpen={isOpen} />

                    {/* Profile Image if Logged In */}
                    {user && (
                        <div className="relative">
                            <img
                                src={profileImage} // Display profile image from localStorage
                                alt="Profile"
                                className="h-10 w-10 rounded-full border-2 border-white object-cover cursor-pointer"
                                // Optionally, add a link to profile page
                                onClick={handleImageClick} // Toggle between profile and homepage
                            />
                        </div>
                    )}

                    {/* Dark Mode Toggle Button with Smooth Animation */}
                    <button 
                        onClick={toggleDarkMode} 
                        className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-300 transform hover:scale-110"
                    >
                        <span className={`transition-transform duration-500 ease-in-out ${darkMode ? "rotate-180" : "-rotate-180"}`}>
                            {darkMode ? (
                                <Sun className="text-yellow-400 w-6 h-6 animate-[spin_0.5s_ease-in-out]" />
                            ) : (
                                <Moon className="text-gray-300 w-6 h-6 animate-[spin_0.5s_ease-in-out]" />
                            )}
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default homenav;
