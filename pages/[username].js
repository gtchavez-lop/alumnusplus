import {
  FiArrowUp,
  FiEdit2,
  FiLoader,
  FiMinus,
  FiShare2,
} from 'react-icons/fi';
import { useEffect, useState } from 'react';

import ThemeSwitcherNew from '../components/ThemeSwitcherNew';
import { _Page_Transition } from '../lib/_animations';
import _supabase from '../lib/supabase';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../components/AuthContext';
import { useFeed } from '../components/FeedContext';
import { useRouter } from 'next/router';

export const getStaticPaths = async () => {
  const { data, error } = await _supabase
    .from('user_data')
    .select('user_handle');

  const paths = data.map((user) => ({
    params: { username: user.user_handle },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps = async (context) => {
  const { username } = context.params;

  // fetch user userData and user's posts
  const { data, error } = await _supabase
    .from('user_data')
    .select('*')
    .eq('user_handle', username)
    .single();

  // check for errors
  if (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      userData: data,
      notFound: false,
    },
    revalidate: 10,
  };
};

const UserPosts = ({ userID, setPageCount }) => {
  const [localFeed, setLocalFeed] = useState([]);

  const fetchPosts = async () => {
    const { data, error } = await _supabase
      .from('user_feed')
      .select('*')
      .eq('uploader_id', userID)
      .order('created_at', { ascending: false });

    if (error) {
      console.log(error);
    }

    setLocalFeed(data);
    setPageCount(data.length);
  };

  const _upvoteFeedPost = async (e, feedId) => {
    // filter the feed to find the post that was upvoted
    e.target.disabled = true;
    const post = localFeed.filter((post) => post.feed_id === feedId)[0];

    // parse upvoted_by json object if it exists
    const upvotedBy = post.upvoted_by ? JSON.parse(post.upvoted_by) : [];

    // check if the user has already upvoted the post
    const hasUpvoted = upvotedBy.includes(userID);

    // if the user has already upvoted the post, remove the user from the upvoted_by array
    if (hasUpvoted) {
      const index = upvotedBy.indexOf(userID);
      upvotedBy.splice(index, 1);
    } else {
      // if the user has not upvoted the post, add the user to the upvoted_by array
      upvotedBy.push(userID);
    }

    // update the post and add the user to the upvoted_list array
    const { data, error } = await _supabase
      .from('user_feed')
      .update({
        upvoted_by: JSON.stringify(upvotedBy),
      })
      .eq('feed_id', feedId);

    // update the selected post in the localfeed state
    const updatedFeed = localFeed.map((post) => {
      if (post.feed_id === feedId) {
        return {
          ...post,
          upvoted_by: JSON.stringify(upvotedBy),
        };
      }

      return post;
    });

    // update the localfeed state
    setLocalFeed(updatedFeed);

    e.target.disabled = false;
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2, ease: 'circOut' }}
        className="w-full flex flex-col items-center gap-5"
      >
        <p className="text-2xl mb-10">User Posts</p>

        {localFeed &&
          localFeed.map((item, i) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.3, delay: 0.2 * i },
              }}
              key={item.feed_id}
              className="flex flex-col gap-5 p-5 bg-base-300 rounded-btn w-full max-w-xl"
            >
              <div className="flex flex-row gap-5">
                <div className="flex items-center">
                  <img
                    src={`https://avatars.dicebear.com/api/micah/${item.uploader_handler}.svg`}
                    alt="profile"
                    className="rounded-full w-12 h-12 bg-white"
                  />
                </div>
                <div className="flex flex-col  justify-center">
                  <p className=" text-lg">@{item.uploader_handler}</p>
                  <p className="font-thin text-sm">
                    {dayjs(item.created_at).format('MMMM D, YYYY [at] h:mm A')}
                  </p>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-lg font-medium">{item.content}</p>
              </div>

              {/* upvote and share */}
              <div className="flex justify-between mt-5">
                <button
                  className={`btn btn-sm gap-5 ${
                    item.upvoted_by &&
                    JSON.parse(item.upvoted_by).includes(userID)
                      ? 'btn-primary'
                      : 'btn-ghost'
                  }`}
                  onClick={(e) => _upvoteFeedPost(e, item.feed_id)}
                >
                  <FiArrowUp size={20} />
                  <span>
                    {item.upvoted_by ? JSON.parse(item.upvoted_by).length : 0}
                  </span>
                </button>

                <button className="btn btn-ghost btn-sm gap-5" disabled>
                  <FiShare2 size={20} />
                  <span>Share</span>
                </button>
              </div>
            </motion.div>
          ))}
      </motion.section>
    </>
  );
};

