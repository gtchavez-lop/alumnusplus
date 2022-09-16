import {
  FiGrid,
  FiHome,
  FiMail,
  FiMapPin,
  FiSearch,
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
      {hasUser && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="btm-nav btm-nav-lg lg:hidden z-50"
        >
          <Link href={'/feed'}>
            <button>
              <FiGrid size={20} />
              {router && router.pathname === '/feed' && (
                <span className="btm-nav-label">Feed</span>
              )}
            </button>
          </Link>
          <Link href={'/search'}>
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
          <Link href={'/locator'}>
            <button>
              <FiMapPin size={20} />
              {router && router.pathname === '/locator' && (
                <span className="btm-nav-label">Locator</span>
              )}
            </button>
          </Link>
          <Link href={'/profile'}>
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
