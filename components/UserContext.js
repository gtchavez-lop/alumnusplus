import { createContext, useContext, useEffect, useState } from "react";

import __supabase from "../lib/auth";

const UserContext = createContext();

const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    __supabase
      .from("user_data")
      .select("*")
      .eq("id", __supabase.auth.user().id)
      .single()
      .then((res) => {
        if (res.error) {
          console.log(res.error);
          return;
        }
        setUserData(res.data);
      });

    const userdatasub = __supabase
      .from("user_data")
      .on("*", (payload) => {
        if (payload.new.id === __supabase.auth.user().id) {
          setUserData(payload.new);
        }
      })
      .subscribe();

    return () => __supabase.removeSubscription(userdatasub);
  }, []);

  let sharedState = {
    $user: user,
    $userData: userData,
    $setUser: setUser,
    $setUserData: setUserData,
  };

  return (
    <>
      <UserContext.Provider value={sharedState}>
        {children}
      </UserContext.Provider>
    </>
  );
};

export { UserProvider, useUser };
