import { CgSpinner, CgSpinnerAlt } from 'react-icons/cg';
import { useEffect, useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';
import { _Page_Transition } from '../lib/_animations';
import { motion } from 'framer-motion';
import { useAuth } from '../components/AuthContext';
import { useRouter } from 'next/router';

const Page_Locator = (e) => {
  const [found, setFound] = useState(false);
  const { userData } = useAuth();
  const router = useRouter();

  // randomize the number of results up to 10
  const [results, setResults] = useState(Math.floor(Math.random() * 12) + 1);

  const _search = async (e) => {
    setTimeout(() => {
      setFound(true);
    }, 1000 + results * 500);
  };

  useEffect(() => {
    _search();
  }, []);

  return (
    <>
      {userData && userData.hasId == true && (
        <>
          <motion.div
            animate={{
              opacity: !found ? 1 : 0,
            }}
            className="absolute top-0 left-0 w-full h-full overflow-hidden -z-50"
          >
            {/* scale pulse div */}
            <motion.div
              animate={{
                scale: [0.25, 1.5],
                opacity: [0, 1, 0],
                translateX: ['-50%', '-50%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'circOut',
              }}
              className="absolute w-[400px] h-[400px] bottom-[-200px] left-1/2 rounded-full border-4 border-primary"
            />
            <motion.div
              animate={{
                scale: [0.25, 1.5],
                opacity: [0, 1, 0],
                translateX: ['-50%', '-50%'],
              }}
              transition={{
                duration: 1.5,
                delay: 0.75,
                repeat: Infinity,
                ease: 'circOut',
              }}
              className="absolute w-[400px] h-[400px] bottom-[-200px] left-1/2 rounded-full border-4 border-primary"
            />
          </motion.div>

          <motion.main
            variants={_Page_Transition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center mt-32 pb-32"
          >
            <p className="text-4xl font-thin">Locator</p>

            <AnimatePresence>
              {!found && (
                <motion.div
                  exit={{
                    opacity: 0,
                    y: -50,
                    transition: { duration: 0.5, ease: 'circIn' },
                  }}
                  className="flex flex-col items-center mt-16 relative "
                >
                  <p className="text-2xl font-medium">
                    Searching for people near you ...
                  </p>

                  {/* <CgSpinnerAlt className="animate-spin text-6xl mt-5" /> */}

                  <p className=" font-thin mt-16">
                    This feature is currently in development
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {found && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 50,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      ease: 'circOut',
                      delay: 0.75,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: -50,
                    transition: { duration: 0.5, ease: 'circIn' },
                  }}
                  className="flex flex-col items-center mt-16 w-full"
                >
                  <p className="text-2xl font-medium">
                    Found {results} {results > 1 ? 'people' : 'person'} near you
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full max-w-xl gap-5 gap-y-8 mt-5">
                    {Array(results)
                      .fill()
                      .map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            scale: [0, 1],
                            opacity: [0, 1],
                            transition: {
                              duration: 0.5,
                              ease: 'circOut',
                              delay: 1 + i * 0.1,
                            },
                          }}
                          className="flex flex-col items-center group cursor-pointer hover:bg-base-300 p-5 rounded"
                        >
                          <img
                            src={`https://avatars.dicebear.com/api/micah/${
                              Math.random() * i
                            }something${i}.svg`}
                            alt="profile"
                            className="w-20 h-20 rounded-full bg-white group-hover:scale-110 transition-transform"
                          />
                          <p className="font-medium mt-2 ">John Doe</p>
                          <p className="font-thin">1.2km away</p>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.main>
        </>
      )}

      {!userData ||
        (userData.hasId == false && (
          <>
            <motion.main
              variants={_Page_Transition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center mt-32 pb-32"
            >
              <p className="text-4xl font-thin">Locator</p>
              <div className="flex flex-col items-center gap-5 mt-32">
                <p className="text-warning">
                  You need to upgrade your account to use this feature
                </p>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => router.push('/profile')}
                >
                  Jump to Profile
                </button>
              </div>
            </motion.main>
          </>
        ))}
    </>
  );
};

export default Page_Locator;
