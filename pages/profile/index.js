import {
  FiArrowUp,
  FiEdit2,
  FiLoader,
  FiSearch,
  FiShare2,
} from 'react-icons/fi';
import { useEffect, useState } from 'react';

import ThemeSwitcher from '../../components/ThemeSwitcher';
import ThemeSwitcherNew from '../../components/ThemeSwitcherNew';
import { _Page_Transition } from '../../lib/_animations';
import _supabase from '../../lib/supabase';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../components/AuthContext';
import { useFeed } from '../../components/FeedContext';
import { useRouter } from 'next/router';

// get the user's data from the database

const Page_Me = (e) => {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [tabPage, setTabPage] = useState('posts');
  const { feed, setFeed } = useFeed();
  const [myPosts, setMyPosts] = useState([]);
  const [myConnections, setMyConnections] = useState([]);

  const _signOut = async () => {
    toast.loading('Signing out...');
    const { error } = await _supabase.auth.signOut();

    if (error) {
      toast.error('Error signing out');
    }

    toast.dismiss();
    toast.success('Signed out');
  };

  useEffect(() => {
    if (user) {
      const _myPosts = feed.filter((post) => post.uploader_id === user.id);
      const sessiondata = JSON.parse(sessionStorage.getItem('userData'));
      const _myConnections = JSON.parse(sessiondata.connections);

      setMyPosts(_myPosts);
      setMyConnections(_myConnections);
    }
  }, []);

  return (
    <>
      <motion.main
        variants={_Page_Transition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-center mt-32 pb-32"
      >
        {userData && userData.hasId == false && (
          <div className="flex flex-col items-center gap-5 my-16">
            <p className="text-warning text-center max-w-sm">
              To experience the full features of this app, you need to set an
              ID. This ID will be used to identify you in the app.
            </p>
            <button
              className="btn btn-warning btn-sm"
              onClick={() => router.push('/upgrade')}
            >
              Upgrade Account now
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 w-full gap-y-32 gap-x-5">
          {/* account details */}
          <div>
            {userData ? (
              <>
                <div className="flex justify-center w-full">
                  <div className="flex items-center justify-between w-full max-w-4xl gap-10">
                    <img
                      src={`https://avatars.dicebear.com/api/micah/${userData.user_handle}.svg`}
                      alt="profile"
                      className="rounded-full w-24 h-24 sm:w-28 sm:h-28 md:w-48 md:h-48 bg-white"
                    />
                    <div className="  w-full flex flex-col justify-center">
                      <p className="text-2xl font-bold">
                        {userData.user_handle}
                      </p>
                      <p className="text-sm opacity-50">
                        {userData.name_given} {userData.name_last}
                      </p>
                      {/* stats */}
                      <div className="flex items-center w-full max-w-sm gap-10 mt-5">
                        <div className="flex flex-col justify-center">
                          <p className=" opacity-50">Posts</p>
                          <p className="text-lg font-bold">{myPosts.length}</p>
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className=" opacity-50">Connections</p>
                          <p className="text-lg font-bold">
                            {myConnections.length}
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

                {/* <div className="flex flex-col mt-5">
                  <p className="text-xl font-medium">Email</p>
                  <p className="text-lg font-thin">{user?.email}</p>
                </div>

                <div className="flex flex-col mt-5">
                  <p className="text-xl font-medium">Name</p>
                  <p className="text-lg font-thin">
                    {userData.name_given} {userData.name_last}
                  </p>
                </div>
                <div className="flex flex-col mt-5">
                  <p className="text-xl font-medium">Username</p>
                  <p className="text-lg font-thin">{userData.user_handle}</p>
                </div>
                <div className="flex flex-col mt-5">
                  <p className="text-xl font-medium">Account Type</p>
                  <p className="text-lg font-thin">
                    {userData.hasId ? 'Fully Verified' : 'Partially Verified'}
                  </p>
                </div> */}
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
          </div>
        </div>

        {/* tabs */}
        <div className="tabs tabs-boxed p-4 py-2 gap-2 my-10">
          <a
            onClick={() => setTabPage('posts')}
            className={`tab tab-md ${tabPage == 'posts' && 'tab-active'}`}
          >
            Posts
          </a>
          <a
            onClick={() => setTabPage('account')}
            className={`tab tab-md ${tabPage == 'account' && 'tab-active'}`}
          >
            Account
          </a>
          <a
            onClick={() => setTabPage('settings')}
            className={`tab tab-md ${tabPage == 'settings' && 'tab-active'}`}
          >
            Settings
          </a>
        </div>

        {/* tab content */}
        <div className="w-full">
          {tabPage == 'account' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: 'circOut' }}
              className="origin-top"
            >
              <p className="text-2xl font-medium text-center">
                Account Settings
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
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
                  <label
                    htmlFor="logoutModal"
                    className="btn btn-error max-w-sm"
                  >
                    Sign out
                  </label>
                </div>
              </div>
            </motion.div>
          )}
          {tabPage == 'settings' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: 'circOut' }}
              className="origin-top"
            >
              <p className="text-2xl font-medium text-center">
                Alumnus Plus Settings
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
                <div className="flex flex-col">
                  <p className="text-xl font-medium">Select Theme</p>
                  <ThemeSwitcherNew
                    className="btn btn-primary max-w-sm"
                    text="Open theme pallete"
                  />
                </div>
              </div>
            </motion.div>
          )}
          {tabPage == 'posts' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: 'circOut' }}
              className="origin-top"
            >
              <p className="text-2xl font-medium text-center mb-10">
                Your Posts
              </p>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                {myPosts &&
                  myPosts.map((item, i) => (
                    <div
                      key={`feed-${i}`}
                      className="flex flex-col gap-5 p-5 bg-base-300 rounded-btn"
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
                            {dayjs(item.created_at).format(
                              'MMMM D, YYYY [at] h:mm A'
                            )}
                          </p>
                        </div>

                        {item.uploader_id === user.id && (
                          <div className="flex flex-row gap-2 ml-auto">
                            <button
                              className="btn btn-ghost btn-circle"
                              disabled
                            >
                              <FiEdit2 />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-lg font-medium">{item.content}</p>
                      </div>

                      {/* upvote and share */}
                      <div className="flex justify-between mt-5">
                        <button
                          className={`btn btn-sm gap-5 no-animation cursor-default btn-ghost`}
                        >
                          <FiArrowUp size={20} />
                          <span>{item.upvotes}</span>
                        </button>

                        <button className="btn btn-ghost btn-sm gap-5" disabled>
                          <FiShare2 size={20} />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.main>

      {/* log out modal */}
      <input type={'checkbox'} id="logoutModal" className="modal-toggle" />
      <div className="modal">
        <motion.div className="modal-box">
          <p className="text-xl">Are you sure you want to sign out?</p>
          <div className="flex flex-row justify-end mt-5 gap-3">
            <label htmlFor="logoutModal" className="btn btn-error">
              Cancel
            </label>
            <button onClick={_signOut} className="btn btn-primary">
              Sign out
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Page_Me;
