import '../styles/globals.css';

import { AnimatePresence, motion } from 'framer-motion';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { AccountProvider } from '../components/AccountContext';
import BottomNav from '../components/BottomNav';
import { Toaster } from 'react-hot-toast';
import TopNav from '../components/TopNav';
import _supabase from '../utils/_supabase';
import { useRouter } from 'next/router';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AccountProvider>
          <TopNav />
          <main className="flex justify-center px-5 lg:px-0 py-32">
            <motion.section className="w-full max-w-5xl">
              <AnimatePresence key={router.route} mode="sync">
                <Component {...pageProps} />
              </AnimatePresence>
            </motion.section>
          </main>
          <BottomNav />

          <Toaster position="top-center" />
        </AccountProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
