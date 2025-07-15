import React, { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };
// Authentication context provider.
// Supplies login, logout, and token state to the app.
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Value provided to context consumers: { token, login, logout }
