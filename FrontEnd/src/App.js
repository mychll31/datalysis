import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import "./App.css";
import Home from "./Pages/home";
import UploadPage from "./Pages/upload";
import EmailForm from "./Components/EmailForm"; // Import the new component

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Upload-Page" element={<UploadPage />} />
                <Route path="/email" element={<EmailForm />} /> {/* New route for email form */}
            </Routes>
        </Router>
    );
}

export default App;
