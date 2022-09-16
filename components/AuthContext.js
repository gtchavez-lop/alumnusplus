import { createContext, useContext, useEffect, useState } from 'react';

import _supabase from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthWrapper = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  let sharedState = {
    user,
    userData,
    loading,
  };

  // check if user exists on user_data table
  const checkUser = async (input) => {
    const { data: thisUserData, error } = await _supabase
      .from('user_data')
      .select('*')
      .eq('id', input.id)
      .single();

    if (!thisUserData) {
      router.replace('/setup');
    }

    if (thisUserData) {
      setUserData(thisUserData);
    }

    if (error) {
      console.log(error);
    }
  };

  // initialize supabase auth listener
  useEffect(() => {
    setLoading(true);

    // check if user exists on page load
    const thisUser = _supabase.auth.user();
    setUser(thisUser);

    if (thisUser) {
      checkUser(thisUser);
    }

    _supabase.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case 'SIGNED_IN':
          setUser(session.user);
          checkUser(session.user);
          break;

        case 'SIGNED_OUT':
          setUser(null);
          router.replace('/');
          break;

        case 'USER_UPDATED':
          setUser(session.user);
          break;

        case 'PASSWORD_RECOVERY':
          setUser(session.user);
          break;

        case 'USER_DELETED':
          setUser(null);
          break;

        default:
          break;
      }
    });

    setLoading(false);
  }, []);

  // chgeck if user exists on page load
  useEffect(() => {
    if (user) {
      checkUser(user);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={sharedState}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
