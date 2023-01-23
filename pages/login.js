import { useEffect, useState } from "react";
import { useSession, useUser } from "@supabase/auth-helpers-react";

import Link from "next/link";
import { __PageTransition } from "../lib/animation";
import { __supabase } from "../supabase";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const LogInPage = (e) => {
  const [hasUser, setHasUser] = useState(false);
  const router = useRouter();
  const thisSession = useSession();

  const checkHunterData = async ({ targetID }) => {
    const { data, error } = await __supabase
      .from("user_hunters")
      .select("id")
      .single()
      .eq("id", targetID);

    if (data) {
      return true;
    }
    return false;
  };

  const checkProvData = async ({ targetID }) => {
    const { data, error } = await __supabase
      .from("user_provisioners")
      .select("id")
      .single()
      .eq("id", targetID);
    if (data) {
      return true;
    }
    return false;
  };

  const writeHunterData = async () => {
    const { error } = await __supabase.from("user_hunters").insert({
      id: thisSession.user.id,
      username: thisSession.user.user_metadata.username,
      gender: thisSession.user.user_metadata.gender,
      email: thisSession.user.email,
      phone: thisSession.user.user_metadata.phone || null,
      birthdate: thisSession.user.user_metadata.birthdate,
      connections: thisSession.user.user_metadata.connections || [],
      address: thisSession.user.user_metadata.address,
      birthplace: thisSession.user.user_metadata.birthplace,
      bio: thisSession.user.user_metadata.bio,
      education: thisSession.user.user_metadata.education || null,
      fullName: thisSession.user.user_metadata.fullName,
      skillPrimary: thisSession.user.user_metadata.skillPrimary,
      skillSecondary: thisSession.user.user_metadata.skillSecondary,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.dismiss();
    toast.success("Signed in!");
  };

  const writeProvData = async () => {
    const { error } = await __supabase.from("user_provisioners").insert({
      address: thisSession.user.user_metadata.address,
      alternativeNames: thisSession.user.user_metadata.alternativeNames,
      companySize: thisSession.user.user_metadata.companySize,
      companyType: thisSession.user.user_metadata.companyType,
      contactInformation: thisSession.user.user_metadata.contactInformation,
      foundingYear: thisSession.user.user_metadata.foundingYear,
      fullDescription: thisSession.user.user_metadata.fullDescription,
      id: thisSession.user.id,
      industryType: thisSession.user.user_metadata.industryType,
      jobPostings: [],
      legalName: thisSession.user.user_metadata.legalName,
      shortDescription: thisSession.user.user_metadata.shortDescription,
      socialProfiles: thisSession.user.user_metadata.socialProfiles,
      tags: [],
      type: thisSession.user.user_metadata.type,
      website: thisSession.user.user_metadata.website,
      companyEmail: thisSession.user.email,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.dismiss();
    router.push("/p/feed");
  };

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

    // check if user is hunter
    if (user && user.user_metadata?.type === "hunter") {
      checkHunterData({ targetID: user.id }).then((e) => {
        if (e === false) {
          writeHunterData();
        } else {
          toast.dismiss();
          toast.success("Signed in!");
          router.push("/h/feed");
        }
      });
    }

    // check if user is provisioner
    if (user && user.user_metadata?.type === "provisioner") {
      checkProvData({ targetID: user.id }).then((e) => {
        if (e === false) {
          writeProvData();
          writeToMetadata();
        } else {
          toast.dismiss();
          toast.success("Signed in!");
          router.push("/p/dashboard");
        }
      });
    }
  };

  const checkIfHasUser = async () => {
    if (!!thisSession) {
      if (thisSession.user.user_metadata.type === "hunter") {
        router.push("/h/feed");
      } else if (thisSession.user.user_metadata.type === "provisioner") {
        router.push("/p/dashboard");
      }
    }
  };

  useEffect(() => {
    checkIfHasUser();
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

        {!hasUser && (
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
                <Link
                  href={"/register"}
                  className="text-primary cursor-pointer"
                >
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
        )}
      </motion.main>
    </>
  );
};

export default LogInPage;
