import { useState } from "react";

function EmailForm() {
    const [email, setEmail] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch("http://127.0.0.1:8000/api/email/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        console.log(data);
    };

    return (
        <div className="relative">
            <form onSubmit={handleSubmit}>
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
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                >
                    Email Address
                </label>
                <button type="submit" className="mt-2 px-4 py-2 bg-cyan-700 text-white rounded">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default EmailForm;
