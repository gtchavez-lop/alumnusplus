import {
  FiGrid,
  FiMail,
  FiMapPin,
  FiSearch,
  FiShoppingCart,
  FiUser,
} from 'react-icons/fi';

import Link from 'next/link';
import Logo from './Logo';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/router';

const TopNavbar = (e) => {
  const router = useRouter();
  const { user, userData } = useAuth();

  return (
    <>
      {user && userData && (
        <motion.main
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, delay: 0.5, ease: 'circOut' }}
          className="flex justify-center bg-base-200 py-7 fixed w-full left-0 top-0 z-50"
        >
          <section className="w-full max-w-6xl flex items-center justify-between px-5">
            <div className="text-lg text-primary">
              <Logo />
            </div>
            <div className="flex items-center gap-2">
              <Link href={'/feed'} scroll={false}>
                <button className="btn btn-sm btn-square btn-ghost hidden lg:inline-flex">
                  <FiGrid
                    className={
                      router && router.pathname === '/feed'
                        ? ' stroke-primary'
                        : ''
                    }
                    size={20}
                  />
                </button>
              </Link>

              <Link href={'/search'} scroll={false}>
                <button className="btn btn-sm btn-square btn-ghost hidden lg:inline-flex">
                  <FiSearch
                    className={
                      router && router.pathname === '/search'
                        ? ' stroke-primary'
                        : ''
                    }
                    size={20}
                  />
                </button>
              </Link>
              <Link href={'/locator'} scroll={false}>
                <button className="btn btn-sm btn-square btn-ghost hidden lg:inline-flex">
                  <FiMapPin
                    className={
                      router && router.pathname === '/locator'
                        ? ' stroke-primary'
                        : ''
                    }
                    size={20}
                  />
                </button>
              </Link>
              <Link href={'/messages'} scroll={false}>
                <button className="btn btn-sm btn-square btn-ghost inline-flex">
                  <FiMail
                    className={
                      router && router.pathname === '/messages'
                        ? ' stroke-primary'
                        : ''
                    }
                    size={20}
                  />
                </button>
              </Link>
              <Link href={'/shop'} scroll={false}>
                <button className="btn btn-sm btn-square btn-ghost hidden lg:inline-flex">
                  <FiShoppingCart
                    className={
                      router && router.pathname === '/shop'
                        ? ' stroke-primary'
                        : ''
                    }
                    size={20}
                  />
                </button>
              </Link>
              <Link href={'/profile'} scroll={false}>
                <button
                  className="btn btn-sm btn-square btn-ghost hidden lg:inline-flex"
                  onClick={() => router.push('/profile')}
                >
                  <FiUser
                    className={
                      router && router.pathname === '/profile'
                        ? ' stroke-primary'
                        : ''
                    }
                    size={20}
                  />
                </button>
              </Link>
            </div>
          </section>
        </motion.main>
      )}
    </>
  );
};

export default TopNavbar;
