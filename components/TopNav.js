import {
  CgAddR,
  CgBell,
  CgHome,
  CgLogIn,
  CgMail,
  CgPin,
  CgSearch,
  CgUserAdd,
} from 'react-icons/cg';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import Logo from './Logo';
import _supabase from '../utils/_supabase';
import { motion } from 'framer-motion';
import { useAccount } from './AccountContext';

const TopNav = () => {
  const [activePage, setActivePage] = useState('');
  const { user } = useAccount();

  const handlePageChange = (page) => {
    setActivePage(page);
    window.sessionStorage.setItem('activePage', page);
  };

  useEffect(() => {
    const activePage = window.sessionStorage.getItem('activePage');
    if (activePage) {
      setActivePage(activePage);
    }
  }, []);

  return (
    <>
      {user !== null &&
        !window.location.href.includes('/login') &&
        !window.location.href.includes('/register') && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="z-50 flex justify-center overflow-hidden fixed w-full top-0 left-0"
          >
            <div className="w-full max-w-5xl flex items-center justify-between py-2 bg-base-200 px-5 lg:my-5 rounded-lg">
              <div>
                <Logo />
              </div>

              <>
                <div className="hidden lg:flex">
                  <label className="input-group input-group-sm">
                    <span>
                      <CgSearch size={20} />
                    </span>
                    <input
                      placeholder="Search..."
                      type="text"
                      className="input input-sm w-[250px]"
                    />
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/feed">
                    <button
                      onClick={(e) => handlePageChange('feed')}
                      className="hidden lg:inline-flex btn btn-ghost btn-square"
                    >
                      <CgHome size={20} />
                    </button>
                  </Link>
                  <button className="btn btn-ghost btn-square">
                    <CgAddR size={20} />
                  </button>
                  <button className="btn btn-ghost btn-square">
                    <CgMail size={20} />
                  </button>
                  <button className="hidden lg:inline-flex btn btn-ghost btn-square">
                    <CgBell size={20} />
                  </button>
                  <Link href="/locator">
                    <button
                      onClick={(e) => handlePageChange('locator')}
                      className="hidden lg:inline-flex btn btn-ghost btn-square"
                    >
                      <CgPin size={20} />
                    </button>
                  </Link>
                  <Link href="/me">
                    <button className="btn btn-ghost btn-square hidden lg:inline-flex">
                      <div className="avatar online">
                        <div className="w-7 h-7 rounded-full">
                          <img src="https://avatars.dicebear.com/api/male/geraldchavez.svg" />
                        </div>
                      </div>
                    </button>
                  </Link>
                </div>
              </>
            </div>
          </motion.nav>
        )}
    </>
  );
};

export default TopNav;
