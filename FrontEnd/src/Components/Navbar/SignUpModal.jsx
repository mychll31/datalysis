import { useEffect, useState } from "react"; // Import useEffect
import { VerificationStep } from './VerificationStep';
import { handleResendVerification } from '../../utils/verificationUtils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("ALL ENV:", import.meta.env);
console.log("API base URL:", API_BASE_URL)

const SignUpModal = ({ isOpen, setIsOpen, setIsLoginOpen }) => {
    // ✅ Declare state at the top level
    const [username, setUsername] = useState(""); // Added username
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setSteps] = useState(1);
    const [code, setCode] = useState("");
    const [isResending, setIsResending] = useState(false);


    const fetchCsrfToken = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/csrf/`, {
                method: "GET",
                credentials: "include", // ✅ Important for cookies
            });

            console.log("CSRF Fetch Response:", response); // ✅ Log response object

            if (!response.ok) {
                throw new Error(`Failed to fetch CSRF token: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("CSRF Token Response:", data); // ✅ Log response JSON

            if (data.csrfToken) {
                localStorage.setItem("csrfToken", data.csrfToken);
                console.log("Stored CSRF Token:", localStorage.getItem("csrfToken")); // ✅ Verify storage
            } else {
                console.error("CSRF token missing from response");
            }
        } catch (err) {
            console.error("Error fetching CSRF token:", err);
        }
    };

    // Call this function when the modal opens or when the component mounts
    useEffect(() => {
        if (isOpen) {
            fetchCsrfToken();
        }
    }, [isOpen]); // Add isOpen as a dependency

    const handleSignUp = async () => {
        setError("");

        if (!email || !password || !confirmPassword || !username) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const csrfToken = localStorage.getItem("csrfToken"); // Get CSRF token

            const response = await fetch(`${API_BASE_URL}/api/signup/`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken // ✅ Include CSRF token
                },
                credentials: "include", // ✅ Required for cookies
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            console.log("API Response:", data);

            if (response.ok) {
                console.log("Signup successful:", data);
                setSteps(2);
                // setIsOpen(false); removed modal should stay open to this point to show the email notice
            } else {
                setError(data.error || "Signup failed. Try again.");
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setError("Network error. Please try again.");
        }

        setLoading(false);
    };

    const handleSignupCode = async (e) => {
        e.preventDefault();

        if (!code) return alert('Please enter the code.');
        try {
            const response = await fetch(`${API_BASE_URL}/api/signup_verify/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Code verified successfully.');
                setSteps(3); // Move to Step 3
            } else {
                alert(data.error || 'An error occurred. Please try again.');
            }

        } catch (error) {
            alert('Something went wrong.');
        }
    };

    // Handle Enter key press to move to the next step
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (step === 1) {
                handleSignUp(); // Trigger sign-up on Enter key press in Step 1
            } else if (step === 2) {
                handleSignupCode(e); // Trigger code verification on Enter key press in Step 2
            }
        }
    };
    const handleResendCode = async () => {
        try {
            await handleResendVerification(email, setIsResending);
        } catch (error) {
          console.log("Error resending verification code:", error);
        }
    };
    return !isOpen ? null : (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-300 to-teal-800 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    {/*Step 1*/}
                    {step === 1 && (
                        <>
                            <h1 className="text-2xl font-semibold text-gray-800">Sign Up</h1>
                            {error && <p className="text-red-500">{error}</p>}
                            <div className="py-8 space-y-6 text-gray-700">
                                <div className="relative">
                                    <input
                                        id="username"
                                        type="text"
                                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onKeyDown={handleKeyDown} // Attach keydown handler
                                    />
                                    <label htmlFor="username" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">
                                        Username
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        id="email"
                                        type="email"
                                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyDown={handleKeyDown} // Attach keydown handler
                                    />
                                    <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">
                                        Email Address
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type="password"
                                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyDown={handleKeyDown} // Attach keydown handler
                                    />
                                    <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">
                                        Password
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onKeyDown={handleKeyDown} // Attach keydown handler
                                    />
                                    <label htmlFor="confirmPassword" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">
                                        Confirm Password
                                    </label>
                                </div>

                                <button
                                    className="bg-green-800 text-white rounded-md px-4 py-2 w-full"
                                    onClick={handleSignUp}
                                    disabled={loading}
                                >
                                    {loading ? "Signing up..." : "Create Account"}
                                </button>
                            </div>
                        </>
                    )}


                        {/*Step 2 Just telling user that he needs to verify his account calls the Verification Component*/}
                        {step === 2 && (
                        <VerificationStep 
                            email={email}
                            code={code}
                            setCode={setCode}
                            onSubmit={handleSignupCode}
                            onResend={handleResendCode} 
                            onBack={() => setStep(1)}
                            isLoading={loading}
                            isResending={isResending}  
                            error={error}
                        />
                    )}


                        {/*Step 3 WEEWWWW*/}
                        {step === 3 && (
                            <>
                                <h2 className="text-2xl font-semibold text-gray-800">Sign up Complete!</h2>
                                <div className="py-8 space-y-6 text-gray-700">
                                    <p className="text-gray-600">You have successfully signed up. You can now log in to your account.</p>
                                    <button
                                        className="bg-cyan-800 text-white rounded-md px-4 py-2 w-full hover:bg-cyan-700 transition-colors"
                                        onClick={() => setIsOpen(false)}>
                                        Log In
                                    </button>
                                </div>
                            </>
                        )}
                        
                    <button className="mt-3 text-gray-600 underline" onClick={() => setIsOpen(false)}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default SignUpModal;
