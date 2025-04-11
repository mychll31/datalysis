import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import "./App.css";
import Home from "./Pages/home";
import Homepage from "./Pages/homepage";
import UploadPage from "./Pages/upload";
import Display from "./Pages/display";
import EmailForm from "./Components/EmailForm"; // Import the new component
import FormulaPage from "./Pages/formulaPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/homepage" element={<Homepage />} />
                <Route path="/Upload-Page" element={<UploadPage />} />
                <Route path="/Display-Page" element={<Display />} />
                <Route path="/Formula-Page" element={<FormulaPage />} />
                <Route path="/email" element={<EmailForm />} /> {/* New route for email form */}
            </Routes>
        </Router>
    );
}

export default App;
