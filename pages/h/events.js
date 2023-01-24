import ProtectedPageContainer from "@/components/ProtectedPageContainer";
import { __PageTransition } from "../../lib/animation";
import { motion } from "framer-motion";

const EventsPage = () => {
  return (
    <>
      <ProtectedPageContainer>
        <motion.main
          variants={__PageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative min-h-screen w-full pt-24 pb-36"
        >
          <h1 className="text-warning text-center mt-10">
            This page is under construction. Please check back later.
          </h1>
        </motion.main>
      </ProtectedPageContainer>
    </>
  );
};

export default EventsPage;
