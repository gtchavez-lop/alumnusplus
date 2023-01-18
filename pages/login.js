import { useEffect, useState } from "react";

import Link from "next/link";
import { __PageTransition } from "../lib/animation";
import { __supabase } from "../supabase";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useLocalStorage from "../lib/localStorageHook";
import { useRouter } from "next/router";

const LogInPage = (e) => {
  const [hasUser, setHasUser] = useState(false);
  const router = useRouter();
  const [authState, setAuthState] = useLocalStorage("authState");

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
      id: authState.id,
      username: authState.user_metadata.username,
      gender: authState.user_metadata.gender,
      email: authState.email,
      phone: authState.user_metadata.phone || null,
      birthdate: authState.user_metadata.birthdate,
      connections: authState.user_metadata.connections || [],
      address: authState.user_metadata.address,
      birthplace: authState.user_metadata.birthplace,
      bio: authState.user_metadata.bio,
      education: authState.user_metadata.education || null,
      fullName: authState.user_metadata.fullName,
      skillPrimary: authState.user_metadata.skillPrimary,
      skillSecondary: authState.user_metadata.skillSecondary,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.dismiss();

    toast.success("Signed in!");
  };

  const writeProvData = async () => {
    const { data, error } = await __supabase.from("user_provisioners").insert({
      address: authState.user_metadata.address,
      alternativeNames: authState.user_metadata.alternativeNames,
      companySize: authState.user_metadata.companySize,
      companyType: authState.user_metadata.companyType,
      contactInformation: authState.user_metadata.contactInformation,
      foundingYear: authState.user_metadata.foundingYear,
      fullDescription: authState.user_metadata.fullDescription,
      id: authState.id,
      industryType: authState.user_metadata.industryType,
      jobPostings: [],
      legalName: authState.user_metadata.legalName,
      shortDescription: authState.user_metadata.shortDescription,
      socialProfiles: authState.user_metadata.socialProfiles,
      tags: [],
      type: authState.user_metadata.type,
      website: authState.user_metadata.website,
      companyEmail: authState.email,
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

    // __supabase.auth
    //   .signInWithPassword({
    //     email: email,
    //     password: password,
    //   })
    //   .then(({ data: { user }, error }) => {
    //     if (error) {
    //       toast.dismiss();
    //       toast.error(error.message);
    //       return;
    //     }

    //     // check if user is hunter
    //     if (user && user.user_metadata?.type === "hunter") {
    //       checkHunterData().then((e) => {
    //         if (e === false) {
    //           writeHunterData();
    //         } else {
    //           setAuthState(user);
    //           toast.dismiss();
    //           toast.success("Signed in!");
    //           router.push("/h/feed");
    //         }
    //       });
    //     }

    //     // check if user is provisioner
    //     if (user && user.user_metadata?.type === "provisioner") {
    //       checkProvData().then((e) => {
    //         if (e === false) {
    //           writeProvData();
    //         } else {
    //           setAuthState(user);
    //           toast.dismiss();
    //           toast.success("Signed in!");
    //           router.push("/p/dashboard");
    //         }
    //       });
    //     }
    //   });

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
          setAuthState(user);
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
        } else {
          setAuthState(user);
          toast.dismiss();
          toast.success("Signed in!");
          router.push("/p/dashboard");
        }
      });
    }
  };

  const checkIfHasUser = async () => {
    if (authState) {
      if (authState.user_metadata.type === "hunter") {
        router.push("/h/feed");
      } else if (authState.user_metadata.type === "provisioner") {
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
