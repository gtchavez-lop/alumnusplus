import { createContext, useState } from "react";

import { __supabase } from "@/supabase";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getSession = async () => {
    const user = await __supabase.auth.getUser();
    setUser(user);
    console.log("user", user);
  };

  return (
    <UserContext.Provider value={{ user, getSession }}>
      {children}
    </UserContext.Provider>
  );
};
