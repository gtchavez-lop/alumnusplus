import { useEffect, useState } from "react";

import Link from "next/link";
import ThemePicker from "../components/ThemePicker";
import { _PageTransition } from "../lib/animations";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const Home = (props) => {
  const [themeVisible, setThemeVisible] = useState(false);
  const router = useRouter();

  // check if has user
  useEffect(() => {
    const hasUser = window.localStorage.getItem("supabase.auth.token")
      ? true
      : false;

    if (hasUser) {
      router.push("/feed");
    }
  }, []);

  return (
    <>
      <motion.main
        variants={_PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col justify-center items-center h-screen absolute top-0 left-0 w-full"
      >
        <p className="text-3xl">Welcome to Alumnus Plus</p>
        <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 mt-10 gap-2">
          <Link href="/login">
            <div className="btn btn-ghost">Login</div>
          </Link>
          <div className="btn btn-primary">Register</div>
        </div>
        <div className="w-full max-w-md grid grid-cols-1 mt-10 ">
          <div
            onClick={(e) => setThemeVisible(!themeVisible)}
            className="btn btn-ghost"
          >
            Change Theme
          </div>
        </div>
      </motion.main>

      <ThemePicker visible={themeVisible} setVisible={setThemeVisible} />
    </>
  );
};

export default Home;
