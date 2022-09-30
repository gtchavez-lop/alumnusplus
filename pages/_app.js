import "../styles/globals.css";

import {
  FiGrid,
  FiMail,
  FiMapPin,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";

import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "../components/UserContext";
import { themeChange } from "theme-change";
import { useEffect } from "react";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    themeChange(false);
  }, []);

  const router = useRouter();

  return (
    <>
      <UserProvider>
        <main className="drawer">
          <input id="mobileDrawer" type="checkbox" className="drawer-toggle" />
          {/* content */}
          <div className="drawer-content">
            <>
              <Navbar routePath={router.pathname} />
              <main className="flex justify-center px-4 lg:px-0">
                <div className="w-full max-w-4xl relative py-32">
                  <AnimatePresence mode="wait">
                    <Component {...pageProps} key={router.pathname} />
                  </AnimatePresence>
                </div>
              </main>
            </>
          </div>
          {/* drawer content */}
          <div className="drawer-side ">
            <label htmlFor="mobileDrawer" className="drawer-overlay"></label>

            <label
              htmlFor="mobileDrawer"
              className="flex flex-col items-start bg-base-100 w-1/2 py-5"
            >
              <Link href="/feed">
                <label
                  htmlFor="mobileDrawer"
                  className="btn btn-ghost btn-block justify-start gap-2"
                >
                  <FiGrid size={17} />
                  <span>Feed</span>
                </label>
              </Link>
              <label
                htmlFor="mobileDrawer"
                className="btn btn-ghost btn-block justify-start gap-2"
              >
                <FiMail size={17} />
                <span>Messages</span>
              </label>
              <label
                htmlFor="mobileDrawer"
                className="btn btn-ghost btn-block justify-start gap-2"
              >
                <FiMapPin size={17} />
                <span>Locator</span>
              </label>
              <label
                htmlFor="mobileDrawer"
                className="btn btn-ghost btn-block justify-start gap-2"
              >
                <FiShoppingCart size={17} />
                <span>Shop</span>
              </label>
              <Link href={"/me"}>
                <label
                  htmlFor="mobileDrawer"
                  className="btn btn-ghost btn-block justify-start gap-2"
                >
                  <FiUser size={17} />
                  <span>My Profile</span>
                </label>
              </Link>
            </label>
          </div>
        </main>
      </UserProvider>

      <Toaster position="top-left" />
    </>
  );
}

export default MyApp;
