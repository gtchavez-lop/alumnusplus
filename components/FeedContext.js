import { createContext, useContext, useEffect, useState } from 'react';

import _supabase from '../lib/supabase';

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

  useEffect(() => {
    fetchFeed();
  }, []);

  // listen for changes to the user_feed table
  useEffect(() => {
    _supabase
      .from('user_feed')
      .on('*', (payload) => {
        console.log(payload);
        fetchFeed();
      })
      .subscribe();
  }, []);

  return (
    <FeedContext.Provider value={{ feed, setFeed }}>
      {loading ? (
        <>
          <p>Loading Feed</p>
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
