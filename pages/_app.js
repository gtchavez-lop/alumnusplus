import '../styles/globals.css';

import { AnimatePresence } from 'framer-motion';
import { AuthWrapper } from '../components/AuthContext';
import BottomNavbar from '../components/BottomNavbar';
import { Toaster } from 'react-hot-toast';
import TopNavbar from '../components/TopNavbar';
import { themeChange } from 'theme-change';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // initialize theme-change
    themeChange(false);
  }, []);

  return (
    <>
      <AuthWrapper>
        <TopNavbar />

        <main className="flex justify-center px-5 xl:px-0">
          <section className="w-full max-w-6xl">
            <AnimatePresence mode="wait">
              <Component key={router.route} {...pageProps} />
            </AnimatePresence>
          </section>
        </main>

        <BottomNavbar />
      </AuthWrapper>

      <Toaster position="top-right" />
    </>
  );
}

export default MyApp;
