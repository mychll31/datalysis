import { useState } from "react";

const ForgotPasswordModal = ({ isOpen, setIsOpen }) => {
    const [step, setStep] = useState(1);
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    // Step 1: Handle email submission
    const handleForgotPassword = async () => {
        try {
            const response = await fetch('http://localhost:8000/password-reset/send-code/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            setStep(2);
            console.log("Raw Response:", response);

            if (!response.ok) {
                // Handle non-JSON responses properly
                const text = await response.text();
                console.error("Response Text:", text);
                throw new Error(`Server Error: ${response.status}`);
            }

            const data = await response.json(); 
            console.log("API Response:", data);

        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong.");
        }
    };

    // Step 2: Handle OTP verification
    const handleCodeVerification = async (e) => {
        e.preventDefault();
        if (!code) return alert('Please enter the code.');

        try {
            const response = await fetch('http://localhost:8000/password-reset/verify-code/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Code verified successfully.');
                setStep(3); // Move to Step 3
            } else {
                alert(data.error || 'An error occurred. Please try again.');
            }

        } catch (error) {
            alert('Something went wrong.');
        }
    };

    // Step 3: Handle new password submission
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newPassword) return alert('Please enter a new password.');
        if (newPassword !== confirmNewPassword) return alert('Passwords do not match.');

        try {
            const response = await fetch('http://localhost:8000/password-reset/set-newpassword/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: code, new_password: newPassword })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Password reset successful!');
                setStep(4);
            } else {
                alert(data.message || 'Failed to reset password.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong.');
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-300 to-teal-800 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <h1 className="text-2xl font-semibold text-gray-800">Forgot Password?</h1>

                        {/* Step 1: Enter Email */}
                        {step === 1 && (
                            <>
                                <p className="font-light text-gray-500">The reset password will be sent <br /> to your email.</p>
                                <div className="py-8 space-y-6 text-gray-700">
                                    <div className="relative">
                                        <input
                                            id="email"
                                            type="text"
                                            className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700"
                                            placeholder="Email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <label
                                            htmlFor="email"
                                            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">
                                            Email Address
                                        </label>
                                    </div>
                                    <button className="bg-cyan-800 text-white rounded-md px-4 py-2 w-full" onClick={handleForgotPassword}>
                                        Reset Password
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Step 2: Enter Code */}
                        {step === 2 && (
                            <>
                                <p className="font-light text-gray-500">Enter the Code sent to <br></br> <span className="font-semibold text-gray-700">{email}</span> .</p>
                                <div className="py-8 space-y-6 text-gray-700">
                                    <div className="relative">
                                        <input
                                            id="resetCode"
                                            type="text"
                                            className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700"
                                            placeholder="Reset Code"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                        />
                                        <label
                                            htmlFor="resetCode"
                                            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">
                                            Code
                                        </label>
                                    </div>
                                    <button className="bg-cyan-800 text-white rounded-md px-4 py-2 w-full" onClick={handleCodeVerification}>
                                        Verify Code
                                    </button>
                                    <button className="mt-3 text-gray-600 underline" onClick={() => setStep(step - 1)}>Back</button>
                                </div>
                            </>
                        )}

                        {/* Step 3: Set New Password */}
                        {step === 3 && (
                            <>
                                <p className="font-light text-gray-500">Enter a new password for your account.</p>
                                <div className="py-8 space-y-6 text-gray-700">
                                    {/* New Password Input */}
                                    <div className="relative">
                                        <input
                                            id="newPassword"
                                            type="password"
                                            className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700"
                                            placeholder="New Password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <label

                                            htmlFor="newPassword"
                                            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">
                                            New Password
                                        </label>
                                    </div>

                                    {/* Confirm Password Input */}
                                    <div className="relative">
                                        <input
                                            id="confirmNewPassword"
                                            type="password"
                                            className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700"
                                            placeholder="Confirm Password"
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        />
                                        <label
                                            htmlFor="confirmNewPassword"
                                            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">
                                            Confirm Password
                                        </label>
                                    </div>

                                    {/* Reset Password Button */}
                                    <button
                                        className="bg-cyan-800 text-white rounded-md px-4 py-2 w-full"
                                        onClick={handleResetPassword}
                                    >
                                        Reset Password
                                    </button>
                                    <button className="mt-3 text-gray-600 underline" onClick={() => setStep(step - 1)}>Back</button>
                                </div>
                            </>
                        )}
                        {/* Step 4: Confirmation */}
                        {step === 4 && (
                            <>
                                <p className="font-light text-gray-500">Your password has been successfully changed!</p>
                                <div className="py-8 space-y-6 text-gray-700">
                                    <button className="bg-cyan-800 text-white rounded-md px-4 py-2 w-full" onClick={() => setIsOpen(false)}>
                                        Close
                                    </button>
                                </div>
                            </>
                        )}

                        <button className="mt-3 text-gray-600 underline" onClick={() => setIsOpen(false)}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
