import { CgAdd, CgPin } from 'react-icons/cg';
import { useEffect, useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';

const Page_Locator = (e) => {
  const [loading, setLoading] = useState(true);

  useEffect((e) => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="flex justify-center items-center min-h-screen absolute overflow-hidden top-0 left-0 w-full"
      >
        {/* search loading */}
        <AnimatePresence>
          {loading && (
            <>
              <motion.p
                animate={{ opacity: [0, 1], y: [-10, 0] }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute top-36 z-20 text-lg opacity-0"
              >
                Searching for Alumni near you
              </motion.p>
              {/* avatar */}
              <motion.div
                animate={{ opacity: [0, 1], scale: [0.5, 1] }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="z-10 opacity-0"
              >
                <div className="avatar">
                  <div className="w-16 h-16 rounded-full">
                    <img src="https://avatars.dicebear.com/api/male/geraldchavez.svg" />
                  </div>
                </div>
              </motion.div>

              {/* search circles */}
              <motion.div
                animate={{ opacity: [0, 1] }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center w-full h-full absolute top-0 left-0 opacity-0"
              >
                <motion.div
                  animate={{ scale: [0.5, 1], opacity: [0, 1, 0] }}
                  transition={{
                    repeat: Infinity,
                    repeatType: 'linear',
                    duration: 2,
                  }}
                  className="border-2  w-[150px] h-[150px] absolute rounded-full"
                />
                <motion.div
                  animate={{ scale: [0.5, 1], opacity: [0, 0.8, 0] }}
                  transition={{
                    repeat: Infinity,
                    repeatType: 'linear',
                    duration: 2,
                  }}
                  className="border-2  w-[250px] h-[250px] absolute rounded-full opacity-80"
                />
                <motion.div
                  animate={{ scale: [0.5, 1], opacity: [0, 0.6, 0] }}
                  transition={{
                    repeat: Infinity,
                    repeatType: 'linear',
                    duration: 2,
                  }}
                  className="border-2  w-[350px] h-[350px] absolute rounded-full opacity-60"
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.main>

      {/* search results */}
      <AnimatePresence>
        {!loading && (
          <>
            <motion.main
              animate={{ opacity: [0, 1], y: [10, 0] }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="opacity-0"
            >
              <motion.div>
                <p className="text-3xl text-center mb-10">Search Results</p>

                <motion.div className=" max-w-lg mx-auto flex flex-col gap-3">
                  {Array(10)
                    .fill()
                    .map((_, i) => (
                      <motion.div
                        animate={{ opacity: [0, 1], y: [10, 0] }}
                        transition={{ duration: 0.5, delay: 0.15 * i }}
                        key={i}
                        className="flex items-center gap-5 z-10"
                      >
                        <div className="avatar ring-2 rounded-full ring-offset-4 ring-primary">
                          <div className="w-9 h-9 rounded-full bg-slate-300">
                            <img src="https://avatars.dicebear.com/api/male/geraldchavez.svg" />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <p>Username goes here</p>
                          <p className="text-xs">@theirAtSign</p>
                        </div>
                        <button className="btn btn-square btn-ghost ml-auto">
                          <CgAdd size={20} />
                        </button>
                      </motion.div>
                    ))}
                </motion.div>
              </motion.div>
            </motion.main>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Page_Locator;
