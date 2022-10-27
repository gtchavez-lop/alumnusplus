import {
  FiGrid,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPackage,
  FiPaperclip,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import { useEffect, useState } from "react";

import Link from "next/link";
import Logo from "./Logo";
import __supabase from "../lib/supabase";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const NewNavbar = () => {
  const router = useRouter();
  const [hasUser, setHasUser] = useState(false);

  const checkUser = async () => {
    const user = await __supabase.auth.user();
    if (!user) {
      setHasUser(false);
    } else {
      setHasUser(true);
    }
  };

  useEffect(() => {
    checkUser();
  }, [router.pathname]);

  return (
    hasUser && (
      <>
        {/* mobile */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="lg:hidden fixed top-0 left-0 w-full z-[999] bg-base-200 pt-5 pb-2 px-5 flex flex-col gap-5 justify-center border-b-primary border-opacity-30 border-b-2"
        >
          <main className="grid grid-cols-3 w-full items-center">
            <Logo />
            <div />
            <div className="flex justify-end gap-2 items-center">
              <button className="flex justify-center items-center p-2 bg-base-300 rounded-full ">
                <FiSearch />
              </button>
              <Link href={"/messages"} scroll={false} legacyBehavior>
                <button className="flex justify-center items-center p-2 bg-base-300 rounded-full">
                  <FiMail />
                </button>
              </Link>
            </div>
          </main>
          <main className="grid grid-cols-5 w-full items-center place-items-center pb-1">
            <Link href={"/feed"} scroll={false} legacyBehavior>
              <button
                className={`px-5 py-2 rounded-full ${
                  router.pathname == "/feed" &&
                  "bg-primary text-primary-content"
                }`}
              >
                <FiGrid />
              </button>
            </Link>
            <Link href={"/finder"} scroll={false} legacyBehavior>
              <button
                className={`px-5 py-2 rounded-full ${
                  router.pathname == "/finder" &&
                  "bg-primary text-primary-content"
                }`}
              >
                <FiMapPin />
              </button>
            </Link>
            {/* <Link href={"/jobs"} scroll={false}> */}
            <button
              disabled
              className={`px-5 py-2 rounded-full ${
                router.pathname == "/jobs" && "bg-primary text-primary-content"
              }`}
            >
              <FiPaperclip />
            </button>
            {/* </Link> */}
            {/* <Link href={"/"} scroll={false}> */}
            <button
              disabled
              className={`px-5 py-2 rounded-full ${
                router.pathname == "/" && "bg-primary text-primary-content"
              }`}
            >
              <FiPackage />
            </button>
            {/* </Link> */}
            <Link href={"/me"} scroll={false} legacyBehavior>
              <button
                className={`px-5 py-2 rounded-full ${
                  router.pathname == "/me" && "bg-primary text-primary-content"
                }`}
              >
                <FiUser />
              </button>
            </Link>
          </main>
        </motion.nav>

        {/* desktop */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="hidden fixed top-0 left-0 w-full z-[999] bg-base-200 py-4 px-5 lg:flex gap-5 justify-center border-b-primary border-opacity-30 border-b-2"
        >
          <main className="grid grid-cols-3 w-full items-center max-w-5xl">
            <Logo />
            <div className="flex justify-center gap-2">
              <Link href={"/feed"} scroll={false} legacyBehavior>
                <div className="tooltip tooltip-bottom " data-tip="Update Feed">
                  <button
                    className={`px-5 py-2 rounded-full hover:bg-primary hover:bg-opacity-50 transition-all ${
                      router.pathname == "/feed" &&
                      "bg-primary text-primary-content"
                    }`}
                  >
                    <FiGrid className="text-xl" />
                  </button>
                </div>
              </Link>
              <Link href={"/finder"} scroll={false} legacyBehavior>
                <div className="tooltip tooltip-bottom " data-tip="Finder">
                  <button
                    className={`px-5 py-2 rounded-full hover:bg-primary hover:bg-opacity-50 transition-all ${
                      router.pathname == "/finder" &&
                      "bg-primary text-primary-content"
                    }`}
                  >
                    <FiMapPin className="text-xl" />
                  </button>
                </div>
              </Link>
              <Link href={"/jobs"} scroll={false} legacyBehavior>
                <div
                  className="tooltip tooltip-bottom "
                  data-tip="Job Postings"
                >
                  <button
                    className={`px-5 py-2 rounded-full hover:bg-primary hover:bg-opacity-50 transition-all ${
                      router.pathname == "/jobs" &&
                      "bg-primary text-primary-content"
                    }`}
                  >
                    <FiPaperclip className="text-xl" />
                  </button>
                </div>
              </Link>
              <Link href={"/"} scroll={false} legacyBehavior>
                <div
                  className="tooltip tooltip-bottom "
                  data-tip="Featured Events"
                >
                  <button
                    className={`px-5 py-2 rounded-full hover:bg-primary hover:bg-opacity-50 transition-all ${
                      router.pathname == "/" &&
                      "bg-primary text-primary-content"
                    }`}
                  >
                    <FiPackage className="text-xl" />
                  </button>
                </div>
              </Link>
            </div>
            <div className="flex justify-end gap-2">
              <Link href={"/messages"} scroll={false} legacyBehavior>
                <button
                  className={`px-5 py-2 rounded-full hover:bg-primary hover:bg-opacity-50 transition-all ${
                    router.pathname == "/messages" &&
                    "bg-primary text-primary-content"
                  }`}
                >
                  <FiMail />
                </button>
              </Link>
              <Link href={"/me"} scroll={false} legacyBehavior>
                <button
                  className={`px-5 py-2 rounded-full hover:bg-primary hover:bg-opacity-50 transition-all ${
                    router.pathname == "/me" &&
                    "bg-primary text-primary-content"
                  }`}
                >
                  <FiUser className="text-xl" />
                </button>
              </Link>
            </div>
          </main>
        </motion.nav>
      </>
    )
  );
};

export default NewNavbar;
