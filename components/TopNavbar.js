import {
  FiGrid,
  FiHome,
  FiList,
  FiMail,
  FiMapPin,
  FiSearch,
  FiUser,
} from 'react-icons/fi';

import { useAuth } from './AuthContext';
import { useRouter } from 'next/router';

const TopNavbar = (e) => {
  const router = useRouter();
  const { user, useData } = useAuth();

  return (
    <>
      <main className="flex justify-center bg-base-200 py-7 fixed w-full left-0 top-0 z-50">
        <section className="w-full max-w-6xl flex items-center justify-between px-5">
          <p className="font-thin">
            Alumnus <span className="font-medium">Plus</span>
          </p>
          {user && useData && (
            <div className="flex items-center gap-2">
              <button
                className="btn btn-primary btn-square hidden lg:inline-flex"
                onClick={() => router.push('/feed')}
              >
                <FiGrid size={20} />
              </button>
              <button
                className="btn btn-primary btn-square hidden lg:inline-flex"
                onClick={() => router.push('/search')}
              >
                <FiSearch size={20} />
              </button>
              <button
                className="btn btn-primary btn-square"
                onClick={() => router.push('/messages')}
              >
                <FiMail size={20} />
              </button>
              <button
                className="btn btn-primary btn-square hidden lg:inline-flex"
                onClick={() => router.push('/profile')}
              >
                <FiUser size={20} />
              </button>
              <button
                className="btn btn-primary btn-square hidden lg:inline-flex"
                onClick={() => router.push('/locator')}
              >
                <FiMapPin size={20} />
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default TopNavbar;
