import { FiSearch } from 'react-icons/fi';
import { _Page_Transition } from '../lib/_animations';
import { motion } from 'framer-motion';

const Page_Messages = (e) => {
  return (
    <>
      <motion.main
        variants={_Page_Transition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-center mt-32 pb-32"
      >
        <p className="text-4xl font-thin">Messages</p>
      </motion.main>
    </>
  );
};

export default Page_Messages;
