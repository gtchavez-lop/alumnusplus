import { useCallback, useEffect } from "react";

import InnerParticle from "../components/InnerParticle";
import Link from "next/link";
import { __PageTransition } from "../lib/animtions";
import __supabase from "../lib/supabase";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const Home = (e) => {
  // check if user is logged in then redirect to /feed
  const router = useRouter();
  // useEffect(() => {
  //   if (__supabase.auth.user()) {
  //     router.push("/feed");
  //   }
  // }, [router.pathname]);

  return (
    <>
      <motion.main className="relative">
        <motion.div
          variants={__PageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex flex-col items-center justify-center h-screen fixed top-0 left-0 w-full"
        >
          <h1 className="text-4xl font-bold">UNTITLED PROJECT</h1>

          <div className="grid grid-cols-1 w-full max-w-lg gap-5 absolute bottom-16 px-5">
            <Link href={"/signin"}>
              <button className="btn btn-ghost btn-block relative overflow-hidden">
                <span>Sign In</span>
                <InnerParticle />
              </button>
            </Link>
            <Link href={"/signup"}>
              <button className="btn btn-primary btn-block relative">
                <span>Create an Account</span>
              </button>
            </Link>
          </div>
        </motion.div>
      </motion.main>
    </>
  );
};

export default Home;
