import { useEffect, useState } from 'react';

import Feed from '../components/Feed';
import Link from 'next/link';
import Logo from '../components/Logo';
import _supabase from '../utils/_supabase';
import { useAccount } from '../components/AccountContext';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

const Page_Landing = (e) => {
  const router = useRouter();
  // const { user, userData } = useAccount();

  // useEffect(() => {
  //   if (user && userData) {
  //     router.push('/feed');
  //   }

  //   if (user && !userData) {
  //     router.push('/me/postauth');
  //   }

  //   if (!user) {
  //     router.push('/login');
  //   }
  // }, []);

  return (
    <>
      <div className="absolute top-0 left-0 px-5 flex flex-col items-center justify-center min-h-screen w-full">
        <Logo />
        <p className="text-xl mt-2">Coded Prototype</p>
        <div className="grid grid-cols-2 gap-2 mt-16 justify-between w-full max-w-lg">
          <Link href="/login">
            <button className="btn btn-primary">Login</button>
          </Link>
          <Link href="/register">
            <button className="btn btn-secondary">Register</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Page_Landing;
