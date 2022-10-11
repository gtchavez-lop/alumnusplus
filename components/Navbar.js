import { AnimatePresence, motion } from "framer-motion";
import {
  FiDroplet,
  FiGrid,
  FiHome,
  FiMail,
  FiMenu,
  FiUser,
} from "react-icons/fi";
import { useEffect, useState } from "react";

import Link from "next/link";
import Logo from "./Logo";
import ThemeSwticher from "./ThemeSwticher";
import __supabase from "../lib/supabase";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/router";

const Navbar = () => {
  const [themeOpen, setThemeOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const { user, setUser } = useAuth();
  const router = useRouter();

  // get user data on mount
  useEffect(() => {
    let user = __supabase.auth.user();

    if (
      (user && router.pathname !== "/signin") ||
      router.pathname !== "/signup" ||
      router.pathname !== "/"
    ) {
      setUser(user);
      setVisible(true);
    }

    if (
      !user ||
      router.pathname === "/signin" ||
      router.pathname === "/signup" ||
      router.pathname === "/"
    ) {
      setUser(null);
      setVisible(false);
    }
  }, []);

  // listen for auth changes
  useEffect(() => {
    const { data: authListener } = __supabase.auth.onAuthStateChange(
      async (event, session) => {
        let user = session?.user ?? null;

        if (user) {
          setUser(user);
          setVisible(true);
        } else {
          setUser(null);
          setVisible(false);
        }
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  return (
    visible && (
      <>
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="fixed w-full justify-center items-center z-[999] bg-base-200 py-7"
        >
          <main className="w-full max-w-5xl px-5 lg:px-0 mx-auto hidden lg:flex justify-between items-center">
            {/* brand name */}
            <Link href={"/"}>
              <Logo color="red" />
              {/* <img src="/wicket.svg" className="w-24" /> */}
              {/* <p className="select-none">SOMENAME</p> */}
            </Link>
            {/* mobile menu */}
            <div className="dropdown dropdown-end lg:hidden">
              <label tabIndex={0} className="btn btn-primary btn-square">
                <FiMenu />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                {visible && (
                  <>
                    <li>
                      <Link href={"/feed"}>
                        <a>
                          <FiGrid className="text-lg" /> Feed
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href={"/me"}>
                        <a>
                          <FiUser className="text-lg" /> Profile
                        </a>
                      </Link>
                    </li>
                  </>
                )}
                {!visible && (
                  <>
                    <li>
                      <Link href={"/signin"}>
                        <a>
                          <FiUser className="text-lg" /> Sign In
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href={"/signup"}>
                        <a>
                          <FiMail className="text-lg" /> Sign Up
                        </a>
                      </Link>
                    </li>
                  </>
                )}
                {/* theme picker */}
                <li onClick={(e) => setThemeOpen(true)}>
                  <a>
                    <FiDroplet className="text-lg" /> Theme
                  </a>
                </li>
              </ul>
            </div>

            {/* desktop bar */}
            {visible && (
              <>
                <ul className="lg:flex gap-2 hidden">
                  <Link href={"/feed"}>
                    <li className="btn btn-ghost btn-square btn-sm">
                      <FiGrid className="text-lg" />
                    </li>
                  </Link>
                  <Link href={"/messages"}>
                    <li className="btn btn-ghost btn-square btn-sm">
                      <FiMail className="text-lg" />
                    </li>
                  </Link>
                  <Link href={"/me"}>
                    <li className="btn btn-ghost btn-square btn-sm">
                      <FiUser className="text-lg" />
                    </li>
                  </Link>
                  <li
                    onClick={(e) => setThemeOpen(true)}
                    className="btn btn-ghost btn-square btn-sm"
                  >
                    <FiDroplet className="text-lg" />
                  </li>
                </ul>
              </>
            )}
          </main>

          {(router.pathname !== "/" ||
            router.pathname !== "/signin" ||
            router.pathname !== "/signup") && (
            <main className="w-full max-w-5xl px-5 lg:px-0 mx-auto lg:hidden flex justify-between items-center">
              <p className="text-xl font-bold">
                {router.pathname === "/feed"
                  ? "Feed"
                  : router.pathname === "/me"
                  ? "Profile"
                  : router.pathname === "/messages"
                  ? "Messages"
                  : "Wicket"}
              </p>
            </main>
          )}
        </motion.nav>

        <AnimatePresence>
          <ThemeSwticher
            isOpen={themeOpen}
            setOpen={setThemeOpen}
            key={themeOpen}
          />
        </AnimatePresence>
      </>
    )
  );
};

export default Navbar;
