import { CgArrowRightO, CgSpinner } from 'react-icons/cg';

import Link from 'next/link';
import Logo from '../../components/Logo';
import _supabase from '../../utils/_supabase';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useState } from 'react';

const Page_Register = (e) => {
  const [page, setPage] = useState(1);
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const _signUp = async (e) => {
    toast('Signing up...');
    setPage(2);

    const { error: authError } = await _supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });

    if (authError) {
      setPage(1);
      toast(error.message);
    } else {
      const { data: detailTable } = await _supabase
        .from('user_data')
        .select('*')
        .eq('email', user.email);

      if (detailTable.length === 0) {
        toast.dismiss();
        setPage(3);
        toast.success('Account created.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 5000);
      } else {
        toast.dismiss();
        setPage(1);
        toast.error('Account already exists.');
      }
    }
  };

  return (
    <>
      <motion.main
        animate={{ opacity: [0, 1], translateY: [-10, 0] }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center px-5 "
      >
        {page === 1 && (
          <>
            <Logo />
            <p className="text-center text-3xl">
              Create an account to get started
            </p>
            <div className="form-control mt-6 gap-4 w-full max-w-sm">
              <label className="flex flex-col gap-2">
                <span className="ml-4">Email</span>
                <input
                  type="email"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') setPage(2);
                  }}
                  placeholder="juandelacruz@email.com"
                  className="input input-primary input-bordered w-full"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="ml-4">Password</span>
                <input
                  type="password"
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') setPage(2);
                  }}
                  placeholder="********"
                  className="input input-primary input-bordered w-full"
                />
              </label>

              <button
                onClick={_signUp}
                className="btn btn-primary w-full mt-4 gap-4"
              >
                <span>Sign up</span>
                <CgArrowRightO size={20} />
              </button>
            </div>
          </>
        )}

        {page === 2 && (
          <motion.section animate={{ opacity: [0, 1], y: [-10, 0] }}>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="flex justify-center items-center"
            >
              <CgSpinner size={30} />
            </motion.div>

            <p className="text-center mt-5">
              We&apos;re creating your account.
              <br /> Please wait a moment. This might take a while.
            </p>
          </motion.section>
        )}

        {page === 3 && (
          <>
            <motion.section
              className="flex flex-col items-center"
              animate={{ opacity: [0, 1], y: [-10, 0] }}
            >
              <Logo />
              <p className="text-center text-3xl mt-5">
                Congratulations! You&apos;re now registered.
                <br /> Please check your email to verify your account.
              </p>
              <p className="mt-2 opacity-50">
                Redirecting you to the login page in{' '}
                <span className="text-accent">5</span> seconds.
              </p>
            </motion.section>
          </>
        )}
      </motion.main>
    </>
  );
};

export default Page_Register;
