import React, { useEffect, useState } from "react";
import NavBar from "../Components/Navbar/Navbar";
import CollapsibleSidebar from "../Components/Sidebar";
import axios from 'axios';
import Papa from 'papaparse';
import UploadModal from "../Components/UploadModal";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CalculatorButtons from "../Components/CalculatorButtons";

const FormulaPage = () => {
  const [username, setUsername] = useState("");
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [totalDataPoints, setTotalDataPoints] = useState(0);
  const [fileType, setFileType] = useState("");
  const [isFileTypeSelected, setIsFileTypeSelected] = useState(false);
  const [resetTransition, setResetTransition] = useState(false);
  const [jsonLink, setJsonLink] = useState("");
  const [error, setError] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [preservedCharts, setPreservedCharts] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.preserveCharts) {
      setPreservedCharts(location.state.preserveCharts);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user-info/", {
          method: "GET",
          credentials: "include",
          mode: "cors",
        });

        console.log("Response Status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Fetch User Data:", data);
          setUsername(data.username);
        } else {
          console.error("Failed to fetch user info. Status:", response.status);
          const errorData = await response.json();
          console.error("Error response:", errorData);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (fileType) {
      setFile(null);
      setCsvData([]);
      setColumns([]);
      setRowsCount(0); 
      setTotalDataPoints(0); 
      setJsonLink(""); 
      setError(""); 
    }
  }, [fileType]); 

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  
    if (selectedFile) {
      if (fileType === "csv") {
        Papa.parse(selectedFile, {
          complete: (result) => {
            if (result.data.length > 0) {
              const totalRows = result.data.length;
              const totalCols = Object.keys(result.data[0]).length;

              setColumns(Object.keys(result.data[0]));
              setCsvData(result.data.slice(0, totalRows));
              setRowsCount(totalRows);
              setTotalDataPoints(totalCols * totalRows);
              setShowModal(true);
            }
          },
          header: true,
          skipEmptyLines: true,
        });
      } else if (fileType === "json") {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const jsonData = JSON.parse(event.target.result);
            if (Array.isArray(jsonData)) {
              const totalRows = jsonData.length;
              const totalCols = Object.keys(jsonData[0]).length;

              setColumns(Object.keys(jsonData[0]));
              setCsvData(jsonData.slice(0, totalRows));
              setRowsCount(totalRows);
              setTotalDataPoints(totalCols * totalRows);
              setShowModal(true);
            } else {
              setError("Invalid JSON file. Expected an array of objects.");
            }
          } catch (error) {
            setError("Failed to parse JSON file. Please check the file format.");
          }
        };
        reader.readAsText(selectedFile);
      }
    }
  };

  const handleJsonLink = async (url) => {
    try {
      const response = await axios.get(url);
      const jsonData = response.data;

      if (!Array.isArray(jsonData)) {
        throw new Error("Invalid JSON data. Expected an array of objects.");
      }

      if (jsonData.length === 0) {
        throw new Error("JSON data is empty.");
      }

      const totalRows = jsonData.length;
      const totalCols = Object.keys(jsonData[0]).length;

      setColumns(Object.keys(jsonData[0]));
      setCsvData(jsonData.slice(0, totalRows));
      setRowsCount(totalRows);
      setTotalDataPoints(totalCols * totalRows);
      setShowModal(true);
      setError("");
    } catch (error) {
      console.error("Error fetching JSON data:", error);
      setError("Invalid JSON link or data format. Please check the URL and try again.");
      setCsvData([]);
      setColumns([]);
      setRowsCount(0);
      setTotalDataPoints(0);
    }
  };

  const validateForm = () => {
    let errors = {};
  
    if (!companyName.trim()) {
      errors.companyName = "Company name is required.";
    }
  
    const contactNumberPattern = /^09\d{9}$/;
    if (!contactNumber.trim()) {
      errors.contactNumber = "Contact number is required.";
    } else if (!contactNumberPattern.test(contactNumber)) {
      errors.contactNumber = "Invalid contact number. Use format: 09XXXXXXXXX.";
    }
  
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpload = async () => {
    if (!validateForm()){
      console.log("Validation failed! Errors:", errors);
      return false;
    }
    if (fileType === "json-link") {
      console.log("JSON link data is ready for processing.");
      return true;
    }

    if (!file) {
      setError("Please upload a file.");
      return false;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post("http://127.0.0.1:8000/upload-csv/", formData);
        console.log("Upload successful", response.data);
        return true;
    } catch (error) {
        console.error("Upload error:", error);
        setError("Failed to upload file. Please try again.");
        return false;
    }
  };

  const handleConfirm = () => {
    if (fileType === "json-link") {
      console.log("JSON link data confirmed:", csvData);
      setShowModal(false);
      return;
    }

    if (!file) return;
    console.log("File to be uploaded:", file.name);
    setShowModal(false);
  };

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
    setIsFileTypeSelected(false);
    setResetTransition(true);
    setTimeout(() => {
      setIsFileTypeSelected(true);
      setResetTransition(false);
    }, 10);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    let newErrors = {};
  
    if (!companyName.trim()) newErrors.companyName = "Company name is required.";
  
    if (!contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required.";
    } else if (!/^09\d{9}$/.test(contactNumber)) {
      newErrors.contactNumber = "Invalid contact number. Use format: 09XXXXXXXXX.";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    setErrors({});
  
    try {
      if (fileType === "json-link" && !csvData.length) {
        alert("Please fetch JSON data before proceeding!");
        return;
      }
  
      if (fileType !== "json-link" && !file) {
        alert("Please upload a file before proceeding!");
        return;
      }
  
      try {
        await handleUpload();
  
        toast.success("Upload successful! Redirecting...", {
          position: "top-right",
          autoClose: 3000,
        });
  
        setTimeout(() => {
          navigate("/Display-Page", { 
            state: { 
              csvData, 
              columns,
              file,
              preserveCharts: preservedCharts 
            } 
          });
        }, 3000);
  
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error processing data. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-cover bg-center bg-uploadPage bg-gray-900 text-white font-inter">
      <div className="ml-10 w-screen">
        <CollapsibleSidebar />
      </div>

      <div className="pb-12">
        <div className="mt-10 py-9 bg-logo bg-no-repeat bg-cover bg-center outline-transparent w-64 rounded-xl transition-all duration-300"></div>
      </div>

      <div className="absolute top-5 right-10 text-2xl font-bold text-amber-300 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.50)]">
        Welcome, {username || "Guest"}!
      </div>

      <div className="text-center">
        <h1 className="text-5xl font-bold">
          Upload your database to unlock
          <br /> powerful insights!
        </h1>
        <p className="text-xl text-gray-400 mt-9 mb-16">
          Turn Your Data into Smart Decisions
        </p>
      </div>

      <div className="w-2/5 mt-8 text-left">
       
        
        {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}

        
      </div>
          
      <div className="h-32"></div>

      <UploadModal
        show={showModal}
        onClose={() => setShowModal(false)}
        file={file}
        columns={columns}
        csvData={csvData}
        rowsCount={rowsCount}
        totalDataPoints={totalDataPoints}
        handleConfirm={handleConfirm}
      />
    <CalculatorButtons />
    </div>
  );
};

export default FormulaPage;