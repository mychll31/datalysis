import "@mdi/font/css/materialdesignicons.min.css";

const Team = () => {
    return (
        <div className="flex justify-center">
            <div className="flex flex-col mt-8">
                <div className="container max-w-7xl px-4">
                    <div className="flex flex-wrap">
                        {/* Member #1 */}
                        <div className="w-full md:w-6/12 lg:w-1/5 mb-6 px-6 sm:px-6 lg:px-4">
                            <div className="flex flex-col">
                                {/* Avatar (Removed <a>) */}
                                <img className="mx-auto rounded-2xl drop-shadow-md hover:drop-shadow-xl transition-all duration-200 delay-100"
                                    src="https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?fit=clamp&w=400&h=400&q=80"
                                    alt="Tranter Jaskulski"
                                />
                                {/* Details */}
                                <div className="text-center mt-6">
                                    <h1 className="text-gray-900 text-xl font-bold mb-1">Tranter Jaskulski</h1>
                                    <div className="text-gray-700 font-light mb-2">Founder & Specialist</div>
                                    <SocialIcons />
                                </div>
                            </div>
                        </div>

                        {/* Member #2 */}
                        <div className="w-full md:w-6/12 lg:w-1/5 mb-6 px-6 sm:px-6 lg:px-4">
                            <div className="flex flex-col">
                                <img className="mx-auto rounded-2xl drop-shadow-md hover:drop-shadow-xl transition-all duration-200 delay-100"
                                    src="https://images.unsplash.com/photo-1634896941598-b6b500a502a7?fit=clamp&w=400&h=400&q=80"
                                    alt="Denice Jagna"
                                />
                                <div className="text-center mt-6">
                                    <h1 className="text-gray-900 text-xl font-bold mb-1">Denice Jagna</h1>
                                    <div className="text-gray-700 font-light mb-2">Tired & M. Specialist</div>
                                    <SocialIcons />
                                </div>
                            </div>
                        </div>

                        {/* Member #3 */}
                        <div className="w-full md:w-6/12 lg:w-1/5 mb-6 px-6 sm:px-6 lg:px-4">
                            <div className="flex flex-col">
                                <img className="mx-auto rounded-2xl drop-shadow-md hover:drop-shadow-xl transition-all duration-200 delay-100"
                                    src="https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?fit=clamp&w=400&h=400&q=80"
                                    alt="Kenji Milton"
                                />
                                <div className="text-center mt-6">
                                    <h1 className="text-gray-900 text-xl font-bold mb-1">Kenji Milton</h1>
                                    <div className="text-gray-700 font-light mb-2">Team Member</div>
                                    <SocialIcons />
                                </div>
                            </div>
                        </div>

                        {/* Member #4 */}
                        <div className="w-full md:w-6/12 lg:w-1/5 mb-6 px-6 sm:px-6 lg:px-4">
                            <div className="flex flex-col">
                                <img className="mx-auto rounded-2xl drop-shadow-md hover:drop-shadow-xl transition-all duration-200 delay-100"
                                    src="https://images.unsplash.com/photo-1635003913011-95971abba560?fit=clamp&w=400&h=400&q=80"
                                    alt="Doesn't Matter"
                                />
                                <div className="text-center mt-6">
                                    <h1 className="text-gray-900 text-xl font-bold mb-1">Doesn't Matter</h1>
                                    <div className="text-gray-700 font-light mb-2">Will be fired</div>
                                    <SocialIcons />
                                </div>
                            </div>
                        </div>

                        {/* Member #5 */}
                        <div className="w-full md:w-6/12 lg:w-1/5 mb-6 px-6 sm:px-6 lg:px-4">
                            <div className="flex flex-col">
                                <img className="mx-auto rounded-2xl drop-shadow-md hover:drop-shadow-xl transition-all duration-200 delay-100"
                                    src="https://images.unsplash.com/photo-1635003913011-95971abba560?fit=clamp&w=400&h=400&q=80"
                                    alt="Doesn't Matter"
                                />
                                <div className="text-center mt-6">
                                    <h1 className="text-gray-900 text-xl font-bold mb-1">Doesn't Matter</h1>
                                    <div className="text-gray-700 font-light mb-2">Will be fired</div>
                                    <SocialIcons />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Social Icons Component (Keeps Code Clean)
const SocialIcons = () => (
    <div className="flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-300">
        <a href="#" className="flex rounded-full hover:bg-indigo-50 h-10 w-10">
            <i className="mdi mdi-linkedin text-indigo-500 mx-auto mt-2"></i>
        </a>
        <a href="#" className="flex rounded-full hover:bg-blue-50 h-10 w-10">
            <i className="mdi mdi-twitter text-blue-300 mx-auto mt-2"></i>
        </a>
        <a href="#" className="flex rounded-full hover:bg-orange-50 h-10 w-10">
            <i className="mdi mdi-instagram text-orange-400 mx-auto mt-2"></i>
        </a>
    </div>
);

export default Team;
