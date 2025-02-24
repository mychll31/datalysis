import { useState } from "react";

const handleGoogleSignIn = () => {
    console.log("Google Sign-In clicked");
    // Implement Firebase Auth, OAuth, or backend authentication here
};

const Login = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);

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
}
export default Login