import { useState } from "react";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);

    // Mock Google sign-in function (Replace with real implementation)
    const handleGoogleSignIn = () => {
        console.log("Google Sign-In clicked");
        // Implement Firebase Auth, OAuth, or backend authentication here
    };

    return (
        <nav className="w-full bg-gray-800 bg-opacity-50 text-white z-50">
            <div className="max-w-screen-xl flex flex-col md:flex-row items-center justify-between px-4 mx-auto">
                {/* Left: Logo */}
                <div className="flex items-center justify-between w-full md:w-auto">
                    <div className="mt-2 py-9 bg-logo bg-no-repeat bg-cover bg-center outline-transparent w-44 rounded-xl"></div>

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
                    <p className="px-4 py-2 mt-2 text-xl text-amber-400 font-semibold rounded-lg focus:text-gray-900 focus:bg-gray-200 md:mt-0">Home</p>
                    <a href="#team" className="px-4 py-2 mt-2 text-xl font-semibold rounded-lg hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 transition-all duration-300 ease-in focus:bg-gray-200 md:mt-0 md:ml-4">Team</a>
                    <a href="#services" className="px-4 py-2 mt-2 text-xl font-semibold rounded-lg hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 transition-all duration-300 ease-in focus:bg-gray-200 md:mt-0 md:ml-4">Services</a>
                    <a href="#" className="px-4 py-2 mt-2 text-xl font-semibold rounded-lg hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 transition-all duration-300 ease-in focus:bg-gray-200 md:mt-0 md:ml-4">Contact</a>

                    {/* Login Button */}
                    <button
                        className="ml-5 px-4 py-2 text-xl rounded-lg bg-amber-400 text-black font-semibold hover:text-white hover:bg-amber-600 transition-all duration-300"
                        onClick={() => setIsLoginOpen(true)}
                    >
                        Login
                    </button>
                </div>
            </div>

            {/* Floating Login Form */}
            {isLoginOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-300 to-teal-800 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                        <div className="relative px-14 pt-6 bg-white shadow-lg sm:rounded-3xl ">
                            <div className="max-w-md mx-auto">
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-800">Login</h1>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    <div className="py-8 space-y-6 text-gray-700 sm:text-sm sm:leading-7">
                                        <div className="relative">
                                            <input id="email" type="text" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700" placeholder="Email address" />
                                            <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">Email Address</label>
                                        </div>
                                        <div className="relative">
                                            <input id="password" type="password" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700" placeholder="Password" />
                                            <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">Password</label>
                                        </div>

                                        {/* Sign In with Google */}
                                        <button 
                                            onClick={handleGoogleSignIn} 
                                            className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-600 rounded-md px-4 py-2 w-full hover:bg-gray-100 transition-all"
                                        >
                                            <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-1024.png" alt="Google" className="w-5 h-5" />
                                            <span>Sign in with Google</span>
                                        </button>

                                        <button className="bg-cyan-800 text-white rounded-md px-4 py-2 w-full">Submit</button>
                                        <button className="outline-cyan-800 outline  text-cyan-800 rounded-md px-3 py-1 w-full" onClick={() => { setIsLoginOpen(false); setIsSignUpOpen(true); }}>Sign Up</button><br />
                                        <button className="text-gray-600 underline" onClick={() => { setIsLoginOpen(false); setIsForgotPasswordOpen(true); }}>Forgot Password?</button><br />
                                        <button className="mt-3 text-gray-600 underline" onClick={() => setIsLoginOpen(false)}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Floating Forgot Password Form */}
            {isForgotPasswordOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-300 to-teal-800 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                    <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                        <div className="max-w-md mx-auto">
                            <h1 className="text-2xl font-semibold text-gray-800">Forgot Password?</h1>
                            <p className="font-light text-gray-500">The reset password will be sent <br /> to your email.</p>
                            <div className="py-8 space-y-6 text-gray-700">
                                 <div className="relative">
                                    <input id="email" type="text" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700" placeholder="Email address" />
                                    <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">Email Address</label>
                                </div>
                                <button className="bg-cyan-800 text-white rounded-md px-4 py-2 w-full">Reset Password</button>
                                <button className="mt-3 text-gray-600 underline" onClick={() => setIsForgotPasswordOpen(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        {/* Sign-Up Modal */}
        {isSignUpOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-300 to-teal-800 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                    <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                        <h1 className="text-2xl font-semibold text-gray-800">Sign Up</h1>
                        <div className="py-8 space-y-6 text-gray-700">
                        <div className="relative">
                            <input id="email" type="text" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700" placeholder="Email address" />
                            <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">Email Address</label>
                        </div>
                        <div className="relative">
                            <input id="password" type="password" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700" placeholder="Password" />
                            <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">Password</label>
                        </div>
                        <div className="relative">
                            <input id="confirm_password" type="confirm_password" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700" placeholder="Confirm Password" />
                            <label htmlFor="confirm_password" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">Confirm Password</label>
                        </div>

                            <button className="bg-green-800 text-white rounded-md px-4 py-2 w-full">Create Account</button>
                            <button className="mt-3 text-gray-600 underline" onClick={() => setIsSignUpOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </nav>
    );
};

export default NavBar;
