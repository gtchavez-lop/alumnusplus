import { FiMoreHorizontal, FiSend } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";

import { AnimatePresence } from "framer-motion";
import { __PageTransition } from "../lib/animtions";
import { motion } from "framer-motion";

const PageMessages = () => {
  const desktop_messages = useRef(null);
  const [selectedChat, setSelectedChat] = useState(null);

  // resize desktop_messages to fit the screen
  useEffect(() => {
    if (selectedChat) {
      console.log(desktop_messages.current);
      desktop_messages.current.style.height = `${window.innerHeight - 150}px`;
    }
  }, [selectedChat]);

  return (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="grid grid-cols-6 gap-5">
          <div className="col-span-full lg:col-span-2 flex flex-col gap-3">
            <p className="mb-5 text-lg font-bold">Messages</p>

            {Array(20)
              .fill()
              .map((_, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedChat(i)}
                  className="flex gap-5 items-center p-2 px-3 bg-base-300 bg-opacity-50 rounded-box cursor-pointer select-none"
                >
                  <img
                    // dicebear avatar
                    src={`https://avatars.dicebear.com/api/micah/${i}.svg`}
                    alt=""
                    className="w-12 h-12 rounded-full bg-white"
                  />
                  <div className="w-full overflow-hidden flex flex-col justify-center">
                    <p className="text-lg font-semibold leading-none">Micah</p>
                    <p className="leading-none text-base-content text-opacity-50 truncate text-ellipsis ">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quisquam, quod.
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {/* messages desktop */}
          <div
            ref={desktop_messages}
            className="hidden lg:flex lg:col-span-4 flex-col sticky top-32"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedChat}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.3, ease: "circOut" },
                }}
                exit={{
                  opacity: 0,
                  x: 20,
                  transition: { duration: 0.3, ease: "circIn" },
                }}
                className="flex flex-col gap-3 h-full"
              >
                {/* header */}
                <div className=" flex gap-3">
                  <img
                    // dicebear avatar
                    src={`https://avatars.dicebear.com/api/micah/${selectedChat}.svg`}
                    alt=""
                    className="w-12 h-12 rounded-full bg-white"
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-xl leading-none">Micah</p>
                    <p className="text-sm text-opacity-50 leading-none">
                      @micah
                    </p>
                  </div>

                  <div className="ml-auto">
                    <div className="btn btn-ghost btn-circle text-xl">
                      <FiMoreHorizontal />
                    </div>
                  </div>
                </div>

                {/* chat renderer */}
                <div className="flex flex-col bg-base-300 p-5 h-full bg-opacity-50 rounded-box overflow-y-auto gap-5">
                  {/* loop chat */}
                  {Array(20)
                    .fill()
                    .map((_, i) => (
                      <div key={i} className=" ">
                        <p className="text-xs ml-4 opacity-50">12:00 PM</p>
                        <div className="p-3 px-4 bg-base-100 rounded-full w-max">
                          <p>aklsjdklasd</p>
                        </div>
                      </div>
                    ))}
                </div>

                {/* input */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Type a message"
                  />
                  <div className="btn btn-ghost btn-circle text-xl">
                    <FiSend />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* messages mobile */}
          <AnimatePresence mode="sync">
            {selectedChat && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.2, ease: "circOut" },
                }}
                exit={{
                  opacity: 0,
                  y: 20,
                  transition: { duration: 0.2, ease: "circIn" },
                }}
                onClick={() => setSelectedChat(null)}
                className="lg:hidden col-span-full bg-base-100 fixed w-full h-full top-0 left-0 flex flex-col"
              >
                {/* chat header */}
                <div className="flex gap-3 p-3 px-4 mt-32">
                  <img
                    // dicebear avatar
                    src={`https://avatars.dicebear.com/api/micah/${selectedChat}.svg`}
                    alt=""
                    className="w-12 h-12 rounded-full bg-white"
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-xl leading-none">Micah</p>
                    <p className="text-sm text-opacity-50 leading-none">
                      @micah
                    </p>
                  </div>

                  <div className="ml-auto">
                    <div className="btn btn-ghost btn-circle text-xl">
                      <FiMoreHorizontal />
                    </div>
                  </div>
                </div>

                {/* chat renderer */}
                <div className="flex flex-col bg-base-300 p-5 h-full bg-opacity-50 rounded-box overflow-y-auto gap-5 mt-5 mx-2">
                  {/* loop chat */}
                  {Array(20)
                    .fill()
                    .map((_, i) => (
                      <div key={i} className=" ">
                        <p className="text-xs ml-4 opacity-50">12:00 PM</p>
                        <div className="p-3 px-4 bg-base-100 rounded-full w-max">
                          <p>aklsjdklasd</p>
                        </div>
                      </div>
                    ))}
                </div>

                {/* input */}
                <div className="flex gap-3 p-3 px-4 mb-16 mt-5">
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Type a message"
                  />
                  <div className="btn btn-ghost btn-circle text-xl">
                    <FiSend />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>
    </>
  );
};

export default PageMessages;
