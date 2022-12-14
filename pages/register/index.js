import Image from "next/image";
import Link from "next/link";
import { __PageTransition } from "../../lib/animation";
import { motion } from "framer-motion";

const RegistrationLandingPage = () => {
  return (
    <>
      <img
        src="/registrationbg.svg"
        alt="Background"
        className="fixed top-0 left-0 w-full h-full object-cover"
      />
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative min-h-screen w-full flex flex-col justify-center"
      >
        <h1 className="text-3xl font-bold">Welcome to Wicket</h1>

        <p className="text-lg mt-8">
          Please select a type of account to register for.
        </p>

        <div className="flex flex-col gap-2 mt-4 max-w-md">
          <Link
            href="/register/hunter"
            className="btn btn-outline hover:btn-secondary"
          >
            Register as a Hunter
          </Link>
          <Link
            href="/register/provisioner"
            className="btn btn-outline hover:btn-secondary"
          >
            Register as a Company
          </Link>
        </div>
      </motion.main>
    </>
  );
};

export default RegistrationLandingPage;
