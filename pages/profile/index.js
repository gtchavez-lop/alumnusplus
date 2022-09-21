import { FiLoader, FiSearch } from 'react-icons/fi';

import ThemeSwitcher from '../../components/ThemeSwitcher';
import ThemeSwitcherNew from '../../components/ThemeSwitcherNew';
import { _Page_Transition } from '../../lib/_animations';
import _supabase from '../../lib/supabase';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../components/AuthContext';

const Page_Me = (e) => {
  const { user, userData } = useAuth();

  const _signOut = async () => {
    toast.loading('Signing out...');
    const { error } = await _supabase.auth.signOut();

    if (error) {
      toast.error('Error signing out');
    }

    toast.dismiss();
    toast.success('Signed out');
  };

  return (
    <>
      <motion.main
        variants={_Page_Transition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-center mt-32 pb-32"
      >
        <p className="text-4xl font-thin">Profile Page</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 w-full mt-16 gap-y-32 gap-x-5">
          {/* account details */}
          <div>
            <p className="text-2xl font-medium">Account Details</p>

            <div className="flex flex-col mt-5">
              <p className="text-xl font-medium">Email</p>
              <p className="text-lg font-thin">{user?.email}</p>
            </div>
            {userData ? (
              <>
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
                </div>
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

          {/* account settings */}
          <div>
            <p className="text-2xl font-medium">Account Settings</p>

            <div className="flex flex-col mt-5">
              <p className="text-xl font-medium">Select Theme</p>
              <ThemeSwitcherNew
                className="btn btn-primary"
                text="Open theme pallete"
              />
            </div>

            <div className="flex flex-col mt-5">
              <p className="text-xl font-medium">Change Password</p>
              <p className="text-lg font-thin">Coming Soon</p>
            </div>

            <div className="flex flex-col mt-5">
              <p className="text-xl font-medium">Delete Account</p>
              <p className="text-lg font-thin">Coming Soon</p>
            </div>

            <div className="flex flex-col mt-5">
              <p className="text-xl font-medium">Logout</p>
              <label htmlFor="logoutModal" className="btn btn-error">
                Sign out
              </label>
            </div>
          </div>
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
