// NavBar.js
import { useState } from "react";
import MobileMenuButton from "./MobileMenuButton";
import NavigationLinks from "./NavigationLinks";
import LoginModal from "./LoginModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import SignUpModal from "./SignUpModal";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);

    const handleGoogleSignIn = () => {
        console.log("Google Sign-In clicked");
        // Implement Firebase Auth, OAuth, or backend authentication here
    };

    return (
        <nav className="w-full bg-gray-800 bg-opacity-50 text-white z-50">
            <div className="max-w-screen-xl flex flex-col md:flex-row items-center justify-between px-4 mx-auto">
                <div className="flex items-center justify-between w-full md:w-auto">
                    <div className="mt-2 py-9 bg-logo bg-no-repeat bg-cover bg-center outline-transparent w-44 rounded-xl"></div>
                    <MobileMenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
                </div>

                <NavigationLinks isOpen={isOpen} setIsLoginOpen={setIsLoginOpen} />
            </div>

            <LoginModal 
                isOpen={isLoginOpen} 
                setIsOpen={setIsLoginOpen} 
                setIsSignUpOpen={setIsSignUpOpen} 
                setIsForgotPasswordOpen={setIsForgotPasswordOpen} 
                handleGoogleSignIn={handleGoogleSignIn}
            />

            <ForgotPasswordModal 
                isOpen={isForgotPasswordOpen} 
                setIsOpen={setIsForgotPasswordOpen} 
            />

            <SignUpModal 
                isOpen={isSignUpOpen} 
                setIsOpen={setIsSignUpOpen} 
            />
        </nav>
    );
};

export default NavBar;