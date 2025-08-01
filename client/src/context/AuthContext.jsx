import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log(`${backendUrl}/auth/login`);

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${backendUrl}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common["x-auth-token"] = res.data.token;
      setIsAuthenticated(true);
      toast.success("Login successful!");
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["x-auth-token"];
    setIsAuthenticated(false);
    toast.info("Logged out successfully.");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
