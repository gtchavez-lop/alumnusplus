import { createContext, useContext, useEffect, useState } from 'react';

import _supabase from '../utils/_supabase';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

export const AccountContext = createContext();

export const useAccount = () => useContext(AccountContext);

export const AccountProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // get user data from user_data table
  const getUserData = async (id) => {
    const { data, error } = await _supabase
      .from('user_data')
      .select('*')
      .eq('id', id);

    if (error) {
      console.log(error);
      toast.error(error.message);
    }

    if (data.length > 0) {
      setLoading(false);
      setUserData(data[0]);
      router.replace('/feed');
    } else {
      setLoading(false);
      router.replace('/me/postauth');
    }
  };

  useEffect(() => {
    // check for user on page load
    const user = _supabase.auth.user();

    setUser(user ?? null);

    if (user !== null) {
      getUserData(user.id);
    } else {
      setLoading(false);
    }

    // if there is no user, redirect to login page
    if (user === null) {
      router.replace('/login');
    }

    _supabase.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case 'SIGNED_IN':
          setUser(session.user);
          getUserData(session.user.id);

          break;

        case 'SIGNED_OUT':
          setUser(null);
          setUserData(null);
          router.replace('/login');
          break;

        default:
          break;
      }
    });

    setLoading(false);
  }, []);

  let values = {
    user,
    setUser,
    userData,
    setUserData,
  };

  return (
    <AccountContext.Provider value={values}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {!loading && children}
      </motion.div>
    </AccountContext.Provider>
  );
};
