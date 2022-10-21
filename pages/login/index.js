import { __PageTransition } from "../../lib/animtions";
import { motion } from "framer-motion";

const LogInPage = () => {
  return (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col w-full py-28"
      >
        <p>CONTENT GOES HERE</p>
      </motion.main>
    </>
  );
};

export default LogInPage;
