import '../styles/globals.css';

import { AnimatePresence, motion } from 'framer-motion';

import BottomNav from '../components/BottomNav';
import TopNav from '../components/TopNav';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <TopNav />
      <main className="flex justify-center px-5 lg:px-0 py-32">
        <motion.section className="w-full max-w-5xl">
          <AnimatePresence key={router.route} mode="sync">
            <Component {...pageProps} />
          </AnimatePresence>
        </motion.section>
      </main>
      <BottomNav />
    </>
  );
}

export default MyApp;
