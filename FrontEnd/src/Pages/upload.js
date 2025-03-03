import React, { useEffect, useState } from "react";
import NavBar from "../Components/Navbar/Navbar";
import CollapsibleSidebar from "../Components/Sidebar";
import axios from 'axios';
import Papa from 'papaparse';
import Modal from '../Components/Modal';

const UploadPage = () => {
  const [username, setUsername] = useState("");
  //Added part here variable for accepting file basically for modal details
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [totalDataPoints, setTotalDataPoints] = useState(0);
  //Ends Here 

  useEffect(() => {
    // Fetch user info from the backend
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user-info/", {
          method: "GET",
          credentials: "include", // Ensure cookies are sent
          mode: "cors",
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched user info:", data);
          setUsername(data.username);
        } else {
          console.error("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);
  console.log("Is modal open?", showModal); //for modal checking

  //this funtion is for the uploading of csv file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; //get the file first and store it in a variable called selected file
    setFile(selectedFile); // here we set the file state to the selected file
    console.log("File Selected:", selectedFile)

    if (selectedFile) {
      Papa.parse(selectedFile, {
        complete: (result) => {
          console.log("Parsed CSV Data:", result.data);

          if (result.data.length > 0) {
            const totalRows = result.data.length;
            const totalCols = Object.keys(result.data[0]).length;

            setColumns(Object.keys(result.data[0]));
            setCsvData(result.data.slice(0, 5));
            setRowsCount(totalRows);
            setTotalDataPoints(totalCols * totalRows);
            setShowModal(true);

            console.log("Setting showModal to TRUE");
          }
        },

        header: true,
        skipEmptyLines: true,
      });
    }
  };
  //functions end here
  //this function is for handling the path where the uploaded csv is reading; this is connected to django urls
  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file); //this file will be he KEY that will be look by django so this must be indicate in django reference ba

    axios.post('http://127.0.0.1:8000/upload-csv/', formData) //this is the endpoint in django so here the react will know where to submit or go to after posting 
      .then((response) => {
        console.log('The upload is done', response.data);
      })
      .catch((error) => {
        console.log('An error occurred during upload due to', error);
      })
  };
  // function that handle modal confirmation button : NOTE that this function is connected to the modal button in the JSX triggering this doesnt upload the file
  const handleConfirm = () => {
    if (!file) return;

    console.log('file to be upload', file.name)
    setShowModal(false);
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-uploadPage bg-gray-900 text-white font-inter">
      <div className="ml-10 w-screen">
        <CollapsibleSidebar />
      </div>

      <div className="pb-12">
        <div className="mt-10 py-9 bg-logo bg-no-repeat bg-cover bg-center outline-transparent w-64 rounded-xl transition-all duration-300"></div>
      </div>

      {/* Show username at the top */}
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

      {/* Upload Form */}
      <div className="w-2/5 mt-8 text-left">
        <p className="text-lg mb-2">Upload CSV File</p>
        <div className="border-dashed border-2 border-gray-400 bg-gray-900 bg-opacity-25 hover:border-white hover:bg-gray-900 hover:bg-opacity-50 transition duration-500 rounded-lg text-center p-6 relative">
          <div className="mx-auto mb-4 bg-uploadIcon bg-contain bg-center bg-no-repeat py-10 w-14" />
          <label htmlFor="upload-csv" className="cursor-pointer block text-gray-300 hover:text-white transition">

            {file ? (
              <div className="flex items-center justify-center">
                {/* CSV Icon */}
                <svg fill="currentColor" className="w-6 h-6 text-green-500 mr-2" viewBox="0 0 24 24">
                  <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8l-6-6H5zm6 1.5V9h5.5L11 4.5zM6 10h6v2H8v1h4v2H8v1h4v2H6v-2h2v-1H6v-2h2v-1H6v-2zm9 1h3v1h-2v1h1v1h-1v1h2v1h-3v-5z" />
                </svg>
                {/* File Name */}
                <span className="text-gray-300">{file.name}</span>
                {/* Change File Button */}
                <button
                  onClick={() => document.getElementById('upload-csv').click()}
                  className="ml-4 text-sm text-blue-500 hover:text-blue-300">
                  Change File
                </button>
              </div>
            ) : (
              "Drag and drop or click to upload"
            )}
          </label>

          <input type="file" onChange={handleFileChange} id="upload-csv" accept=".csv" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /> {/*the trigger point for uploading a csv*/}
        </div>

        {/* Other Input Fields */}
        <p className="text-lg mt-4 mb-2">Name of Company</p>
        <input type="text" className="w-full p-3 bg-gray-900 bg-opacity-25 border-2 border-gray-400 rounded-lg text-white placeholder-gray-400 focus:outline-double focus:outline-4 outline-white hover:border-white transition duration-300" placeholder="Enter company name" />

        <p className="text-lg mt-4 mb-2">Contact Number</p>
        <input type="text" className="w-full p-3 bg-gray-900 bg-opacity-25 border-2 border-gray-400 rounded-lg text-white placeholder-gray-400 focus:outline-double focus:outline-4 outline-white hover:border-white transition duration-300" placeholder="Enter contact number" />

        <p className="text-lg mt-4 mb-2">Email Address</p>
        <input type="text" className="w-full p-3 bg-gray-900 bg-opacity-25 border-2 border-gray-400 rounded-lg text-white placeholder-gray-400 focus:outline-double focus:outline-4 outline-white hover:border-white transition duration-300" placeholder="Enter email address" />

        <button onClick={handleUpload} className="w-full mt-6 bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-600 transition duration-300">
          Get your Insights!
        </button>
      </div>

      <div className="h-32"></div>

      {/* this is for the modal content to the modal file is located in the components */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h3 className="text-lg font-semibold mb-4">Preview</h3>

        <div className="overflow-auto max-h-80 border border-gray-300 rounded-lg">
          <table className="table-auto w-full border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className="border border-gray-400 px-4 py-2 text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, rowIndex) => (
                <tr key={rowIndex} className=" even:bg-gray-100 dark:even:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="border border-gray-300 px-4 py-2">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-left text-gray-600 dark:text-gray-100 flex gap-5">
          <p><strong>File Name:</strong> {file?.name}</p>
          <p><strong>Rows:</strong> {rowsCount.toLocaleString()}</p>
          <p><strong>Columns:</strong> {columns.length.toLocaleString()}</p>
          <p><strong>Type:</strong> {file?.type.toUpperCase()}</p>
          <p><strong>Data Points:</strong> {totalDataPoints.toLocaleString()}</p>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
            Close
          </button>
          <button onClick={handleConfirm} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            Confirm Upload
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default UploadPage;
