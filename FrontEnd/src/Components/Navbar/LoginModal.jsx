import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginModal = ({ isOpen, setIsOpen, setIsSignUpOpen, setIsForgotPasswordOpen, handleGoogleSignIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const savedRememberMe = localStorage.getItem("rememberMe") === "true";
        setRememberMe(savedRememberMe);

        const savedEmail = localStorage.getItem("rememberedEmail") || "";
        if (savedEmail) setEmail(savedEmail);

        if (savedRememberMe) {
            const savedPassword = localStorage.getItem("rememberedPassword") || "";
            if (savedPassword) setPassword(savedPassword);
        } else {
            setPassword("");
        }
    }, []);

    if (!isOpen) return null;

    const getCSRFToken = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/csrf/", {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to fetch CSRF token");

            const data = await response.json();
            return data.csrfToken;
        } catch (error) {
            console.error("CSRF fetch error:", error);
            return null;
        }
    };

    const handleSubmit = async () => {
        setError("");
        setIsLoggingIn(true);

        const csrfToken = await getCSRFToken();
        if (!csrfToken) {
            setError("CSRF token fetch failed.");
            setIsLoggingIn(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Always save email
                localStorage.setItem("rememberedEmail", email);

                if (rememberMe) {
                    localStorage.setItem("rememberedPassword", password);
                    localStorage.setItem("rememberMe", "true");
                } else {
                    localStorage.removeItem("rememberedPassword");
                    localStorage.setItem("rememberMe", "false");
                }

                // Ensure email is saved in User object even if backend doesn't send it
                const fullUser = { ...data, email };
                localStorage.setItem("User", JSON.stringify(fullUser));

                toast.success("LOGIN SUCCESSFULLY", { autoClose: 3000 });

                setTimeout(() => {
                    setIsOpen(false);
                    navigate("/homepage");
                }, 3000);
            } else {
                setError(data.error || "Login failed. Please try again.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error(err);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-300 to-teal-800 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-14 pt-6 bg-white shadow-lg sm:rounded-3xl">
                    <div className="max-w-md mx-auto">
                        <h1 className="text-2xl font-semibold text-gray-800">Login</h1>
                        <div className="py-8 space-y-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Email"
                                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700"
                                />
                                <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">
                                    Email Address
                                </label>
                            </div>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Password"
                                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700"
                                />
                                <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">
                                    Password
                                </label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-cyan-800 border-gray-300 rounded-md"
                                />
                                <label className="text-gray-600">Remember me</label>
                            </div>

                            {error && <p className="text-red-500">{error}</p>}

                            <button
                                onClick={handleGoogleSignIn}
                                className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-600 rounded-md px-4 py-2 w-full hover:bg-gray-100"
                            >
                                <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-1024.png" alt="Google" className="w-5 h-5" />
                                <span>Sign in with Google</span>
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={isLoggingIn}
                                className="bg-cyan-800 text-white rounded-md px-4 py-2 w-full flex justify-center items-center"
                            >
                                {isLoggingIn ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                        </svg>
                                        Logging in...
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </button>

                            <button className="outline-cyan-800 outline text-cyan-800 rounded-md px-3 py-1 w-full" onClick={() => {
                                setIsOpen(false);
                                setIsSignUpOpen(true);
                            }}>
                                Sign Up
                            </button>

                            <button className="text-gray-600 underline" onClick={() => {
                                setIsOpen(false);
                                setIsForgotPasswordOpen(true);
                            }}>
                                Forgot Password?
                            </button>
                            <br />
                            <button className="text-gray-600 underline mt-3" onClick={() => setIsOpen(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default LoginModal;
