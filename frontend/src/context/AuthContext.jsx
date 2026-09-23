import { createContext, useContext, useEffect, useState } from "react";

import { loginUser, registerUser, getMe } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Check existing login
  useEffect(() => {
    const checkUser = async () => {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMe(savedToken);

        setUser(data.user);
        setToken(savedToken);
      } catch (error) {
        console.log("Session expired.");

        localStorage.removeItem("token");

        setUser(null);
        setToken(null);
      }

      setLoading(false);
    };

    checkUser();
  }, []);

  // Login
  const login = async (email, password) => {
    const data = await loginUser(email, password);

    localStorage.setItem("token", data.token);

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  // Register
  const register = async (userData) => {
    const data = await registerUser(userData);

    localStorage.setItem("token", data.token);

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
