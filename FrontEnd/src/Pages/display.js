import CollapsibleSidebar from "../Components/Sidebar";
import NavBar from "../Components/Navbar/Navbar";
import Cards from "../Components/Cards";
import Team from "../Components/Team";

const Display = () => {
    return (
        <>
            <section className="bg-displayBg bg-no-repeat bg-cover bg-bottom w-full min-h-screen flex flex-col items-center">
                <div className="flex w-full">
                    <CollapsibleSidebar />
                </div>

                <div className="flex flex-col items-center w-full space-y-6 p-6 text-white font-inter">
                    <div className="w-64 h-16 bg-logo bg-no-repeat bg-cover bg-center rounded-xl"></div>
                    
                    <div className="w-2/3 relative">
                        <input type="text" placeholder="Search bar" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-500 focus:outline-none focus:border-yellow-400" />
                        <div className="absolute right-3 top-3 text-white cursor-pointer">&#9776;</div>
                    </div>

                    <div className="w-2/3 grid grid-cols-2 gap-4">
                        <select className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400">
                            <option>Select a Column</option>
                        </select>
                        <select className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400">
                            <option>Set Range</option>
                        </select>
                    </div>

                    <div className="w-2/3 grid grid-cols-2 gap-4">
                        <select className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400">
                            <option>Select a Column</option>
                        </select>
                        <select className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400">
                            <option>Output (Chart)</option>
                        </select>
                    </div>

                    <div className="flex flex-row justify-center items-center w-1/2 space-x-4">
                        <button className="w-28 h-16 bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-600 transition duration-300">
                            APPLY 
                        </button>
                        <button className="w-36 bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-600 transition duration-300">
                            UPLOAD ANOTHER <br />CSV
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Display;
