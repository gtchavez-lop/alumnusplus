import Link from "next/link";
import { __PageTransition } from "../lib/animtions";
import __directus from "../lib/directus";
import { motion } from "framer-motion";
import { useAuth } from "../components/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Home = (e) => {
  return (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="flex flex-col items-center min-h-screen py-2">
          <h1 className="text-4xl font-bold">UNTITLED</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 mt-32 w-full max-w-md gap-2">
            <Link href={"/signin"}>
              <button className="btn btn-ghost btn-block">Sign In</button>
            </Link>
            <Link href={"/signup"}>
              <button className="btn btn-primary btn-block">Sign Up</button>
            </Link>
          </div>
        </div>
      </motion.main>
    </>
  );
};

export default Home;
