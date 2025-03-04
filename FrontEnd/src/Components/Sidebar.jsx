import { useState } from "react";
import { Menu, Home, Settings, User, LogOut } from "lucide-react";

const CollapsibleSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  return (
    <div className="fixed left-0">
      {/* Sidebar */}
      <div
        className={`text-white h-screen p-5 flex flex-col transition-all duration-300 ${
          isOpen ? "bg-gray-900 rounded-r-2xl bg-opacity-50 w-60" : "w-0"
        }`}
      >
        {/* Toggle Button */}
        <button
          className="text-white mb-5 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="w-9 h-9" />
        </button>

        {/* Sidebar Items */}
        <nav className="flex flex-col space-y-4">
          <SidebarItem icon={<Home />} label="Home" isOpen={isOpen} href="/" />
          <SidebarItem icon={<User />} label="Profile" isOpen={isOpen} />
          <SidebarItem icon={<Settings />} label="Settings" isOpen={isOpen} />
        </nav>

        {/* Logout Button */}
        <div className="mt-auto">
          <SidebarItem
            icon={<LogOut />}
            label="Logout"
            isOpen={isOpen}
            onClick={() => setIsLogoutConfirmOpen(true)} // Open confirmation
          />
        </div>
      </div>

      {/* Logout Confirmation Modal - Now Always on Top */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center z-[1050]">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure you want to log out?
            </h2>
            <div className="flex justify-center space-x-4">
              <a href="/">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                  onClick={() => {
                    setIsLogoutConfirmOpen(false);
                    console.log("User logged out");
                    // Add actual logout logic here
                  }}
                >
                    Yes, Logout
                </button>
              </a>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                onClick={() => setIsLogoutConfirmOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
      {icon}
      {isOpen ? (
        <a href={href} className="text-lg p-2 rounded-lg">
          {label}
        </a>
      ) : null}
    </div>
  );
};

export default CollapsibleSidebar;
