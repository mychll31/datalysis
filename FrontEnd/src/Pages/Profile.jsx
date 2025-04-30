import { useState, useEffect } from "react";
import NavBar from "../Components/Navbar/homenav"; 
import CollapsibleSidebar from "../Components/Sidebar"; // Sidebar import

const Profile = () => {
    const [User, setUser] = useState(null);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    // Initialize the profile image state
    const [profileImage, setProfileImage] = useState(() => {
        const savedImage = localStorage.getItem("profileImage");
        return savedImage || "https://via.placeholder.com/40"; // Default to placeholder if no image exists
    });

    // State for uploaded charts
    const [uploadedCharts, setUploadedCharts] = useState(() => {
        const savedCharts = localStorage.getItem("uploadedCharts");
        return savedCharts ? JSON.parse(savedCharts) : [];
    });

    // State for modal
    const [modalImage, setModalImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Handle theme changes
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    useEffect(() => {
        const storedUser = localStorage.getItem("User");
        setUser(storedUser ? JSON.parse(storedUser) : null);
    }, []);

    // Handle profile image upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newProfileImage = reader.result;
                setProfileImage(newProfileImage); // Set the profile image state

                // Save the uploaded image to localStorage
                localStorage.setItem("profileImage", newProfileImage);

                // Optionally, update the User object if needed
                if (User) {
                    const updatedUser = { ...User, profileImage: newProfileImage };
                    setUser(updatedUser);
                    localStorage.setItem("User", JSON.stringify(updatedUser));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle chart uploads
    const handleChartUpload = (event) => {
        const files = event.target.files;
        const newChartsArray = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type === "image/png") {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const newChart = reader.result;
                    newChartsArray.push(newChart);
                    setUploadedCharts((prevCharts) => {
                        const updatedCharts = [...prevCharts, newChart];
                        localStorage.setItem("uploadedCharts", JSON.stringify(updatedCharts)); // Update localStorage
                        return updatedCharts;
                    });
                };
                reader.readAsDataURL(file);
            } else {
                alert("Only PNG files are allowed.");
            }
        }
    };

    // Handle chart deletion
    const handleChartDelete = (index) => {
        setUploadedCharts((prevCharts) => {
            const updatedCharts = prevCharts.filter((_, i) => i !== index);
            localStorage.setItem("uploadedCharts", JSON.stringify(updatedCharts)); // Update localStorage
            return updatedCharts;
        });
    };

    // Open modal with the selected image
    const openModal = (image) => {
        setModalImage(image);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setModalImage(null);
    };

    return (
        <div className={`transition-colors duration-300 ${darkMode ? "dark" : ""}`}>
            {/* NavBar */}
            <section className="bg-bannerImg bg-no-repeat bg-cover dark:bg-gray-950">
                <NavBar />
            </section>

            <div className="flex">
                {/* Sidebar */}
                <CollapsibleSidebar />

                {/* Main Content */}
                <div className="flex-1">
                    {/* Header Section */}
                    <section className="w-full h-[7vh] bg-gradient-to-b from-cyan-700 to-cyan-400 dark:from-cyan-800 dark:to-cyan-600 flex items-center justify-end px-6">
                        <div className="text-right flex items-center">
                            {/* Profile Image - Made Clickable */}
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <img 
                                    src={profileImage} 
                                    alt="Profile" 
                                    className="h-10 w-10 rounded-full mr-2 object-cover"
                                />
                            </label>

                            {/* Welcome Message */}
                            <h1 className="text-white dark:text-gray-100 text-2xl font-medium">
                                {User ? `Welcome, ${User.username}!` : "You are not logged in."}
                            </h1>

                            {/* Profile Image Upload Button */}
                            {User && (
                                <label htmlFor="file-upload" className="ml-4 text-white cursor-pointer">
                                    <input 
                                        type="file" 
                                        id="file-upload"
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            )}
                        </div>
                    </section>

                    {/* Card Section */}
                    {User ? (
                        <section className="min-h-[60vh] margin-10 justify-center bg-gray-100 dark:bg-gray-900 p-6">
                                <div className="min-w-[92vh] bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
                                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
                                    User's Profile
                                </h2>
                                <div className="space-y-6 text-gray-700 dark:text-gray-200">
                                    <div className="flex items-center">
                                        <div className="font-semibold text-lg mr-3">Username:</div>
                                        <div className="text-gray-500 dark:text-gray-300">{User.username}</div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="font-semibold text-lg mr-3">Email:</div>
                                        <div className="text-gray-500 dark:text-gray-300">{User.email}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Uploaded Files Section */}
                            <section className="min-h-[60vh] bg-gray-100 dark:bg-gray-900 mt-3">
                                <div className="min-w-[92vh] bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
                                    <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
                                        Uploaded Charts
                                    </h2>
                                    <input 
                                        type="file" 
                                        accept="image/png" 
                                        multiple 
                                        onChange={handleChartUpload} 
                                        className="mt-4 mb-4 p-3 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 
                                        transition duration-300 bg-white text-gray-700 placeholder-gray-400" />
                                    <div className="mt-4 grid grid-cols-4 gap-2">
                                        {uploadedCharts.length > 0 ? (
                                            uploadedCharts.map((chart, index) => (
                                                <div key={index} className="relative">
                                                    <img 
                                                        src={chart} 
                                                        alt={`Uploaded Chart ${index + 1}`} 
                                                        className="w-full h-auto rounded-lg object-cover cursor-pointer"
                                                        onClick={() => openModal(chart)} // Open modal on click
                                                    />
                                                    <button 
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                                        onClick={() => handleChartDelete(index)}
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-300 text-center">No files uploaded yet.</p>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </section>
                    ) : (
                        <section className="min-h-[60vh] flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                            <p className="text-gray-700 dark:text-gray-200 text-xl">Please log in to view your profile details.</p>
                        </section>
                    )}
                </div>
            </div>

            {/* Modal for displaying larger image */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 relative">
                        <button className="absolute top-2 right-2 text-red-500" onClick={closeModal}>X</button>
                        <img src={modalImage} alt="Modal View" className="max-w-full max-h-[80vh] rounded" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;