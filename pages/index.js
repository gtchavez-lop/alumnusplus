import { FiLogIn, FiUserPlus } from 'react-icons/fi';

import Link from 'next/link';
import ThemeSwitcher from '../components/ThemeSwitcher';
import ThemeSwitcherNew from '../components/ThemeSwitcherNew';
import { _Page_Transition } from '../lib/_animations';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../components/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      toast.dismiss();
      toast.loading('Checking your account...');
      router.push('/feed');
      setTimeout(() => {
        toast.dismiss();
        toast.success('Welcome!');
      }, 500);
    }
  }, [user]);

  return (
    <>
      <motion.main
        variants={_Page_Transition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen"
      >
        <section className="flex flex-col items-center justify-center h-screen">
          <motion.p
            // animate character spacing
            animate={{ letterSpacing: ['1rem', '0rem'], opacity: [0, 1] }}
            transition={{ duration: 1, delay: 0.5, ease: 'circOut' }}
            className="text-4xl font-thin opacity-0"
          >
            Alumnus Plus
          </motion.p>
          <motion.p
            animate={{ opacity: [0, 1], y: [10, 0] }}
            transition={{ duration: 1, delay: 1, ease: 'circOut' }}
          >
            Your Alumni Network at Your Fingertips
          </motion.p>

          <motion.div
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 1, delay: 2, ease: 'circOut' }}
            className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-2 w-full max-w-md"
          >
            <Link href={'/signin'}>
              <button className="btn btn-primary btn-outline gap-5">
                <span>Sign in</span>
                <FiLogIn size={20} />
              </button>
            </Link>
            <Link href={'/signup'}>
              <button className="btn btn-primary gap-5">
                <span>Sign up</span>
                <FiUserPlus size={20} />
              </button>
            </Link>
          </motion.div>

          <motion.div
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 1, delay: 3, ease: 'circOut' }}
            className="mt-10 w-full max-w-md"
          >
            <ThemeSwitcherNew className={'btn btn-block btn-primary'} />
            {/* <ThemeSwitcher className=" mt-16" /> */}
          </motion.div>
        </section>
      </motion.main>
    </>
  );
};

export default Home;
