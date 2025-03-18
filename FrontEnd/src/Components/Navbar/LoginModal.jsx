import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const LoginModal = ({ isOpen, setIsOpen, setIsSignUpOpen, setIsForgotPasswordOpen, handleGoogleSignIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const[rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate(); // ✅ Initialize useNavigate here

    useEffect(() => {
        const savedRememberMe = localStorage.getItem("rememberMe") === "true";
        setRememberMe(savedRememberMe);

        if (savedRememberMe) {
            const savedEmail = localStorage.getItem("rememberedEmail") || "";
            const savedPassword = localStorage.getItem("rememberedPassword") || "";

            if (savedEmail) setEmail(savedEmail);
            if (savedPassword) setPassword(savedPassword);
        }else{
            setEmail("");
            setPassword("");
        }
    }, []);

    if (!isOpen) return null;

    const getCSRFToken = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/csrf/", {
                method: "GET",
                credentials: "include", // Ensures cookies are sent
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
        setError(""); // Clear previous errors

        const csrfToken = await getCSRFToken();
        if (!csrfToken) {
            setError("CSRF token fetch failed.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken, // Include CSRF token
                },
                credentials: "include", // Ensure cookies are sent
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login successful:", data);
                localStorage.setItem("username", data.username);

                if (rememberMe) {
                    console.log("Saving Login Info....");
                    localStorage.setItem("rememberedEmail", email);
                    localStorage.setItem("rememberedPassword", password);
                    localStorage.setItem("rememberMe", "true");
                } else {
                    console.log("Clearing Login Info....");
                    localStorage.removeItem("rememberedEmail");
                    localStorage.removeItem("rememberedPassword");
                    localStorage.removeItem("rememberMe");
                }

                setIsOpen(false); // Close modal on success
                navigate("/homepage"); // ✅ Redirect to Upload-Page
            } else {
                setError(data.error || "Login failed. Please try again.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error(err);
        }
    };

    return (
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
                                    <input 
                                        id="email" 
                                        type="text"
                                        autoComplete="off"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700" 
                                        placeholder="Email address" 
                                    />
                                    <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">Email Address</label>
                                </div>
                                <div className="relative">
                                    <input 
                                        id="password" 
                                        type="password"
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700" 
                                        placeholder="Password" 
                                    />
                                    <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">Password</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 text-cyan-800 border border-gray-300 rounded-md focus:ring-cyan-800"
                                    />
                                    <label htmlFor="rememberMe" className="text-gray-600">Remember me</label>
                                </div>

                                {error && <p className="text-red-500">{error}</p>}

                                <button 
                                    onClick={handleGoogleSignIn} 
                                    className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-600 rounded-md px-4 py-2 w-full hover:bg-gray-100 transition-all"
                                >
                                    <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-1024.png" alt="Google" className="w-5 h-5" />
                                    <span>Sign in with Google</span>
                                </button>

                                <button onClick={handleSubmit} type='submit' className="bg-cyan-800 text-white rounded-md px-4 py-2 w-full">Submit</button>
                                <button className="outline-cyan-800 outline text-cyan-800 rounded-md px-3 py-1 w-full" onClick={() => { setIsOpen(false); setIsSignUpOpen(true); }}>Sign Up</button><br />
                                <button className="text-gray-600 underline" onClick={() => { setIsOpen(false); setIsForgotPasswordOpen(true); }}>Forgot Password?</button><br />
                                <button className="mt-3 text-gray-600 underline" onClick={() => setIsOpen(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;