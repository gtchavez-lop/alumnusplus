import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import InnerParticle from "../components/InnerParticle";
import Link from "next/link";
import { __PageTransition } from "../lib/animtions";
import __supabase from "../lib/supabase";
import { useRouter } from "next/router";

const Home = (e) => {
  const jobList = [
    "Web Developer",
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer",
    "Mobile Developer",
    "UI/UX Designer",
    "Graphic Designer",
    "Product Designer",
  ];
  const [activeJob, setActiveJob] = useState(jobList[0]);
  const { scrollY } = useScroll();

  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("supabase.auth.token")) {
      router.push("/feed");
    }

    // set interval for job list
    const interval = setInterval(() => {
      setActiveJob(jobList[Math.floor(Math.random() * jobList.length)]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.5, ease: "circOut" },
        }}
        exit={{ opacity: 0, transition: { duration: 0.2, ease: "circIn" } }}
        className="absolute top-0 left-0 w-full h-full"
      >
        <img
          src="./mainbg.svg"
          className="absolute w-full min-h-[50vh] top-0 object-contain object-top  opacity-40"
        />
      </motion.div>

      <motion.div
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative flex flex-col items-start justify-center min-h-screen px-2 lg:px-0  bg-transparent"
      >
        <img src="/wicket.svg" className="w-64 fill-primary" />
        <p className="text-3xl flex flex-col lg:flex-row lg:justify-center mt-5">
          Job hunting for{" "}
          <span className="text-primary relative">
            <AnimatePresence>
              <motion.span
                key={activeJob}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "circOut" },
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                  transition: { duration: 0.5, ease: "circOut" },
                }}
                transition={{ duration: 0.5 }}
                className="absolute top-0 lg:left-2 w-max font-bold bg-clip-text text-transparent bg-gradient-to-r to-primary from-blue-300"
              >
                {activeJob}?
              </motion.span>
            </AnimatePresence>
          </span>
        </p>

        <div className="flex flex-col lg:flex-row lg:justify-center lg:items-center  mt-10">
          <Link href="/signup">
            <a className="btn btn-primary btn-sm mr-2">Sign up an account</a>
          </Link>
          <Link href="/signin">
            <a className="btn btn-ghost btn-sm">Sign in your account</a>
          </Link>
        </div>
      </motion.div>
    </>
  );
};

export default Home;
