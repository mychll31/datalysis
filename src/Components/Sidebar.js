import { useState } from "react";
import { Menu, Home, Settings, User, LogOut } from "lucide-react";

const CollapsibleSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute left-0">
      {/* Sidebar */}
      <div
        className={` text-white h-screen p-5 flex flex-col transition-all duration-300 ${
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

        {/* Logout Button at Bottom */}
        <div className="mt-auto">
          <SidebarItem icon={<LogOut />} label="Logout" isOpen={isOpen} />
        </div>
      </div>

    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, label, isOpen, href }) => {
    return (
      <div className="flex items-center space-x-4 p-2 rounded-lg">
        {icon}
        {isOpen ? (
          <a
            href={href}
            className="text-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200 p-2 rounded-lg"
          >
            {label}
          </a>
        ) : (
          <span className="text-lg"></span> // Non-clickable when closed
        )}
      </div>
    );
  };
  

export default CollapsibleSidebar;
