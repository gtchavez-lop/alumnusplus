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

        <p className="text-center max-w-xl mx-auto">
          This page is for job listings that are posted from provisioners. This
          includes jobs that are happening in the Wicket community.
        </p>



        <p className="text-lg font-bold mt-16 text-center max-w-lg text-warning mx-auto">
          This feature is still in development. Please check back later for more
          information.
        </p>
      </motion.main>
    </>
  );
};

export default JobListingPage;
