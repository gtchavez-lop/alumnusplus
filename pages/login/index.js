import { CgAbstract, CgInfo } from 'react-icons/cg';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import Logo from '../../components/Logo';
import _supabase from '../../utils/_supabase';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAccount } from '../../components/AccountContext';
import { useRouter } from 'next/router';

const Page_Login = () => {
  const { user: account, setUser: setAccount } = useAccount();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();

  const _signIn = async (e) => {
    toast.dismiss();
    toast.loading('Signing in...');
    setIsSigningIn(true);
    const { data, error } = await _supabase.auth.signIn({
      email: user.email,
      password: user.password,
    });

    if (error) {
      toast.dismiss();
      toast.error(error.message);
      setIsSigningIn(false);
    }
    if (data) {
      toast.dismiss();
      toast.success('Signed in!');
    }
  };

  return (
    <>
      <motion.main
        animate={{ opacity: [0, 1], translateY: [-10, 0] }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center px-5 "
      >
        <Logo />

        <div className="w-full max-w-lg mt-8">
          <p className="text-center text-3xl">Log in with your account</p>

          <div className="form-control mt-6 gap-4">
            <label className="flex flex-col gap-2">
              <span className="ml-4">Email</span>
              <input
                type="email"
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') _signIn();
                }}
                placeholder="juandelacruz@email.com"
                className="input input-primary input-bordered w-full"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="ml-4">Password</span>
              <input
                type="password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') _signIn();
                }}
                placeholder="********"
                className="input input-primary input-bordered w-full"
              />
            </label>

            <button
              disabled={isSigningIn}
              className="btn btn-success w-full mt-4"
              onClick={_signIn}
            >
              Log in
            </button>
            <Link href={'/register'}>
              <button className="btn btn-link link-accent w-full mt-4">
                Don&apos;t have an account? Click here
              </button>
            </Link>
          </div>
        </div>
      </motion.main>
    </>
  );
};

export default Page_Login;
