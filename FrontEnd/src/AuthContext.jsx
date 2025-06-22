import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = localStorage.getItem("User");
        setIsAuthenticated(!!user);
        setLoading(false);
    }, []);

    const login = (userData) => {
        localStorage.setItem("User", JSON.stringify(userData));
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("User");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout  }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);