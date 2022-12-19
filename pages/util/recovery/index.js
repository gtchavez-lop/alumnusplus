import { __PageTransition } from "../../../lib/animation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const RecoveryPage = () => {
  const __supabase = useSupabaseClient();
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    toast.loading("Processing Request...");

    const { error } = await __supabase.auth.resetPasswordForEmail(
      e.target.email.value,
      {
        redirectTo: `${router.basePath}/util/recovery/confirm`,
      }
    );

    if (error) {
      toast.dismiss();
      toast.error(error.message);
      return;
    }

    toast.dismiss();
    toast.success("Email sent! Please check your inbox.");
  };

  return (
    <motion.main
      variants={__PageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen w-full flex flex-col gap-10 pt-24 pb-36"
    >
      <h1 className="text-center text-3xl">
        It&apos;s okay, we&apos;ve all been there
      </h1>

      <form onSubmit={handleResetPassword} className="w-full max-w-md mx-auto">
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Enter your email here</label>
          <input
            type="email"
            name="email"
            id="email"
            className="input input-primary"
            required
          />
        </div>

        <button className="btn btn-primary mt-10 w-full max-w-md">
          Send recovery email
        </button>
      </form>
    </motion.main>
  );
};

export default RecoveryPage;
