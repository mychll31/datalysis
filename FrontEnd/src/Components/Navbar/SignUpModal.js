// SignUpModal.js
const SignUpModal = ({ isOpen, setIsOpen }) => {
    if (!isOpen) return null;

    return (
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
                            <input id="confirm_password" type="password" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-700" placeholder="Confirm Password" />
                            <label htmlFor="confirm_password" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600">Confirm Password</label>
                        </div>

                        <button className="bg-green-800 text-white rounded-md px-4 py-2 w-full">Create Account</button>
                        <button className="mt-3 text-gray-600 underline" onClick={() => setIsOpen(false)}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpModal;