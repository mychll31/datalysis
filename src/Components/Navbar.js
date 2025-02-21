import { useState } from "react";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav className="w-full bg-gray-800 bg-opacity-50 text-white dark:bg-gray-800 dark:text-gray-200 z-50">
            <div className="max-w-screen-xl flex flex-col md:flex-row items-center justify-between px-4 mx-auto ">

                {/* Left: Logo */}
                <div className="flex items-center justify-between w-full md:w-auto">
                    <div className="mt-2 py-9 bg-logo bg-no-repeat bg-cover bg-center outline-transparent w-44 rounded-xl">
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="rounded-lg md:hidden focus:outline-none focus:shadow-outline"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Right: Navigation Links */}
                <div className={`flex-col md:flex-row md:flex transition-transform transform ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 hidden"} md:opacity-100 md:scale-100 md:items-center md:justify-end w-full md:w-auto`}>
                    <p className="px-4 py-2 mt-2 text-xl text-amber-400 font-semibold rounded-lg focus:text-gray-900   focus:bg-gray-200 md:mt-0 ">Home</p>
                    <a href="#" className="px-4 py-2 mt-2 text-xl font-semibold rounded-lg hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 1transition-transform duration-300 ease-in focus:bg-gray-200 md:mt-0 md:ml-4">Team</a>
                    <a href="#" className="px-4 py-2 mt-2 text-xl font-semibold rounded-lg hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 1transition-transform duration-300 ease-in focus:bg-gray-200 md:mt-0 md:ml-4">Services</a>
                    <a href="#" className="px-4 py-2 mt-2 text-xl font-semibold rounded-lg hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 1transition-transform duration-300 ease-in focus:bg-gray-200 md:mt-0 md:ml-4">Contact</a>
                    

                    {/* Dropdown Menu */}
                    <div className="relative">
                        <button
                            className="px-4 py-2 mt-2 text-xl font-semibold flex items-center rounded-lg hover:bg-gray-200 hover:text-gray-900 focus:text-gray-900 focus:bg-gray-200 1transition-transform duration-300 focus:outline-none focus:shadow-outline md:mt-0 md:ml-4"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            More
                            <svg className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? "rotate-180" : "rotate-0"}`} fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        <div className={`absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg transition-all duration-200 ease-out transform ${isDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                            <a href="#" className="block px-4 py-2 text-l rounded-lg text-gray-800 font-semibold hover:bg-gray-200">Appearance</a>
                            <a href="#" className="block px-4 py-2 text-l rounded-lg text-gray-800 font-semibold hover:bg-gray-200">Analytics</a>
                        </div>
                    </div>
                        <a href="Upload-Page" className="block px-4 py-2 text-xl rounded-lg bg-amber-300 outline outline-gray-200 text-gray-800 font-semibold ml-5 hover:bg-gray-200 hover:outline-amber-300">Get Started</a>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
