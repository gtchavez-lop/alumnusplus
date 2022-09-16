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

        <div className="flex flex-col items-center mt-16 relative w-full">
          <div className="flex items-center gap-5 w-full max-w-md">
            <input
              type="text"
              placeholder="Search"
              className="input input-primary w-full"
            />
            <button className="btn btn-primary btn-square">
              <FiSearch size={20} />
            </button>
          </div>

          {/* list of messages */}
          <div className="flex flex-col items-center w-full mt-10 gap-10 max-w-md">
            {Array(10)
              .fill()
              .map((e, i) => (
                <div className="flex items-center gap-5 w-full">
                  <div className="flex items-center gap-5 overflow-hidden">
                    <img
                      src="https://picsum.photos/200"
                      alt="profile"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold">John Doe</p>
                      <p className="text-sm text-gray-500 truncate">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Quisquam, quod.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </motion.main>
    </>
  );
};

export default Page_Messages;
