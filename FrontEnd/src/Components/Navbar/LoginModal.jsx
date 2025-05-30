import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VerificationStep } from './VerificationStep';
import { handleResendVerification } from '../../utils/verificationUtils';

// for Vite:
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API base URL:", API_BASE_URL)
// for CRA:
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const LoginModal = ({ isOpen, setIsOpen, setIsSignUpOpen, setIsForgotPasswordOpen }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState("");


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
            const response = await fetch(`${API_BASE_URL}/api/csrf/`, {
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
            const response = await fetch(`${API_BASE_URL}/api/login/`, {
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
                if (data.error === "Please Activate your account") {
                    setError(
                        <span className="text-red-500 cursor-pointer underline"
                            onClick={() => setShowVerification(true)}>
                            Please activate your account (Click here to verify)
                        </span>
                    );
                } else {
                    setError(data.error || "Login failed. Please try again.");
                }
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error(err);
        } finally {
            setIsLoggingIn(false);
        }
    };
    // if possible let's make this reusable and move it to a utils file
    const handleSignupCode = async (e) => {
        e.preventDefault();

        if (!code) return alert('Please enter the code.');
        try {
            const response = await fetch(`${API_BASE_URL}/signup_verify/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Code verified successfully.');
                setShowVerification(false);
            } else {
                alert(data.error || 'An error occurred. Please try again.');
            }

        } catch (error) {
            alert('Something went wrong.');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };
    // Sends the code to the backend for verification
    const handleVerification = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/signup_verify/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: verificationCode }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // If verification succeeds, try logging in again
                await handleSubmit();
            } else {
                setError(data.error || "Verification failed");
            }
        } catch (err) {
            setError("Error verifying code");
        }
    };

    const handleResendCode = async () => {
        try {
            await handleResendVerification(email, setIsResending);
        } catch (error) {
          console.log("Error resending verification code:", error);
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

            {/* Shows the veification modal again if the user is not yet verified */}
            {showVerification && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                    <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <VerificationStep 
                            email={email}
                            code={code}
                            setCode={setCode}
                            onSubmit={handleSignupCode}
                            onResend={handleResendCode} 
                            isLoading={loading}
                            isResending={isResending}  
                            error={error}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginModal;
