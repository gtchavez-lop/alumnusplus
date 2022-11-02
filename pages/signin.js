import { useEffect, useState } from "react";

import Link from "next/link";
import { __PageTransition } from "../lib/animtions";
import __supabase from "../lib/supabase";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const SignInPage = (e) => {
  const [hasUser, setHasUser] = useState(false);
  const router = useRouter();

  const writeUserMetaData = () => {
    const metaData = __supabase.auth.user().user_metadata;

    __supabase
      .from("user_hunters")
      .upsert({
        id: __supabase.auth.user().id,
        firstName: metaData.firstName,
        lastName: metaData.lastName,
        middleName: metaData.middleName,
        gender: metaData.gender,
        email: __supabase.auth.user().email,
        username: metaData.username,
        birthdate: metaData.birthdate,
        "address.address": metaData.address,
        "address.city": metaData.city,
        "address.postalCode": metaData.postalCode,
        university: metaData.university,
        connections: metaData.connections,
      })
      .then(({ error }) => {
        if (error) {
          toast.error(error.message);
          return;
        } else {
          toast.dismiss();
          toast.success("Signed in!");
          router.push("/feed");
        }
      });
  };

  const signInAccount = async (e) => {
    e.preventDefault();

    const email = e.target.user_email.value;
    const password = e.target.user_password.value;

    toast.loading("Signing in...");

    __supabase.auth.signIn({ email, password }).then((data) => {
      if (data.error) {
        toast.dismiss();
        if (data.error.message === "Email not confirmed") {
          toast.error("Please check your email for a confirmation link.");
        } else {
          toast.error(data.error.message);
        }
      } else {
        writeUserMetaData();
      }
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("supabase.auth.token");
    if (token) {
      setHasUser(true);
    }
  }, []);

  return (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-center py-28"
      >
        <p className="text-3xl">Sign in to your account</p>

        {!hasUser && (
          <form
            className="form-control mt-28 w-full max-w-md gap-3"
            onSubmit={(e) => signInAccount(e)}
          >
            <label className="flex flex-col">
              <span className="ml-4">Your email address</span>
              <input
                type="email"
                placeholder="Email"
                name="user_email"
                className="input input-primary input-bordered"
              />
            </label>
            <label className="flex flex-col">
              <span className="ml-4">Password</span>
              <input
                type="password"
                placeholder="**********"
                name="user_password"
                className="input input-primary input-bordered"
              />
            </label>

            {/* submit button */}
            <button className="btn btn-primary mt-10">Sign in</button>

            {/* dont have account? */}
            <p className="text-center mt-5">
              Don&apos;t have an account?{" "}
              <Link href={"/signup"} legacyBehavior>
                <span className="text-primary cursor-pointer">Sign up</span>
              </Link>
            </p>
          </form>
        )}

        {hasUser && (
          <div className="flex flex-col items-center mt-28">
            <p className="text-3xl">You are signed in</p>
            <Link href={"/feed"} legacyBehavior>
              <button className="btn btn-primary mt-10">Go to feed</button>
            </Link>
          </div>
        )}
      </motion.main>
    </>
  );
};

export default SignInPage;
