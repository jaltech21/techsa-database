import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    // TODO: Implement in Phase 2 — restore user from localStorage token
    return null;
  });

  const login = (user, token) => {
    // TODO: Implement in Phase 2
  };

  const logout = () => {
    // TODO: Implement in Phase 2
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
