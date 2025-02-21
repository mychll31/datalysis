import React from 'react';
import NavBar from '../Components/Navbar';
import CollapsibleSidebar from '../Components/Sidebar';
import { GiHamburgerMenu } from "react-icons/gi";

const UploadPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-uploadPage bg-gray-900 text-white font-inter">
                    <div className='ml-10 w-screen '>
                      <CollapsibleSidebar />
                    </div>                     
        <div className="pb-12">   
            <div className="mt-10 py-9 bg-logo bg-no-repeat bg-cover bg-center outline-transparent w-64 rounded-xl transition-all duration-300">
            </div>
        </div>
      <div className="text-center">
        <h1 className="text-5xl font-bold">Upload your database to unlock<br /> powerful insights!</h1>
        <p className="text-xl text-gray-400 mt-9 mb-16">Turn Your Data into Smart Decisions</p>
      </div>
      
      <div className="w-2/5 mt-8 text-left">
        <p className="text-lg mb-2">Upload Avatar</p>
        <div className="border-dashed border-2 border-gray-400 bg-gray-900 bg-opacity-25 hover:border-white hover:bg-gray-900 hover:bg-opacity-50 transition duration-500 rounded-lg text-center p-6 relative">
          <div className="mx-auto mb-4 bg-uploadIcon bg-contain bg-center bg-no-repeat py-10 w-14"/>
          <label htmlFor="upload-image" className="cursor-pointer block text-gray-300 hover:text-white transition">Drag and drop or click to upload</label>
          <input type="file" id="upload-image" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        </div>
        
        <p className="text-lg mt-4">Name of Company</p>
        <input type="text" className="w-full p-3 bg-gray-900 bg-opacity-25 border-2  border-gray-400 rounded-lg text-white placeholder-gray-400 focus:outline-double focus:outline-4 outline-white hover:border-white transition duration-300" placeholder="Enter company name" />
        
        <p className="text-lg mt-4">Contact Number</p>
        <input type="text" className="w-full p-3 bg-gray-900 bg-opacity-25 border-2  border-gray-400 rounded-lg text-white placeholder-gray-400 focus:outline-double focus:outline-4 outline-white hover:border-white transition duration-300" placeholder="Enter contact number" />
        
        <p className="text-lg mt-4">Email Address</p>
        <input type="text" className="w-full p-3 bg-gray-900 bg-opacity-25 border-2  border-gray-400 rounded-lg text-white placeholder-gray-400 focus:outline-double focus:outline-4 outline-white hover:border-white transition duration-300" placeholder="Enter email address" />
        
        <button className="w-full mt-6 bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-600 transition duration-300">Get your Insights!</button>
      </div>
      <div className="h-32"></div>
    </div>
  );
};

export default UploadPage;
