import { useState } from "react";
import { Menu, Home, Settings, User, LogOut, ArrowLeft, ChevronLeft } from "lucide-react";
<<<<<<< Updated upstream
import { useNavigate } from "react-router-dom";
=======
import { useNavigate } from "react-router-dom"; // If you're using React Router
>>>>>>> Stashed changes

const TableSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
<<<<<<< Updated upstream
  const navigate = useNavigate();

  // Function to handle going back
  const handleGoBack = () => {
    navigate(-1); // This will take the user to the previous page in history
=======
  const navigate = useNavigate(); // React Router hook for navigation

  // Go back function
  const handleGoBack = () => {
    navigate(-1); // Goes back one page in history
    // Alternatively, you could use window.history.back() if not using React Router
>>>>>>> Stashed changes
  };

  return (
    <div className="fixed z-50 left-0">
      {/* Sidebar */}
      <div
        className={`text-gray-900 h-screen p-5 flex flex-col transition-all duration-300 ${
          isOpen ? "bg-white rounded-r-2xl w-60" : "w-0"
        }`}
      >
        {/* Toggle Button */}
        <button
          className={`${
            isOpen ? "text-gray-900" : "text-white"
          } mb-5 focus:outline-none`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ArrowLeft className="w-9 h-9" /> : <Menu className="w-9 h-9" />}
        </button>

        {/* Go Back Button */}
        {isOpen && (
          <button
            onClick={handleGoBack}
<<<<<<< Updated upstream
            className="flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200 mb-4"
=======
            className="flex items-center space-x-2 p-2 mb-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
>>>>>>> Stashed changes
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        )}

        {/* Sidebar Items */}
        <nav className="flex flex-col space-y-4">
          <SidebarItem icon={<Home />} label="Home" isOpen={isOpen} />
          <SidebarItem icon={<Settings />} label="Insert Table" isOpen={isOpen} />
        </nav>

        {/* Logout Button */}
        <div className="mt-auto">
          <SidebarItem
            icon={<LogOut />}
            label="Logout"
            isOpen={isOpen}
            onClick={() => setIsLogoutConfirmOpen(true)}
          />
        </div>
      </div>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, label, isOpen, href, onClick }) => {
  return (
    <div
      className="flex items-center space-x-4 p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200"
      onClick={onClick}
    >
<<<<<<< Updated upstream
      <div className="w-6 h-6">{icon}</div>
      {isOpen && (
        <span className="text-lg">{label}</span>
      )}
=======
      <span>{icon}</span>
      {isOpen && <span>{label}</span>}
>>>>>>> Stashed changes
    </div>
  );
};

export default TableSidebar;