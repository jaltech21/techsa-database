import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from stored token
  useEffect(() => {
    const token = localStorage.getItem("techsa_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => setCurrentUser(res.data.member))
      .catch(() => localStorage.removeItem("techsa_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = (member, token) => {
    localStorage.setItem("techsa_token", token);
    setCurrentUser(member);
  };

  const updateUser = (member) => setCurrentUser(member);

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Token may already be expired — still clear locally
    } finally {
      localStorage.removeItem("techsa_token");
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
