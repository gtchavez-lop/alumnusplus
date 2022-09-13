import Feed from '../../components/Feed';
import { motion } from 'framer-motion';

const Page_Feed = (e) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
      >
        <Feed />
      </motion.div>
    </>
  );
};

export default Page_Feed;
