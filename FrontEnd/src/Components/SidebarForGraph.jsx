import { useState } from "react";
import { Menu, Home, Settings, User, LogOut, ChartColumnBig, X} from "lucide-react";
import FormulaPage from "../Pages/formulaPage";
import { useNavigate } from 'react-router-dom';
import { FaCalculator } from "react-icons/fa";

const GraphSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const handleFormulaPage = () => {
    navigate('/Formula-Page', { 
      state: { 
        csvData, 
        columns,
        file,
        preserveCharts: charts,
        currentSelections: {
          targetColumn1,
          targetColumn2,
          outputType
        }
      } 
    });
  };
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
          <button 
            className="w-36 h-12 mx-10 mb-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition duration-300 flex items-center justify-center gap-2"
            onClick={handleFormulaPage}
          >
            <FaCalculator /> Formula PAGE
          </button>
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
  const navigate = useNavigate();
  const [csvData, setCsvData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [file, setFile] = useState(null);
  
  return (
    <div
    className="flex items-center space-x-4 p-2 mt-16 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
    onClick={onClick}
    >

    {isOpen ? (
      <div className="flex flex-col w-1/4 self-end">
      {/* Keep your existing buttons... */}
      
      {/* Add this new button */}
      <button 
            className="w-36 h-12 mx-10 mb-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition duration-300 flex items-center justify-center gap-2"
            onClick={onClick}
          >
          <FaCalculator /> FORMULA PAGE
      </button>
    </div>
    ) : null}
    </div>
  );
};

export default GraphSidebar;
