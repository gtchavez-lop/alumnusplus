import { useEffect, useState } from "react";
import { useSession, useUser } from "@supabase/auth-helpers-react";

import Link from "next/link";
import ProtectedPageContainer from "@/components/ProtectedPageContainer";
import { __PageTransition } from "../lib/animation";
import { __supabase } from "../supabase";
import { globalUserState } from "@/lib/stores";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAtom } from "jotai";
import { useRouter } from "next/router";

const LogInPage = (e) => {
  const router = useRouter();
  const thisUser = useUser();
  const [globalUser, setGlobalUser] = useAtom(globalUserState);

  const signInAccount = async (e) => {
    e.preventDefault();
    const email = e.target.user_email.value;
    const password = e.target.user_password.value;
    toast.loading("Signing in...");

    const {
      data: { user },
      error,
    } = await __supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      toast.dismiss();
      toast.error(error.message);
      return;
    }

    // set global user
    setGlobalUser(user);

    // check if user is hunter
    if (user && user.user_metadata?.type === "hunter") {
      toast.dismiss();
      toast.success("Signed in!");
      router.push("/h/feed");
    }

    // check if user is provisioner
    if (user && user.user_metadata?.type === "provisioner") {
      toast.dismiss();
      toast.success("Signed in!");
      router.push("/p/dashboard");
    }
  };

  const checkUser = async () => {
    if (!!thisUser) {
      if (thisUser.user_metadata?.type === "hunter") {
        router.push("/h/feed");
      }
      if (thisUser.user_metadata?.type === "provisioner") {
        router.push("/p/dashboard");
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col py-28 relative justify-center min-h-screen"
      >
        <img
          src="./loginbg.svg"
          className="min-w-[1360px] h-[696px] fixed top-0 right-0 opacity-30 lg:opacity-50"
        />
        <div className="absolute right-0 top-0 h-screen w-full lg:w-1/2 hidden lg:flex items-center justify-end">
          <img src="./login.svg" className="w-96" />
        </div>

        <>
          <p className="text-2xl lg:text-3xl z-10">Sign in to your account</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signInAccount(e);
            }}
            className="form-control gap-2 mt-8 max-w-md z-10"
          >
            <span>Email</span>
            <input
              placeholder="Your email address"
              type="email"
              name="user_email"
              className="input input-primary input-bordered"
              required
            />
            <span>Password</span>
            <input
              placeholder="Your password"
              type="password"
              name="user_password"
              className="input input-primary input-bordered"
              required
            />

            <button type="submit" className="btn btn-primary mt-5">
              Log in
            </button>
            <p className="">
              Don&apos;t have an account?{" "}
              <Link href={"/register"} className="text-primary cursor-pointer">
                Sign up
              </Link>
            </p>
            <p>
              Forgot your password?{" "}
              <Link
                href={"/util/recovery"}
                className="text-primary cursor-pointer"
              >
                Reset password
              </Link>
            </p>
          </form>
        </>
      </motion.main>
    </>
  );
};

export default LogInPage;