const UserAccountSettings = ({ userData }) => {
  const _signOut = async () => {
    const { error } = await _supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2, ease: 'circOut' }}
      className="w-full flex flex-col items-center gap-5"
    >
      {userData && userData.hasId == false && (
        <div className="flex flex-col items-center gap-5 my-16">
          <p className="text-warning text-center max-w-sm">
            To experience the full features of this app, you need to set an ID.
            This ID will be used to identify you in the app.
          </p>
          <button
            className="btn btn-warning btn-sm"
            onClick={() => router.push('/upgrade')}
          >
            Upgrade Account now
          </button>
        </div>
      )}

      <p className="text-2xl font-medium text-center">Account Settings</p>

      <div className="grid grid-cols-1 md:grid-cols-2  gap-5 mt-10 w-full">
        <div className="flex flex-col ">
          <p className="text-xl font-medium">Change Password</p>
          <p className="text-lg font-thin">Coming Soon</p>
        </div>

        <div className="flex flex-col ">
          <p className="text-xl font-medium">Delete Account</p>
          <p className="text-lg font-thin">Coming Soon</p>
        </div>

        <div className="flex flex-col col-span-full">
          <p className="text-xl font-medium">Logout</p>
          <label htmlFor="logoutModal" className="btn btn-error max-w-sm">
            Sign out
          </label>
        </div>
      </div>
      <div className="divider mx-10" />
      <p className="text-2xl font-medium text-center">App Settings</p>

      <div className="grid grid-cols-1 md:grid-cols-2  gap-5 mt-10 w-full">
        <div className="flex flex-col">
          <p className="text-xl font-medium">Select Theme</p>
          <ThemeSwitcherNew
            className="btn btn-primary max-w-sm"
            text="Open theme pallete"
          />
        </div>
      </div>

      {/* log out modal */}
      <input type={'checkbox'} id="logoutModal" className="modal-toggle" />
      <div className="modal">
        <motion.div className="modal-box">
          <p className="text-xl">Are you sure you want to sign out?</p>
          <div className="flex flex-row justify-end mt-5 gap-3">
            <label htmlFor="logoutModal" className="btn btn-ghost">
              Cancel
            </label>
            <button onClick={_signOut} className="btn btn-error">
              Sign out
            </button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

const UserConnections = ({ userData }) => {
  const router = useRouter();
  const [connectedUsers, setConnectedUsers] = useState([]);
  const userConnections = userData && JSON.parse(userData.connections);
  const [selected, setSelected] = useState(null);

  const _fetchConnectedAccounts = async () => {
    const { data, error } = await _supabase
      .from('user_data')
      .select('id, name_given, name_last, connections, birthdate, user_handle')
      .in('id', [...userConnections]);

    if (error) {
      console.log(error);
    }

    // set connected users
    setConnectedUsers(data);
  };

  const _removeConnection = async (id) => {
    // toast
    toast.loading('Removing connection...');

    // parse connections
    const connections = JSON.parse(userData.connections);

    // remove connection
    const newConnections = connections.filter((item) => item !== id);

    // update user data
    const { error } = await _supabase
      .from('user_data')
      .update({ connections: JSON.stringify(newConnections) })
      .eq('id', userData.id);

    if (error) {
      console.log(error);
    }

    // update connected users without fetching
    const newConnectedUsers = connectedUsers.filter((item) => item.id !== id);
    setConnectedUsers(newConnectedUsers);

    // toast
    toast.dismiss();
    toast.success('Connection removed');

    // reload page
    router.reload();
  };

  useEffect(() => {
    _fetchConnectedAccounts();
  }, []);

  return (
    <>
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2, ease: 'circOut' }}
        className="w-full flex flex-col items-center gap-5"
      >
        <p className="text-2xl">User Connections</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10 w-full">
          {userData &&
            connectedUsers &&
            connectedUsers.map((item) => (
              <>
                <div className="flex flex-col items-center gap-5">
                  <img
                    src={`https://avatars.dicebear.com/api/micah/${item.user_handle}.svg`}
                    className="w-20 h-20 rounded-full bg-white"
                  />
                  <div className="flex flex-col items-center">
                    <p className="text-xl font-medium">{item.user_handle}</p>
                    <p className="text-lg font-thin">
                      {item.name_given} {item.name_last}
                    </p>

                    {/* unfollow button */}
                    <button
                      onClick={() => _removeConnection(item.id)}
                      className="btn btn-warning mt-5 btn-sm"
                    >
                      Unfollow
                    </button>
                  </div>
                </div>
              </>
            ))}
        </div>
      </motion.section>
    </>
  );
};

