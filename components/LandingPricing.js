import { AnimatePresence, motion } from "framer-motion";
import { FiCheck, FiX } from "react-icons/fi";

import { useState } from "react";

const Pricing = (e) => {
  const [accountType, setAccountType] = useState("hunter");

  return (
    <>
      {/* desktop */}
      <main className="min-h-[50vh] hidden lg:block">
        <h2 className="text-center font-bold text-3xl">
          Find the right plan for you
        </h2>
        <p className="text-center">
          Subscribe to our plans and get access to all our features.
        </p>

        {/* picker */}
        <div className="w-full relative max-w-xl gap-4 grid grid-cols-2 p-2 rounded-full mx-auto mt-10">
          {/* animated slider */}
          <motion.div
            animate={{
              x: accountType === "hunter" ? 0 : "100%"
            }}
            transition={{ duration: 0.5, ease: [0.87, 0.29, 0.13, 0.8] }}
            className="absolute w-1/2 h-full bg-base-300 rounded-full"
          />
          {/* buttons */}
          <button
            onClick={() => setAccountType("hunter")}
            className="rounded-full z-10"
          >
            Hunters
          </button>
          <button
            onClick={() => setAccountType("provisioner")}
            className="rounded-full z-10"
          >
            Provisioners
          </button>
        </div>

        <>
          {/* grid container */}
          <div className="flex flex-col mt-10">
            {/* header */}
            <div className="grid grid-cols-5 gap-2 mb-10 ">
              <div className="col-span-2" />
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-center font-bold text-2xl">Junior</h3>
                <div className="flex items-center justify-center mt-4">
                  <p className="text-2xl font-bold">₱</p>
                  <p className="text-5xl font-bold">0</p>
                </div>
                <p className="text-center">/month</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-center font-bold text-2xl">Senior</h3>
                <div className="flex items-center justify-center mt-4">
                  <p className="text-2xl font-bold">₱</p>
                  <p className="text-5xl font-bold">148</p>
                </div>
                <p className="text-center">/month</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-center font-bold text-2xl">Expert</h3>
                <div className="flex items-center justify-center mt-4">
                  <p className="text-2xl font-bold">₱</p>
                  <p className="text-5xl font-bold">198</p>
                </div>
                <p className="text-center">/month</p>
              </div>
            </div>

            <AnimatePresence mode="sync">
              {accountType === "hunter" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* blog feed */}
                  <>
                    <div className="grid grid-cols-5 gap-2 mb-1">
                      <p className="col-span-2 text-lg text-center font-bold">
                        Blog Feed
                      </p>
                    </div>
                    <div className="grid grid-cols-5 gap-2 w-full hover:bg-base-300 rounded-full hover:py-2 transition-all">
                      <p className="col-span-2 text-center w-full">Blog Post</p>
                      <p className=" text-center w-full">5 posts/day</p>
                      <p className=" text-center w-full">15 posts/day</p>
                      <p className=" text-center w-full">Unlimited</p>
                    </div>
                    <div className="grid grid-cols-5 gap-2 w-full hover:bg-base-300 rounded-full hover:py-2 transition-all">
                      <p className="col-span-2 text-center w-full">
                        Image Attachments on Posts
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiX className="text-red-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                    </div>
                    <div className="grid grid-cols-5 gap-2 w-full hover:bg-base-300 rounded-full hover:py-2 transition-all">
                      <p className="col-span-2 text-center w-full">
                        Advertisement Cards
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiX className="text-red-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiX className="text-red-500" />
                      </p>
                    </div>
                    <div className="grid grid-cols-5 gap-2 w-full hover:bg-base-300 rounded-full hover:py-2 transition-all">
                      <p className="col-span-2 text-center w-full">
                        Hunter Suggestion
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                    </div>
                  </>

                  {/* finder */}
                  <>
                    <div className="grid grid-cols-5 gap-2 mt-5 mb-1">
                      <p className="col-span-2 text-lg text-center font-bold">
                        Finder
                      </p>
                    </div>

                    <div className="grid grid-cols-5 gap-2 w-full hover:bg-base-300 rounded-full hover:py-2 transition-all">
                      <p className="col-span-2 text-center w-full">
                        Finder Proximity
                      </p>
                      <p className=" text-center w-full">50m</p>
                      <p className=" text-center w-full">1.2km</p>
                      <p className=" text-center w-full">1.8km</p>
                    </div>

                    <div className="grid grid-cols-5 gap-2 w-full hover:bg-base-300 rounded-full hover:py-2 transition-all">
                      <p className="col-span-2 text-center w-full">
                        Job Prioritization
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiX className="text-red-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                    </div>
                  </>

                  {/* Metaverse */}
                  <>
                    <div className="grid grid-cols-5 gap-2 mt-5 mb-1">
                      <p className="col-span-2 text-lg text-center font-bold">
                        Metaverse
                      </p>
                    </div>

                    <div className="grid grid-cols-5 gap-2 w-full hover:bg-base-300 rounded-full hover:py-2 transition-all">
                      <p className="col-span-2 text-center w-full">
                        Metaverse Access
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiX className="text-red-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                    </div>

                    <div className="grid grid-cols-5 gap-2 w-full hover:bg-base-300 rounded-full hover:py-2 transition-all">
                      <p className="col-span-2 text-center w-full">
                        Voice Chatting
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiX className="text-red-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiX className="text-red-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                    </div>

                    <div className="grid grid-cols-5 gap-2 w-full hover:bg-base-300 rounded-full hover:py-2 transition-all">
                      <p className="col-span-2 text-center w-full">
                        Avatar Customization
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiX className="text-red-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                    </div>
                  </>

                  {/* Wicket Profile */}
                  <>
                    <div className="grid grid-cols-5 gap-2 mt-5 mb-1">
                      <p className="col-span-2 text-lg text-center font-bold">
                        Wicket Profile
                      </p>
                    </div>

                    <div className="grid grid-cols-5 gap-2 w-full hover:bg-base-300 rounded-full hover:py-2 transition-all">
                      <p className="col-span-2 text-center w-full">
                        Profile Customization
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        Basic
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        Limited
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        Customized
                      </p>
                    </div>

                    <div className="grid grid-cols-5 gap-2 w-full hover:bg-base-300 rounded-full hover:py-2 transition-all">
                      <p className="col-span-2 text-center w-full">
                        Storage Limit
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        100mb
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        250mb
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        500mb
                      </p>
                    </div>

                    <div className="grid grid-cols-5 gap-2 w-full hover:bg-base-300 rounded-full hover:py-2 transition-all">
                      <p className="col-span-2 text-center w-full">
                        Profile Bio Template Options
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        Basic
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        Junior + 5
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        Unlimited
                      </p>
                    </div>

                    <div className="grid grid-cols-5 gap-2 w-full hover:bg-base-300 rounded-full hover:py-2 transition-all">
                      <p className="col-span-2 text-center w-full">
                        Job Application Prioritization
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiX className="text-red-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                    </div>
                  </>

                  {/* Job Seeking */}
                  <>
                    <div className="grid grid-cols-5 gap-2 mt-5 mb-1">
                      <p className="col-span-2 text-lg text-center font-bold">
                        Job Seeking
                      </p>
                    </div>

                    <div className="grid grid-cols-5 gap-2 w-full hover:bg-base-300 rounded-full hover:py-2 transition-all">
                      <p className="col-span-2 text-center w-full">
                        Prioritization by Career Tagging
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiX className="text-red-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                    </div>

                    <div className="grid grid-cols-5 gap-2 w-full hover:bg-base-300 rounded-full hover:py-2 transition-all">
                      <p className="col-span-2 text-center w-full">
                        Prioritization by Proximity
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiX className="text-red-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                    </div>
                  </>

                  {/* Communication */}
                  <div>
                    <div className="grid grid-cols-5 gap-2 mt-5 mb-1">
                      <p className="col-span-2 text-lg text-center font-bold">
                        Communication
                      </p>
                    </div>

                    <div className="grid grid-cols-5 gap-2 w-full hover:bg-base-300 rounded-full hover:py-2 transition-all">
                      <p className="col-span-2 text-center w-full">
                        Audio Call
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                    </div>

                    <div className="grid grid-cols-5 gap-2 w-full hover:bg-base-300 rounded-full hover:py-2 transition-all">
                      <p className="col-span-2 text-center w-full">
                        Text-based Messaging
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                    </div>

                    <div className="grid grid-cols-5 gap-2 w-full hover:bg-base-300 rounded-full hover:py-2 transition-all">
                      <p className="col-span-2 text-center w-full">
                        Image Attachments
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiX className="text-red-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                      <p className="flex justify-center items-center text-center w-full">
                        <FiCheck className="text-green-500" />
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      </main>
    </>
  );
};

export default Pricing;
