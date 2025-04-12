import { createContext, useState, useEffect, Children } from "react";
import { getCurrentUser, logout } from "../services/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Patikrinti ar vartotojas prisijunges
    const checkUserLoggedIn = async () => {
      try {
        if (localStorage.getItem("token")) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to get user data: ", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    checkUserLoggedIn();
  }, []);
  const logoutUser = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setUser,
        setError,
        logoutUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
