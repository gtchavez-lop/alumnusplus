import { __PageTransition } from "../../../lib/animation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const ConfirmationResetPage = () => {
  const __supabase = useSupabaseClient();
  const { asPath } = useRouter();

  useEffect(() => {
    const token = asPath.split("#")[1];
    console.log(token);
  }, [asPath]);

  return (
    <motion.main
      variants={__PageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen w-full flex flex-col gap-10 pt-24 pb-36"
    ></motion.main>
  );
};

export default ConfirmationResetPage;
