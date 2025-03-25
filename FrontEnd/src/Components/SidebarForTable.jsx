import { useState } from "react";
import { Menu, Home, Settings, User, LogOut, ArrowLeft, ChevronLeft } from "lucide-react";

const TableSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Function to handle "Go Back" action
  const handleGoBack = () => {
    window.history.back();
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
          }  mb-5 focus:outline-none`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ArrowLeft className="w-9 h-9" /> : <Menu className="w-9 h-9" />}
        </button>

        {/* Go Back Button */}
        {isOpen && (
          <div
            className="flex items-center space-x-4 p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
            onClick={handleGoBack}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Go Back</span>
          </div>
        )}

        {/* Sidebar Items */}
        <nav className="flex flex-col space-y-4">
          <SidebarItem label="Home" isOpen={isOpen} />
          <SidebarItem label="Profile" isOpen={isOpen} />
          <SidebarItem label="Insert Table" isOpen={isOpen} />
        </nav>

        {/* Logout Button */}
        <div className="mt-auto">
          <SidebarItem
            label="Logout"
            isOpen={isOpen}
            onClick={() => setIsLogoutConfirmOpen(true)} // Open confirmation
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
      className="flex items-center space-x-4 p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
      onClick={onClick}
    >
      {isOpen ? (
        <a href={href} className="text-lg p-2 rounded-lg">
          {label}
        </a>
      ) : null}
    </div>
  );
};

export default TableSidebar;
