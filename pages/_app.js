import '../styles/globals.css';

import { AnimatePresence } from 'framer-motion';
import { AuthWrapper } from '../components/AuthContext';
import BottomNavbar from '../components/BottomNavbar';
import { FiX } from 'react-icons/fi';
import { ToastBar } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import TopNavbar from '../components/TopNavbar';
import { themeChange } from 'theme-change';
import toast from 'react-hot-toast';
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

      <Toaster
        position="top-left"
        toastOptions={{
          style: {
            background: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <div className="px-5 py-4 rounded-lg flex flex-row items-center shadow-lg bg-base-100 border-2 border-primary text-base-content">
                {icon}
                {message}
                {t.type !== 'loading' && (
                  <button
                    className="flex items-center ml-5"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    <FiX size={20} />
                  </button>
                )}
              </div>
            )}
          </ToastBar>
        )}
      </Toaster>
    </>
  );
}

export default MyApp;
