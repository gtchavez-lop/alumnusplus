import {
  FiGrid,
  FiHome,
  FiMail,
  FiMapPin,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import { useEffect, useState } from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const BottomNav = (e) => {
  const router = useRouter();
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    if (
      router.pathname === "/" ||
      router.pathname === "/signin" ||
      router.pathname === "/signup"
    ) {
      setHasUser(false);
    } else {
      setHasUser(true);
    }
  }, [router.pathname]);

  return (
    hasUser && (
      <>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="fixed bottom-0 w-full px-1 py-3 z-[999] lg:hidden bg-base-200 grid grid-cols-4"
        >
          <button className="flex flex-col px-5 w-[96px]">
            <span
              className={`px-2 py-1 rounded-full flex justify-center ${
                router.pathname == "/" && "bg-primary text-primary-content px-5"
              }`}
            >
              <FiMapPin className="text-sm" />
            </span>
            <span className="text-xs">Locator</span>
          </button>
          <Link href={"/feed"} scroll={false} legacyBehavior>
            <button className="flex flex-col px-5 w-[96px]">
              <span
                className={`px-2 py-1 rounded-full flex justify-center ${
                  router.pathname == "/feed" &&
                  "bg-primary text-primary-content"
                }`}
              >
                <FiGrid className="text-sm" />
              </span>
              <span className="text-xs">Feed</span>
            </button>
          </Link>
          <Link href={"/messages"} scroll={false} legacyBehavior>
            <button className="flex flex-col px-5 w-[96px]">
              <span
                className={`px-2 py-1 rounded-full flex justify-center ${
                  router.pathname == "/messages" &&
                  "bg-primary text-primary-content"
                }`}
              >
                <FiMail className="text-sm" />
              </span>
              <span className="text-xs">Inbox</span>
            </button>
          </Link>
          <Link href={"/me"} scroll={false} legacyBehavior>
            <button className="flex flex-col px-5 w-[96px]">
              <span
                className={`px-2 py-1 rounded-full flex justify-center ${
                  router.pathname == "/me" && "bg-primary text-primary-content"
                }`}
              >
                <FiUser className="text-sm" />
              </span>
              <span className="text-xs">Profile</span>
            </button>
          </Link>
        </motion.div>
        {/* <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="btm-nav btm-nav-md lg:hidden bg-base-200"
        >
          <button>
            <FiMapPin className="text-lg" />
          </button>
          <button>
            <FiSearch className="text-lg" />
          </button>
          <Link href={"/feed"}>
            <button
              className={`${router.pathname == "/feed" && "active bg-primary"}`}
            >
              <FiGrid className="text-lg" />
            </button>
          </Link>
          <Link href={"/messages"}>
            <button
              className={`${
                router.pathname == "/messages" && "active bg-primary"
              }`}
            >
              <FiMail className="text-lg" />
            </button>
          </Link>
          <Link href={"/me"}>
            <button
              className={`${router.pathname == "/me" && "active bg-primary"}`}
            >
              <FiUser className="text-lg" />
            </button>
          </Link>
        </motion.div> */}
      </>
    )
  );
};

export default BottomNav;
