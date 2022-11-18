import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [$userAuth, $set_userAuth] = useState(null);
  const [$userData, $set_userData] = useState(null);

  let value = {
    $userAuth,
    $set_userAuth,
    $userData,
    $set_userData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
