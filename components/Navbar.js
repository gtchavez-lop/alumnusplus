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
            <Link href={"/"} legacyBehavior>
              <Logo color="red" />
              {/* <img src="/wicket.svg" className="w-24" /> */}
              {/* <p className="select-none">SOMENAME</p> */}
            </Link>

            {/* desktop bar */}
            {visible && (
              <>
                <ul className="lg:flex gap-2 hidden">
                  <Link href={"/feed"} legacyBehavior>
                    <li className="btn btn-ghost btn-square btn-sm">
                      <FiGrid className="text-lg" />
                    </li>
                  </Link>
                  <Link href={"/messages"} legacyBehavior>
                    <li className="btn btn-ghost btn-square btn-sm">
                      <FiMail className="text-lg" />
                    </li>
                  </Link>
                  <Link href={"/me"} legacyBehavior>
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
