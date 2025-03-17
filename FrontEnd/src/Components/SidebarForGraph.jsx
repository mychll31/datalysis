import { useState } from "react";
import { Menu, Home, Settings, User, LogOut, ChartColumnBig, X} from "lucide-react";

const GraphSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  return (
    <div className="fixed z-50 right-0">
      {/* Sidebar */}
      <div
        className={`text-gray-900 h-screen p-5 flex flex-col transition-all duration-100 ${
          isOpen ? "bg-white rounded-l-2xl w-60" : "w-0"
        }`}
      >
        {/* Toggle Button */}
        <button
          className={`${
            isOpen ? "text-gray-900 right-40 " : "text-white right-5 bg-slate-700 shadow-md "
          }  mb-5 focus:outline-none fixed p-2 rounded-xl  transition-all duration-300`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-9 h-9" /> : <ChartColumnBig className="w-9 h-9" />}
        </button>

        {/* Sidebar Items */}
        <nav className="flex flex-col space-y-4">
          <SidebarItem icon={<Home />} label="Home" isOpen={isOpen} />
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

    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, label, isOpen, href, onClick }) => {
  return (
    <div
      className="flex items-center space-x-4 p-2 mt-16 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
      onClick={onClick}
    >

      {isOpen ? (
        <a href={href} className="text-lg p-2 rounded-lg">
          insert graph items here
        </a>
      ) : null}
    </div>
  );
};

export default GraphSidebar;
