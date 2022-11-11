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
        <p className="text-center max-w-xl mx-auto">
          This page is for events that are happening in the MetaVerse. This
          includes events that are happening in the Wicket community, as well as
          events that are happening in the MetaVerse as a whole.
        </p>

        <p className="text-lg font-bold mt-16 text-center max-w-lg text-warning mx-auto">
          This feature is still in development. Please check back later for more
          information.
        </p>
      </motion.main>
    </>
  );
};

export default EventsPage;
