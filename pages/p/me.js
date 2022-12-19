import { __PageTransition } from "../../lib/animation";
import { motion } from "framer-motion";

const ProvMe = () => {
  return (
    <motion.main
      variants={__PageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen w-full flex flex-col gap-10 pt-24 pb-36"
    >
      <h1>Me</h1>
    </motion.main>
  );
};

export default ProvMe;
