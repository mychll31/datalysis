import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import './App.css';
import Home from "./Pages/home";
import UploadPage from "./Pages/upload";

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Upload-Page" element={<UploadPage/>}/>
      </Routes>
    </Router>  
  )
}

export default App;
