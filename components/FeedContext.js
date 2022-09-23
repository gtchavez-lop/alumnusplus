import { createContext, useContext, useEffect, useState } from 'react';

import { FiLoader } from 'react-icons/fi';
import _supabase from '../lib/supabase';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';

const FeedContext = createContext();

const FeedWrapper = ({ children }) => {
  const { userData } = useAuth();
  const [feed, setFeed] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // listen for changes to the user_feed table
  useEffect(() => {
    _supabase
      .from('user_feed')
      .on('*', (payload) => {
        fetchFeed();
      })
      .subscribe();

    fetchFeed();
    fetchRecommendedUsers();
  }, []);

  const fetchFeed = async () => {
    // only show posts from the current user and their connections

    const { data: user_feed, error } = await _supabase
      .from('user_feed')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.log(error);
      return;
    } else {
      let sessiondata = JSON.parse(sessionStorage.getItem('userData'));
      let currentConnections = JSON.parse(sessiondata.connections);

      const filteredFeed = user_feed.filter((post) => {
        // if the post is from the current user, show it
        if (post.uploader_id === sessiondata.id) {
          return true;
        }

        // if the post is from a connection, show it
        if (
          currentConnections &&
          currentConnections.includes(post.uploader_id)
        ) {
          return true;
        }

        return false;
      });

      // add a blank object to filteredFeed to make room for recommended users on mobile
      // add that in the second position
      filteredFeed.splice(1, 0, {});

      setFeed(filteredFeed);
      setLoading(false);
    }
  };

  // fetch recommended users
  const fetchRecommendedUsers = async () => {
    const { data: users, error } = await _supabase
      .from('user_data')
      .select('*')
      .order('id', { ascending: false })
      .neq('id', _supabase.auth.user().id)
      .limit(5);

    let sessiondata = JSON.parse(sessionStorage.getItem('userData'));
    let currentConnections = JSON.parse(sessiondata.connections);

    if (error) {
      console.log(error);
      return;
    } else {
      const filteredUsers = users.filter((user) => {
        // if the user is already a connection, don't show them
        if (currentConnections && currentConnections.includes(user.id)) {
          return false;
        }

        return true;
      });

      setRecommendedUsers(filteredUsers);
    }
  };

  let sharedState = {
    feed,
    loading,
    recommendedUsers,
    setFeed,
    setRecommendedUsers,
  };

  return (
    <FeedContext.Provider value={sharedState}>
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
