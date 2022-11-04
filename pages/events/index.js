import { __PageTransition } from "../../lib/animtions";
import { motion } from "framer-motion";

const EventsPage = () => {
  return (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="pb-16 lg:pt-24 pt-36"
      >
        <p className="text-center text-2xl">Meta Events Page</p>
      </motion.main>
    </>
  );
};

export default EventsPage;
