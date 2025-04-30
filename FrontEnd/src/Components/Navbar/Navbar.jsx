import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MobileMenuButton from "./MobileMenuButton";
import NavigationLinks from "./NavigationLinks";
import LoginModal from "./LoginModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import SignUpModal from "./SignUpModal";
import { Sun, Moon } from "lucide-react";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );
    const [animating, setAnimating] = useState(false);

    const isLoggedIn = !!localStorage.getItem("User");

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
            setDarkMode(prevMode => {
                const newMode = !prevMode;
                localStorage.setItem("theme", newMode ? "dark" : "light");
                return newMode;
            });
            setAnimating(false);
        }, 300);
    };

    return (
        <nav className="w-full bg-gray-800 bg-opacity-50 text-white z-50 transition-colors duration-300">
            <div className="max-w-screen-xl flex flex-col md:flex-row items-center justify-between px-4 mx-auto">
                <div className="flex items-center justify-between w-full md:w-auto">
                    <Link to="/">
                        <div className="mt-2 py-9 bg-logo bg-no-repeat bg-cover bg-center outline-transparent w-44 rounded-xl"></div>
                    </Link>
                    <MobileMenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
                </div>

                <div className="flex items-center space-x-4">
                    {/* Navigation Links and Conditional Profile */}
                    <NavigationLinks isOpen={isOpen} setIsLoginOpen={setIsLoginOpen} />
                    {isLoggedIn && (
                        <Link
                            to="/"
                            className="text-white hover:text-cyan-400 transition-colors"
                        >
                           
                        </Link>
                    )}

                    {/* Dark Mode Toggle */}
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

            {/* Modals */}
            <LoginModal
                isOpen={isLoginOpen}
                setIsOpen={setIsLoginOpen}
                setIsSignUpOpen={setIsSignUpOpen}
                setIsForgotPasswordOpen={setIsForgotPasswordOpen}
            />

            <ForgotPasswordModal
                isOpen={isForgotPasswordOpen}
                setIsOpen={setIsForgotPasswordOpen}
            />

            <SignUpModal
                isOpen={isSignUpOpen}
                setIsOpen={setIsSignUpOpen}
                setIsLoginOpen={setIsLoginOpen}
            />
        </nav>
    );
};

export default NavBar;
