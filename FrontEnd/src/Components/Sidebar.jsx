import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Home, Settings, User, LogOut, Loader } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CollapsibleSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedUser = localStorage.getItem("User");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        }

        const theme = localStorage.getItem("theme");
        setDarkMode(theme === "dark");
      } catch (err) {
        console.error("Failed to access localStorage:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        console.log("User logged out successfully");

        localStorage.removeItem("username");

        if (localStorage.getItem("rememberMe") !== "true") {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("User");
        }

        toast.success("LOGOUT SUCCESSFULLY", { autoClose: 3000 });

        setTimeout(() => {
          navigate("/");
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
      <div
        className={`text-gray-800 h-screen p-5 flex flex-col transition-all duration-300 ${
          isOpen
            ? "bg-gray-300 rounded-r-2xl bg-opacity-90 w-60"
            : "w-0 overflow-hidden"
        }`}
      >
        <button
          className="text-white mb-5 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu
            className={`w-9 h-9 bg-gray-600 rounded-md drop-shadow-md transition-all duration-300 ${
              isOpen ? "bg-transparent outline-none text-gray-800" : ""
            }`}
          />
        </button>

        <nav className="flex flex-col space-y-4">
          <SidebarItem
            icon={<Home />}
            label="Home"
            isOpen={isOpen}
            onClick={() => navigate("/homepage")}
          />

          <SidebarItem
            icon={<User />}
            label="Profile"
            isOpen={isOpen}
            onClick={() => {
              try {
                const savedUser = localStorage.getItem("User");
                if (savedUser && JSON.parse(savedUser)) {
                  navigate("/profile");
                } else {
                  toast.error("You must be logged in to view the profile.", {
                    autoClose: 3000,
                  });
                }
              } catch (err) {
                console.error("Invalid user data in localStorage", err);
                toast.error("Login error. Please try again.");
              }
            }}
          />

          <SidebarItem
            icon={<Settings />}
            label="Settings"
            isOpen={isOpen}
            onClick={() => navigate("/settings")}
          />
        </nav>

        <div className="mt-auto">
          <SidebarItem
            icon={<LogOut />}
            label="Logout"
            isOpen={isOpen}
            onClick={() => isOpen && setIsLogoutConfirmOpen(true)}
          />
        </div>
      </div>

      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center z-[1050]">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure you want to log out?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                className={`px-4 py-2 rounded-md text-white ${
                  isLoggingOut
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-700"
                }`}
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <span className="flex items-center space-x-2">
                    <Loader className="animate-spin w-5 h-5" />
                    <span>Logging out...</span>
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

const SidebarItem = ({ icon, label, isOpen, onClick }) => {
  return (
    <div
      className={`flex items-center space-x-4 p-2 rounded-lg transition-colors duration-200 ${
        isOpen
          ? "cursor-pointer hover:bg-gray-700 hover:text-white"
          : "pointer-events-none"
      }`}
      onClick={isOpen ? onClick : undefined}
    >
      {icon}
      {isOpen && <span className="text-lg p-2 rounded-lg">{label}</span>}
    </div>
  );
};

export default CollapsibleSidebar;
