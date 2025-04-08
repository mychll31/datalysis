import { useState } from "react";
import { Menu, Home, Settings, User, LogOut, Loader } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TableSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const response = await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }, // ✅ Add headers
      });

      if (response.ok) {
        console.log("User logged out successfully");

        localStorage.removeItem("username"); // ✅ Only remove relevant data

        if (localStorage.getItem("rememberMe") !== "true") {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
          localStorage.removeItem("rememberMe");
        }

        toast.success("LOGOUT SUCCESSFULLY", { autoClose: 3000 });

        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoggingOut(false);
      setIsLogoutConfirmOpen(false);
    }
  };

  return (
    <div className="fixed z-50 left-0">
      {/* Sidebar */}
      <div
        className={`text-gray-900 h-screen p-5 flex flex-col transition-all duration-300 ${
          isOpen ? "bg-white rounded-r-2xl w-60" : "w-0"
        }`}
      >
        <button
          className="text-gray-900 mb-5 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="w-9 h-9" />
        </button>

        <nav className="flex flex-col space-y-4">
          <SidebarItem icon={<Home />} label="Home" isOpen={isOpen} href="/homepage" />
          <SidebarItem icon={<User />} label="Profile" isOpen={isOpen} />
          <SidebarItem icon={<Settings />} label="Insert Table" isOpen={isOpen} />
        </nav>

        <div className="mt-auto">
          <SidebarItem
            icon={<LogOut />}
            label="Logout"
            isOpen={isOpen}
            onClick={() => setIsLogoutConfirmOpen(true)}
          />
        </div>
      </div>

      {/* Logout Confirmation */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center z-[1050]">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to log out?</h2>
            <div className="flex justify-center space-x-4">
              <button
                className={`px-4 py-2 rounded-md text-white ${
                  isLoggingOut ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-700"
                }`}
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <span className="flex items-center space-x-2">
                    <Loader className="animate-spin w-5 h-5" /> <span>Logging out...</span>
                  </span>
                ) : (
                  "Yes, Logout"
                )}
              </button>
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

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

const SidebarItem = ({ icon, label, isOpen, href, onClick }) => {
  return (
    <div
      className="flex items-center space-x-4 p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
      onClick={onClick}
    >
      {icon}
      {isOpen ? <a href={href} className="text-lg p-2 rounded-lg">{label}</a> : null}
    </div>
  );
};

export default TableSidebar;