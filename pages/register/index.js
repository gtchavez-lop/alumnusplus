import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { FiLock } from "react-icons/fi";
import Hunter_SignUp_Page1 from "./hunter/page1";
import Link from "next/link";
import Provisioner_SignUp_Page1 from "./provisioner/page1";
import { __PageTransition } from "../../lib/animtions";
import __supabase from "../../lib/supabase";

const RegisterPage = () => {
  const [type, setType] = useState("");
  const [page, setPage] = useState(0);
  const [hasUser, setHasUser] = useState(false);

  const detectUser = async (e) => {
    const user = await __supabase.auth.user();

    if (user) {
      setHasUser(true);
    }
  };

  useEffect(() => {
    detectUser();
  }, []);

  return !hasUser ? (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative flex flex-col w-full py-16"
      >
        {page === 0 && (
          <>
            <div className="flex flex-col items-center justify-center w-full z-10">
              <h1 className="text-4xl font-bold text-center">
                Welcome to the <span className="text-primary">Hunt</span>!
              </h1>
              <p className="text-center">
                Please select the type of account you would like to create.
              </p>
            </div>

            {/* fullscreen type selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 h-[75vh] w-full fixed bottom-0 left-0">
              <motion.div
                layout
                onClick={() => setType("hunter")}
                className="group cursor-pointer relative flex flex-col justify-center items-center w-full p-10"
              >
                <img
                  src="https://images.unsplash.com/photo-1613909207039-6b173b755cc1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80"
                  className="absolute top-0 left-0 w-full h-full object-cover -z-10 opacity-5 group-hover:opacity-25 transition-all duration-300"
                />
                <h1 className="text-4xl font-bold ">Hunters</h1>
                <p className=" text-center">
                  A Hunter is a person who is looking for a job. They can be
                  freelancers, contractors, or full-time employees.
                </p>
                {type === "hunter" && (
                  <button
                    onClick={() => setPage(1)}
                    className="btn btn-primary mt-5"
                  >
                    Continue
                  </button>
                )}
              </motion.div>
              <div
                onClick={() => setType("provisioner")}
                className="group cursor-pointer relative flex flex-col justify-center items-center w-full p-10"
              >
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80"
                  className="absolute top-0 left-0 w-full h-full object-cover -z-10 opacity-5 group-hover:opacity-25 transition-all duration-300"
                />
                <h1 className="text-4xl font-bold flex gap-2">
                  Provisioners <FiLock />
                </h1>
                <p className=" text-center">
                  A Provisioner is a group or company that is looking for a
                  person to fill a job. They can be freelance company, a
                  contractor, or a full-time employer.
                </p>
                {type === "provisioner" && (
                  <div
                    className="tooltip tooltip-bottom"
                    data-tip="Not yet available"
                  >
                    <button
                      onClick={() => setPage(1)}
                      className="btn btn-primary mt-5"
                      disabled
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <AnimatePresence>
          <>
            {page === 1 && type === "hunter" && (
              <Hunter_SignUp_Page1 setPage={setPage} />
            )}
            {page === 1 && type === "provisioner" && (
              <Provisioner_SignUp_Page1 setPage={setPage} />
            )}
          </>
        </AnimatePresence>
      </motion.main>

      {/* modal goes here */}
    </>
  ) : (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative flex flex-col w-full py-16 pt-28"
      >
        {/* say that the user is already signed in */}
        <div className="flex flex-col justify-center items-center w-full h-full bg-white bg-opacity-50">
          <FiLock className="text-4xl" />
          <h1 className="text-xl font-bold">You are already signed in</h1>

          {/* redirect to /feed */}
          <Link href="/feed" className="btn btn-primary mt-4">
            Go to Feed
          </Link>
        </div>
      </motion.main>
    </>
  );
};

export default RegisterPage;
