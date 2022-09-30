import { useEffect, useState } from "react";

import { FiLoader } from "react-icons/fi";
import Link from "next/link";
import { _PageTransition } from "../lib/animations";
import __supabase from "../lib/auth";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useUser } from "../components/UserContext";

const handleLogIn = (e) => {
  e.preventDefault();

  // check if empty
  if (e.target.user_email.value === "" || e.target.user_password.value === "") {
    toast.error("Please fill in all fields");
    return;
  }

  toast.loading("Logging in...");

  __supabase.auth
    .signIn({
      email: e.target.user_email.value,
      password: e.target.user_password.value,
    })
    .then((res) => {
      toast.dismiss();
      if (res.error) {
        toast.error(res.error.message);
      } else {
        toast.success("Successfully logged in!");
      }
    });
};

const LoginPage = () => {
  const router = useRouter();
  const { $user } = useUser();
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    setHasUser($user ? true : false);
  }, [$user]);

  useEffect(() => {
    const session = window.localStorage.getItem("supabase.auth.token")
      ? JSON.parse(window.localStorage.getItem("supabase.auth.token"))
      : null;

    if (session) {
      setHasUser(true);
      setTimeout(() => {
        router.push("/feed");
      }, 1000);
    }
  }, []);

  return (
    <motion.div
      variants={_PageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-center"
    >
      {!hasUser ? (
        <>
          <h1 className="text-3xl mt-16">Login to your Alumnus Plus Account</h1>

          <form
            className="form-control w-full max-w-md mt-16"
            onSubmit={(e) => handleLogIn(e)}
          >
            <div className="flex flex-col">
              <span>Email Address</span>
              <input
                type="email"
                className="input input-bordered"
                placeholder="juandelacruz@email.com"
                name="user_email"
              />
            </div>
            <div className="flex flex-col mt-3">
              <span>Password</span>
              <input
                type="password"
                className="input input-bordered"
                placeholder="**********"
                name="user_password"
              />
            </div>

            <div className="flex flex-col mt-10">
              <button className="btn btn-primary">Login</button>

              <div className="flex flex-row justify-center mt-4">
                <span>Don&apos;t have an account?</span>
                <Link href="/register">
                  <p className="link ml-2">Register here</p>
                </Link>
              </div>
            </div>
          </form>
        </>
      ) : (
        <>
          <p className="text-3xl mt-16">Account Detected</p>
          <p className="text-lg">Redirecting to your feed</p>

          <div className="flex flex-col items-center mt-16">
            <div className="animate-spin">
              <FiLoader className="text-5xl" />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default LoginPage;
