

    export const VerificationStep = ({ 
        email, 
        code, 
        setCode, 
        onSubmit, 
        onResend,  
        onBack, 
        isLoading, 
        isResending, 
        error
    }) => (
        <>
            <h2 className="text-2xl font-semibold text-gray-800">Almost there!</h2>
            <div className="py-8 space-y-6 text-gray-700">
                <p className="text-gray-600">
                    An email has been sent to <strong className="text-gray-800">{email}</strong>. 
                    Please verify your email address.
                </p>
                
                <div className="relative">
                    <input
                        type="text"
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700"
                        placeholder="Verification Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">
                        Verification Code
                    </label>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onResend}
                        className="text-cyan-700 text-sm hover:underline flex items-center"
                        disabled={isResending || isLoading}
                    >
                        {isResending ? (
                            <>
                                <svg className="animate-spin h-4 w-4 mr-1 text-cyan-700" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                Sending...
                            </>
                        ) : (
                            "Didn't receive a code? Resend"
                        )}
                    </button>
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <div className="flex space-x-4">
                    <button 
                        className="bg-cyan-800 text-white rounded-md px-4 py-2 w-full hover:bg-cyan-700 transition-colors"
                        onClick={onSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                Verifying...
                            </>
                        ) : (
                            "Confirm"
                        )}
                    </button>
                </div>

                {onBack && (
                    <button 
                        className="text-gray-600 underline" 
                        onClick={onBack}
                    >
                        Back
                    </button>
                )}
            </div>
        </>
    );