const Page_SpecificUser = ({ userData }) => {
  const { user } = useAuth();
  const [tabPage, setTabPage] = useState('posts');
  const userConnections = JSON.parse(userData.connections);
  const [postCount, setPostCount] = useState(0);

  return (
    <>
      {userData && user ? (
        <>
          <motion.main
            variants={_Page_Transition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen relative py-36"
          >
            <div className="flex justify-center w-full">
              <div className="flex items-center justify-between w-full max-w-4xl gap-10">
                <img
                  src={`https://avatars.dicebear.com/api/micah/${userData.user_handle}.svg`}
                  alt="profile"
                  className="rounded-full w-24 h-24 sm:w-28 sm:h-28 md:w-48 md:h-48 bg-white"
                />
                <div className="  w-full flex flex-col justify-center">
                  <p className="text-2xl font-bold">{userData.user_handle}</p>
                  <p className="text-sm opacity-50">
                    {userData.name_given} {userData.name_last}
                  </p>
                  {/* stats */}
                  <div className="flex items-center w-full max-w-sm gap-10 mt-5">
                    <div className="flex flex-col justify-center">
                      <p className=" opacity-50">Posts</p>
                      <p className="text-lg font-bold">{postCount}</p>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className=" opacity-50">Connections</p>
                      <p className="text-lg font-bold">
                        {userConnections ? userConnections.length : 0}
                      </p>
                    </div>
                    {/* <div className="flex flex-col justify-center">
                          <p className=" opacity-50">Following</p>
                          <p className="text-lg font-bold">0</p>
                        </div> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 items-center">
              {/* account details */}
              <div className="w-full flex"></div>

              {/* tabs */}
              <div className="tabs tabs-boxed p-4 py-2 gap-2 my-10">
                <a
                  onClick={() => setTabPage('posts')}
                  className={`tab tab-md ${tabPage == 'posts' && 'tab-active'}`}
                >
                  Posts
                </a>
                <a
                  onClick={() => setTabPage('connections')}
                  className={`tab tab-md ${
                    tabPage == 'connections' && 'tab-active'
                  }`}
                >
                  Connections
                </a>
                {userData.id === user.id && (
                  <a
                    onClick={() => setTabPage('settings')}
                    className={`tab tab-md ${
                      tabPage == 'settings' && 'tab-active'
                    }`}
                  >
                    Settings
                  </a>
                )}
              </div>

              {/* tab content */}
              {tabPage === 'posts' && (
                <UserPosts userID={userData.id} setPageCount={setPostCount} />
              )}
              {tabPage === 'settings' && (
                <UserAccountSettings userData={userData} />
              )}
              {tabPage === 'connections' && (
                <UserConnections
                  userData={userData}
                  connections={userConnections}
                />
              )}
            </div>
          </motion.main>
        </>
      ) : (
        <>
          <motion.div>
            <FiLoader
              size={24}
              className="animate-spin duration-700 mx-auto mt-16"
            />
          </motion.div>
        </>
      )}
    </>
  );
};

export default Page_SpecificUser;
