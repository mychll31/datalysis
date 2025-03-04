import { useState, useEffect } from "react"; // Import useEffect

const SignUpModal = ({ isOpen, setIsOpen }) => {
    // ✅ Declare state at the top level
    const [username, setUsername] = useState(""); // Added username
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchCsrfToken = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/csrf/", {
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
    
            const response = await fetch("http://localhost:8000/api/signup/", {
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
                setIsOpen(false);
            } else {
                setError(data.error || "Signup failed. Try again.");
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setError("Network error. Please try again.");
        }
    
        setLoading(false);
    };
    
    

    return !isOpen ? null : (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-300 to-teal-800 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <h1 className="text-2xl font-semibold text-gray-800">Sign Up</h1>

                    {error && <p className="text-red-500">{error}</p>}

                    <div className="py-8 space-y-6 text-gray-700">
                        <div className="relative">
                            <input 
                                id="username" // ✅ Added ID
                                type="text"
                                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                        <button className="mt-3 text-gray-600 underline" onClick={() => setIsOpen(false)}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpModal;
