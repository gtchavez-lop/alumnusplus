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
        <p>Index Page</p>
      </motion.main>
    </>
  );
};

export default Home;
