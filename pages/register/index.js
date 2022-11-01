import Hunter_SignUp_Page1 from "./hunter/page1";
import Provisioner_SignUp_Page1 from "./provisioner/page1";
import { __PageTransition } from "../../lib/animtions";
import { motion } from "framer-motion";
import { useState } from "react";

const RegisterPage = () => {
  const [type, setType] = useState("");
  const [page, setPage] = useState(0);

  return (
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
              <div
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
              </div>
              <div
                onClick={() => setType("provisioner")}
                className="group cursor-pointer relative flex flex-col justify-center items-center w-full p-10"
              >
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80"
                  className="absolute top-0 left-0 w-full h-full object-cover -z-10 opacity-5 group-hover:opacity-25 transition-all duration-300"
                />
                <h1 className="text-4xl font-bold ">Provisioners</h1>
                <p className=" text-center">
                  A Provisioner is a group or company that is looking for a
                  person to fill a job. They can be freelance company, a
                  contractor, or a full-time employer.
                </p>
                {type === "provisioner" && (
                  <button
                    onClick={() => setPage(1)}
                    className="btn btn-primary mt-5"
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {page === 1 && type === "hunter" && (
          <Hunter_SignUp_Page1 setPage={setPage} />
        )}
        {page === 1 && type === "provisioner" && (
          <Provisioner_SignUp_Page1 setPage={setPage} />
        )}
      </motion.main>

      {/* modal goes here */}
    </>
  );
};

export default RegisterPage;
