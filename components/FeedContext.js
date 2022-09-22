import { createContext, useContext, useEffect, useState } from 'react';

import { FiLoader } from 'react-icons/fi';
import _supabase from '../lib/supabase';
import { motion } from 'framer-motion';

const FeedContext = createContext();

const FeedWrapper = ({ children }) => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    const { data: user_feed, error } = await _supabase
      .from('user_feed')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.log(error);
    } else {
      setFeed(user_feed);
    }

    setLoading(false);
  };

  useEffect(() => {}, []);

  // listen for changes to the user_feed table
  useEffect(() => {
    _supabase
      .from('user_feed')
      .on('*', (payload) => {
        console.log(payload);
        fetchFeed();
      })
      .subscribe();

    fetchFeed();
  }, []);

  return (
    <FeedContext.Provider value={{ feed, setFeed }}>
      {loading ? (
        <>
          <motion.div
            exit={{ opacity: 0, y: 20 }}
            className="h-64 flex flex-col gap-5 justify-center items-center"
          >
            <FiLoader className="animate-spin" size={40} />
            <p className="text-2xl">Loading Feed</p>
          </motion.div>
        </>
      ) : (
        <>{children}</>
      )}
    </FeedContext.Provider>
  );
};

const useFeed = () => {
  const context = useContext(FeedContext);

  if (!context) {
    throw new Error('useFeed must be used within a FeedWrapper');
  }

  return context;
};

export { FeedWrapper, useFeed };
