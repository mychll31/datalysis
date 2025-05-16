import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import "./App.css";

import Home from "./Pages/home";
import Homepage from "./Pages/homepage";
import UploadPage from "./Pages/upload";
import Display from "./Pages/display";
import EmailForm from "./Components/EmailForm";
import FormulaPage from "./Pages/formulaPage";
import Calculator from "./Calculator";
import Profile from "./Pages/Profile";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AuthProvider } from "./AuthContext"; 

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/homepage" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
                    <Route path="/profile" element={ <ProtectedRoute><Profile /> </ProtectedRoute>} />
                    <Route path="/Upload-Page" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
                    <Route path="/Display-Page" element={<ProtectedRoute><Display /></ProtectedRoute>} />
                    <Route path="/Formula-Page" element={<ProtectedRoute><FormulaPage /></ProtectedRoute>} />
                    <Route path="/email" element={<ProtectedRoute><EmailForm /></ProtectedRoute>} />
                    <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;

