import { FiMoreHorizontal, FiSearch } from 'react-icons/fi';
import { useEffect, useRef } from 'react';

import { _Page_Transition } from '../lib/_animations';
import { motion } from 'framer-motion';

const Page_Messages = (e) => {
  const _chatDesktop = useRef(null);

  useEffect(() => {
    // set the height of the chat desktop based on the height of the window minus 128px
    _chatDesktop.current.style.height = `${window.innerHeight - 150}px`;
  }, []);

  return (
    <>
      <motion.main
        variants={_Page_Transition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="grid grid-cols-1 lg:grid-cols-3 pt-32 gap-x-5 relative"
      >
        {/* chats */}
        <div className="col-span-full lg:col-span-1">
          <div className="flex flex-col items-center relative w-full">
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
            <div className="flex flex-col items-center w-full my-10 gap-2 overscroll-y-scroll ">
              {Array(10)
                .fill()
                .map((e, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-5 w-full hover:bg-base-300 py-3 px-2 rounded-md select-none cursor-pointer"
                  >
                    <div className="flex items-center gap-5 overflow-hidden">
                      <img
                        src="https://picsum.photos/200"
                        alt="profile"
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex flex-col">
                        <p className="text-lg font-semibold">John Doe</p>
                        <p className="text-sm text-base-content truncate">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Quisquam, quod.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* selected message */}
        <div
          ref={_chatDesktop}
          className="hidden lg:block lg:col-span-2 bg-base-200 rounded-btn p-5 sticky top-32"
        >
          <div className="flex flex-col w-full ">
            {/* chatmate's name */}
            <div className="flex items-center gap-5">
              <img
                src="https://picsum.photos/200"
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
              <p className="text-lg font-semibold">John Doe</p>
              <button className="btn btn-square btn-ghost ml-auto">
                <FiMoreHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.main>
    </>
  );
};

export default Page_Messages;
