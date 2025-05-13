import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import "./App.css";
import Home from "./Pages/home";
import Homepage from "./Pages/homepage";
import UploadPage from "./Pages/upload";
import Display from "./Pages/display";
import EmailForm from "./Components/EmailForm";
import FormulaPage from "./Pages/formulaPage";
import Calculator from "./Components/Calculator"; // ✅ Import Calculator component
import Profile from "./Pages/Profile"; 

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
           
                <Route path="/homepage" element={<Homepage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/Upload-Page" element={<UploadPage />} />
                <Route path="/Display-Page" element={<Display />} />
                <Route path="/Formula-Page" element={<FormulaPage />} />
                <Route path="/email" element={<EmailForm />} />
                <Route path="/calculator" element={<Calculator />} />
            </Routes>
        </Router>
    );
}

export default App;
