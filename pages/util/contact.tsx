import { AnimatePresence, motion } from "framer-motion";
import {
  FiCheck,
  FiChevronDown,
  FiMail,
  FiMapPin,
  FiPhone,
  FiX,
} from "react-icons/fi";
import { useState } from "react";
import Footer from "@/components/Footer";
import { AnimPageTransition } from "@/lib/animations";


const contact = () => {
  return (
    <>
     

      <motion.div
        variants={AnimPageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex w-full min-h-screen justify-center items-center"
      >
        <div className="flex flex-col space-y-6 w-full max-w-4xl p-8 rounded-xl shadow-lg">
          <div className="flex flex-col space-y-8 justify-between">
            <div>
              <h1 className="font-bold text-4xl tracking-wide">Contact Us</h1>
              <p className="pt-2">
                Do you have inquiries or suggestions? Fill out the form (below)
                and improve Wicket with us today!
              </p>
            </div>

            <div className="flex flex-col space-y-6">
              <div className="inline-flex space-x-2 items-center">
                <FiPhone className="text-base-content text-2xl" />
                <span>+(63) 949 805 2916</span>
              </div>

              <div className="inline-flex space-x-2 items-center">
                <FiMail className="text-base-content text-2xl" />
                <span>wicket.journeys@gmail.com</span>
              </div>

              <div className="inline-flex space-x-2 items-center">
                <FiMapPin className="text-base-content text-2xl" />
                <span>Congressional Rd Ext, Caloocan, Metro Manila</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 lg:bg-base-200 rounded-xl shadow-lg p-8 px-0 lg:px-8">
            <form action="" className="flex flex-col space-y-4">
              <div className="flex flex-col">
                <label className="text-sm  ml-4">Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input input-primary input-bordered"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm  ml-4">Email Address</label>
                <input
                  type="email"
                  placeholder="johndoe@mail.com"
                  className="input input-primary input-bordered"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm  ml-4">Message</label>
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="textarea textarea-primary textarea-bordered"
                />
              </div>

              <button className="btn btn-primary btn-block">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default contact;
