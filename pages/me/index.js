import _supabase from '../../utils/_supabase';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const Page_Profile = (e) => {
  const router = useRouter();

  const _signOut = async () => {
    await _supabase.auth.signOut();

    router.replace('/login');
  };

  return (
    <>
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={'flex flex-col'}
      >
        <p className="text-2xl">Profile Page</p>

        {/* sign out button */}
        <label htmlFor="signOutModal" className="btn btn-error max-w-md mt-10">
          Sign Out
        </label>
      </motion.main>

      {/* sign out modal */}
      <input type="checkbox" id="signOutModal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <p className="text-2xl">Sign Out</p>
          <p className="text-lg mt-2">Are you sure you want to sign out?</p>
          <div className="flex flex-row justify-end mt-10">
            <label htmlFor="signOutModal" className="btn btn-secondary mr-2">
              Cancel
            </label>
            <button onClick={_signOut} className="btn btn-error">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page_Profile;
