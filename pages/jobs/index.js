import { __PageTransition } from "../../lib/animtions";
import { motion } from "framer-motion";

const JobListingPage = () => {
  return (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="pb-16 lg:pt-24 pt-36"
      >
        <p className="text-center text-2xl">Job Listing Page</p>
      </motion.main>
    </>
  );
};

export default JobListingPage;
