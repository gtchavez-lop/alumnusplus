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
        className="min-h-screen relative"
      >
        {/* desktop */}
        <section className="hidden lg:grid grid-cols-1 lg:grid-cols-2 min-h-screen lg:place-items-center py-16">
          <div>
            <img src="/mockup.svg" />
          </div>

          <div className="flex-col w-full">
            <motion.p className="text-4xl font-thin ">Alumnus Plus</motion.p>
            <motion.p>Your Alumni Network at Your Fingertips</motion.p>

            <motion.div className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-2 w-full max-w-md">
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
          </div>
        </section>

        {/* mobile */}
        <section className="lg:hidden relative flex flex-col min-h-screen justify-end items-center overflow-hidden">
          <div className="absolute -bottom-0 -z-10 w-[500px] h-screen flex items-center">
            <img src="/mockup.svg" className="scale-125" />
          </div>

          <div className="w-full py-16 pt-8 bg-base-100">
            <motion.p className="text-4xl font-thin ">Alumnus Plus</motion.p>
            <motion.p>Your Alumni Network at Your Fingertips</motion.p>

            <motion.div className="grid grid-cols-2 mt-5 gap-2 w-full">
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
          </div>
        </section>

        {/* floating theme button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="fixed top-4 left-4 z-10"
        >
          <ThemeSwitcherNew className={'btn btn-accent'} />
        </motion.div>
      </motion.main>
    </>
  );
};

export default Home;
