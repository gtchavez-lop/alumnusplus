import { _Page_Transition } from '../lib/_animations';
import { motion } from 'framer-motion';

const Page_Upgrade = (e) => {
  return (
    <>
      <motion.main
        variants={_Page_Transition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col py-32"
      >
        <div className="flex flex-col items-center justify-center">
          <p className="text-4xl font-thin">Upgrade Account</p>

          <p className="text-2xl font-thin mt-32">Coming Soon </p>
          <p className="text-center opacity-50">
            This feature is currently in development. Please check back later.
          </p>
          <p className="text-center opacity-50">
            If you are a developer or a test user, please contact us by Facebook
            or Twitter to get access to this feature.
          </p>
        </div>
      </motion.main>
    </>
  );
};

export default Page_Upgrade;
