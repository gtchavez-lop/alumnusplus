import {
  FiBriefcase,
  FiFileText,
  FiGlobe,
  FiGrid,
  FiHome,
  FiInbox,
  FiMap,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import { useEffect, useState } from "react";

import Link from "next/link";
import Logo from "./Logo";
// import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { __supabase } from "../supabase";
import { motion } from "framer-motion";
import useLocalStorage from "../lib/localStorageHook";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const [hasUser, setHasUser] = useState(false);
  const [userData, setUserData] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [authState, setAuthState] = useLocalStorage("authState");
  // const __supabase = useSupabaseClient();

  const checkUser = async () => {
    if (authState) {
      setHasUser(true);
      setUserData(authState);
    } else {
      setHasUser(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, [authState]);

  return (
    hasUser && (
      <>
        {/* mobile top */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="lg:hidden fixed top-0 left-0 w-full z-[999] pt-5 pb-5 px-5 flex flex-col gap-5 justify-center backdrop-blur-md bg-base-100 bg-opacity-50"
        >
          <main className="flex w-full items-center gap-5">
            <Logo />
            {userData.user_metadata.type === "hunter" && (
              <div className="flex justify-end gap-2 items-center w-full">
                <div className="flex justify-end items-center w-full">
                  {isSearching && (
                    <input className="input input-primary input-bordered w-full max-w-md" />
                  )}
                  <button
                    onClick={() => {
                      if (!isSearching) setIsSearching(true);
                    }}
                    className="btn btn-circle btn-ghost"
                  >
                    <FiSearch />
                  </button>
                </div>
                <Link href={"/messages"} scroll={false} legacyBehavior={true}>
                  <button className="btn btn-circle btn-ghost">
                    <FiInbox />
                  </button>
                </Link>
              </div>
            )}
          </main>
        </motion.nav>
        {userData.user_metadata.type === "hunter" && (
          <>
            {/* mobile bottom hunter */}
            <motion.nav
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="lg:hidden fixed bottom-0 left-0 w-full z-[999] p-5 backdrop-blur-sm bg-base-100 bg-opacity-20 flex flex-col gap-5 justify-center"
            >
              <main className="grid grid-cols-5 w-full items-center place-items-center pb-1">
                <Link href={"/h/feed"} scroll={false} legacyBehavior={true}>
                  <button
                    className={`px-5 py-2 rounded-full ${
                      router.pathname === "/h/feed" &&
                      "bg-primary text-primary-content"
                    }`}
                  >
                    <FiGrid />
                  </button>
                </Link>
                <Link href={"/h/drift"} scroll={false} legacyBehavior={true}>
                  <button
                    className={`px-5 py-2 rounded-full ${
                      router.pathname === "/h/drift" &&
                      "bg-primary text-primary-content"
                    }`}
                  >
                    <FiMap />
                  </button>
                </Link>
                <Link href={"/h/jobs"} scroll={false}>
                  <button
                    className={`px-5 py-2 rounded-full ${
                      router.pathname === "/h/jobs" &&
                      "bg-primary text-primary-content"
                    }`}
                  >
                    <FiBriefcase />
                  </button>
                </Link>
                <Link href={"/h/events"} scroll={false}>
                  <button
                    className={`px-5 py-2 rounded-full ${
                      router.pathname === "/h/events" &&
                      "bg-primary text-primary-content"
                    }`}
                  >
                    <FiGlobe />
                  </button>
                </Link>
                <Link href={"/h/me"} scroll={false} legacyBehavior={true}>
                  <button
                    className={`px-5 py-2 rounded-full ${
                      router.pathname === "/h/me" &&
                      "bg-primary text-primary-content"
                    }`}
                  >
                    <FiUser />
                  </button>
                </Link>
              </main>
            </motion.nav>

            {/* desktop hunter */}
            <motion.nav className="hidden fixed top-0 left-0 w-full z-[999] bg-base-200 py-4 px-5 lg:flex gap-5 justify-center ">
              <main className="grid grid-cols-3 w-full items-center max-w-5xl">
                <Logo />
                <div className="flex justify-center gap-2">
                  <Link href={"/h/feed"} scroll={false} legacyBehavior={true}>
                    <div
                      className="tooltip tooltip-bottom "
                      data-tip="Update Feed"
                    >
                      <button
                        className={`px-5 py-2 rounded-full hover:bg-primary hover:bg-opacity-50 transition-all ${
                          router.pathname === "/h/feed" &&
                          "bg-primary text-primary-content"
                        }`}
                      >
                        <FiGrid className="text-xl" />
                      </button>
                    </div>
                  </Link>
                  <Link href={"/h/drift"} scroll={false} legacyBehavior={true}>
                    <div
                      className="tooltip tooltip-bottom "
                      data-tip="Wicket Drift"
                    >
                      <button
                        className={`px-5 py-2 rounded-full hover:bg-primary hover:bg-opacity-50 transition-all ${
                          router.pathname === "/h/drift" &&
                          "bg-primary text-primary-content"
                        }`}
                      >
                        <FiMap className="text-xl" />
                      </button>
                    </div>
                  </Link>
                  <Link href={"/h/jobs"} scroll={false} legacyBehavior={true}>
                    <div
                      className="tooltip tooltip-bottom "
                      data-tip="Job Postings"
                    >
                      <button
                        className={`px-5 py-2 rounded-full hover:bg-primary hover:bg-opacity-50 transition-all ${
                          router.pathname === "/h/jobs" &&
                          "bg-primary text-primary-content"
                        }`}
                      >
                        <FiBriefcase className="text-xl" />
                      </button>
                    </div>
                  </Link>
                  <Link href={"/h/events"} scroll={false} legacyBehavior={true}>
                    <div
                      className="tooltip tooltip-bottom "
                      data-tip="Metaverse Events"
                    >
                      <button
                        className={`px-5 py-2 rounded-full hover:bg-primary hover:bg-opacity-50 transition-all ${
                          router.pathname === "/h/events" &&
                          "bg-primary text-primary-content"
                        }`}
                      >
                        <FiGlobe className="text-xl" />
                      </button>
                    </div>
                  </Link>
                </div>
                <div className="flex justify-end gap-2">
                  <Link
                    href={"/h/messages"}
                    scroll={false}
                    legacyBehavior={true}
                  >
                    <button
                      className={`px-5 py-2 rounded-full hover:bg-primary hover:bg-opacity-50 transition-all ${
                        router.pathname === "/h/messages" &&
                        "bg-primary text-primary-content"
                      }`}
                    >
                      <FiInbox />
                    </button>
                  </Link>
                  <Link href={"/h/me"} scroll={false} legacyBehavior={true}>
                    <button
                      className={`px-5 py-2 rounded-full hover:bg-primary hover:bg-opacity-50 transition-all ${
                        router.pathname === "/h/me" &&
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
        )}

        {userData.user_metadata.type === "provisioner" && (
          <>
            {/* mobile bottom provisioner */}
            <motion.nav
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="lg:hidden fixed bottom-0 left-0 w-full z-[999] p-5 backdrop-blur-sm bg-base-100 bg-opacity-20 flex flex-col gap-5 justify-center"
            >
              <main className="grid grid-cols-4 w-full items-center place-items-center pb-1">
                <Link
                  href={"/p/dashboard"}
                  scroll={false}
                  legacyBehavior={true}
                >
                  <button
                    className={`px-5 py-2 rounded-full ${
                      router.pathname === "/p/dashboard" &&
                      "bg-primary text-primary-content"
                    }`}
                  >
                    <FiHome />
                  </button>
                </Link>
                <Link href={"/p/jobs"} scroll={false}>
                  <button
                    className={`px-5 py-2 rounded-full ${
                      router.pathname === "/p/jobs" &&
                      "bg-primary text-primary-content"
                    }`}
                  >
                    <FiBriefcase />
                  </button>
                </Link>
                <Link href={"/events"} scroll={false}>
                  <button
                    className={`px-5 py-2 rounded-full ${
                      router.pathname === "/events" &&
                      "bg-primary text-primary-content"
                    }`}
                  >
                    <FiGlobe />
                  </button>
                </Link>
                <Link href={"/me"} scroll={false} legacyBehavior={true}>
                  <button
                    className={`px-5 py-2 rounded-full ${
                      router.pathname === "/me" &&
                      "bg-primary text-primary-content"
                    }`}
                  >
                    <FiUser />
                  </button>
                </Link>
              </main>
            </motion.nav>

            {/* desktop provisioner */}
            <motion.nav
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="hidden fixed top-0 left-0 w-full z-[999] bg-base-200 py-4 px-5 lg:flex gap-5 justify-center border-b-primary border-opacity-30 border-b-2"
            >
              <main className="grid grid-cols-3 w-full items-center max-w-5xl">
                <Logo />
                <div className="flex justify-center gap-2">
                  <Link
                    href={"/p/dashboard"}
                    scroll={false}
                    legacyBehavior={true}
                  >
                    <div
                      className="tooltip tooltip-bottom "
                      data-tip="Dashboard"
                    >
                      <button
                        className={`px-5 py-2 rounded-full hover:bg-primary hover:bg-opacity-50 transition-all ${
                          router.pathname === "/p/dashboard" &&
                          "bg-primary text-primary-content"
                        }`}
                      >
                        <FiHome className="text-xl" />
                      </button>
                    </div>
                  </Link>
                  <Link href={"/p/jobs"} scroll={false} legacyBehavior={true}>
                    <div
                      className="tooltip tooltip-bottom "
                      data-tip="Job Postings"
                    >
                      <button
                        className={`px-5 py-2 rounded-full hover:bg-primary hover:bg-opacity-50 transition-all ${
                          router.pathname === "/p/jobs" &&
                          "bg-primary text-primary-content"
                        }`}
                      >
                        <FiBriefcase className="text-xl" />
                      </button>
                    </div>
                  </Link>
                  <Link href={"/p/events"} scroll={false} legacyBehavior={true}>
                    <div
                      className="tooltip tooltip-bottom "
                      data-tip="Metaverse Events"
                    >
                      <button
                        className={`px-5 py-2 rounded-full hover:bg-primary hover:bg-opacity-50 transition-all ${
                          router.pathname === "/p/events" &&
                          "bg-primary text-primary-content"
                        }`}
                      >
                        <FiGlobe className="text-xl" />
                      </button>
                    </div>
                  </Link>
                </div>
                <div className="flex justify-end gap-2">
                  <Link
                    href={"/p/messages"}
                    scroll={false}
                    legacyBehavior={true}
                  >
                    <button
                      className={`px-5 py-2 rounded-full hover:bg-primary hover:bg-opacity-50 transition-all ${
                        router.pathname === "/p/messages" &&
                        "bg-primary text-primary-content"
                      }`}
                    >
                      <FiInbox />
                    </button>
                  </Link>
                  <Link href={"/p/me"} scroll={false} legacyBehavior={true}>
                    <button
                      className={`px-5 py-2 rounded-full hover:bg-primary hover:bg-opacity-50 transition-all ${
                        router.pathname === "/p/me" &&
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
        )}
      </>
    )
  );
};

export default Navbar;
