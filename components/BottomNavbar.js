import {
  FiGrid,
  FiHome,
  FiMail,
  FiMapPin,
  FiSearch,
  FiShoppingCart,
  FiUser,
} from 'react-icons/fi';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../components/AuthContext';
import { useRouter } from 'next/router';

const BottomNavbar = () => {
  const { user, userData } = useAuth();
  const [activePage, setActivePage] = useState('feed');
  const [hasUser, setHasUser] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      setHasUser(true);
    }
  }, [user]);

  return (
    <>
      {user && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: 'circOut' }}
          className="btm-nav btm-nav-lg lg:hidden z-50"
        >
          <Link href={'/feed'} scroll={false}>
            <button>
              <FiGrid size={20} />
              {router && router.pathname === '/feed' && (
                <span className="btm-nav-label">Feed</span>
              )}
            </button>
          </Link>
          <Link href={'/search'} scroll={false}>
            <button>
              <FiSearch size={20} />
              {router && router.pathname === '/search' && (
                <span className="btm-nav-label">Search</span>
              )}
            </button>
          </Link>
          {/* <button className="active">
              <FiMail size={20} />
              <span className="btm-nav-label">Messages</span>
            </button> */}
          <Link href={'/locator'} scroll={false}>
            <button>
              <FiMapPin size={20} />
              {router && router.pathname === '/locator' && (
                <span className="btm-nav-label">Locator</span>
              )}
            </button>
          </Link>
          <Link href={'/shop'} scroll={false}>
            <button>
              <FiShoppingCart size={20} />
              {router && router.pathname === '/shop' && (
                <span className="btm-nav-label">Shop</span>
              )}
            </button>
          </Link>
          <Link href={'/profile'} scroll={false}>
            <button>
              <FiUser size={20} />
              {router && router.pathname === '/profile' && (
                <span className="btm-nav-label">Profile</span>
              )}
            </button>
          </Link>
        </motion.div>
      )}
    </>
  );
};

export default BottomNavbar;
