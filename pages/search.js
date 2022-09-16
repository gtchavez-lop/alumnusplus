import { FiSearch } from 'react-icons/fi';
import { _Page_Transition } from '../lib/_animations';
import { motion } from 'framer-motion';

const Page_Search = (e) => {
  return (
    <>
      <motion.main
        variants={_Page_Transition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-center mt-32 pb-32"
      >
        <p className="text-4xl font-thin">Find your friends</p>

        <form className="form-control w-full items-center mt-10">
          <label className="input-group w-full max-w-md">
            <input
              type="text"
              className="input input-primary input-bordered w-full"
              placeholder="Search for your friends"
            />
            <button className="btn btn-square">
              <FiSearch size={20} />
            </button>
          </label>
        </form>
      </motion.main>
    </>
  );
};

export default Page_Search;
