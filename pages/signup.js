import { useEffect, useState } from "react";

import Link from "next/link";
import { __PageTransition } from "../lib/animtions";
import __supabase from "../lib/supabase";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const PageSignUp = (e) => {
  const router = useRouter();

  const [hasUser, setHasUser] = useState(false);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("supabase.auth.token");
    if (token) {
      router.push("/feed");
    }
  }, []);

  const registerAccount = async (e) => {
    e.preventDefault();

    const email = e.target.user_email.value;
    const password = e.target.user_password.value;
    const username = e.target.username.value;
    const first_name = e.target.first_name.value;
    const last_name = e.target.last_name.value;
    const birthdate = e.target.birthdate.value;
    const residingCity = e.target.city.value;

    toast.loading("Signing up...");

    __supabase.auth
      .signUp(
        {
          email,
          password,
        },
        {
          data: {
            username,
            first_name,
            last_name,
            birthdate,
            residingCity,
            connections: [],
          },
        }
      )
      .then((data) => {
        if (data.error) {
          toast.dismiss();
          toast.error(data.error.message);
        } else {
          toast.dismiss();
          toast.success("Signed up!");
          toast("Please check your email for a confirmation link.");
          router.push("/signin");
        }
      });
  };

  let cities = [
    { name: "Caloocan", province: "MM", city: true },
    { name: "Las Piñas", province: "MM", city: true },
    { name: "Makati", province: "MM", city: true },
    { name: "Malabon", province: "MM", city: true },
    { name: "Mandaluyong", province: "MM", city: true },
    { name: "Manila", province: "MM", city: true },
    { name: "Marikina", province: "MM", city: true },
    { name: "Muntinlupa", province: "MM", city: true },
    { name: "Navotas", province: "MM", city: true },
    { name: "Parañaque", province: "MM", city: true },
    { name: "Pasay", province: "MM", city: true },
    { name: "Pasig", province: "MM", city: true },
    { name: "Pateros", province: "MM" },
    { name: "Quezon", province: "MM", city: true },
    { name: "San Juan", province: "MM", city: true },
    { name: "Taguig", province: "MM", city: true },
    { name: "Valenzuela", province: "MM", city: true },
  ];

  return (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col w-full py-28"
      >
        <p className="text-3xl text-center">Register a new account</p>

        {/* present 2 choices if user or company */}
        {userType === "" && (
          <div className="flex flex-col items-center mt-10">
            <p className="text-xl text-center">
              Do you want to register a personal account or a company account?
            </p>
            <div className="flex flex-col lg:flex-row gap-5 items-center lg:justify-center mt-5 w-full">
              <button
                onClick={() => {
                  setUserType("user");
                }}
                className="btn btn-primary w-full lg:w-[300px]"
              >
                Personal
              </button>
              <div
                className="tooltip tooltip-bottom tooltip-info"
                data-tip="Not Availble yet"
              >
                <button
                  disabled
                  // onClick={() => {
                  //   setUserType("company");
                  // }}
                  className="btn btn-primary w-full lg:w-[300px]"
                >
                  Company
                </button>
              </div>
            </div>
          </div>
        )}

        {!hasUser && userType == "user" && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="form-control mt-16 w-full max-w-md flex flex-col self-center"
            onSubmit={(e) => registerAccount(e)}
          >
            <div className="grid grid-cols-1 gap-2 mb-10">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <label className="flex flex-col col-span-1">
                <span className="ml-4">Your first name</span>
                <input
                  type="text"
                  placeholder="John"
                  name="first_name"
                  className="input input-primary input-bordered"
                />
              </label>
              <label className="flex flex-col col-span-1">
                <span className="ml-4">Your last name</span>
                <input
                  type="text"
                  placeholder="Doe"
                  name="last_name"
                  className="input input-primary input-bordered"
                />
              </label>
              <label className="flex flex-col col-span-full">
                <span className="ml-4">Your username</span>
                <input
                  type="text"
                  placeholder="@johndoe1234"
                  name="username"
                  className="input input-primary input-bordered"
                />
                <span className="text-xs opacity-25 ml-4">
                  We will add @ before your username
                </span>
              </label>
              <label className="flex flex-col col-span-full">
                <span className="ml-4">Your birthday</span>
                <input
                  type="date"
                  name="birthdate"
                  min={
                    new Date(
                      new Date().getFullYear() - 60,
                      new Date().getMonth(),
                      new Date().getDate()
                    )
                      .toISOString()
                      .split("T")[0]
                  }
                  max={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 18)
                    )
                      .toISOString()
                      .split("T")[0]
                  }
                  className="input input-primary input-bordered"
                />
              </label>
              <label className="flex flex-col col-span-full">
                <span className="ml-4">Residing City</span>
                <select
                  name="city"
                  defaultValue={cities[0].name}
                  className="select select-primary select-bordered"
                >
                  {cities.map((city, i) => (
                    <option key={i} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* submit button */}
            <button className="btn btn-primary mt-10">
              Register your account
            </button>

            {/* already had an account */}
            <Link href={"/signin"} legacyBehavior>
              <p className="text-center mt-5">
                Already have an account?{" "}
                <span className="text-primary cursor-pointer">Login</span>
              </p>
            </Link>
          </motion.form>
        )}

        {!hasUser && userType == "company" && (
          <form
            aria-disabled="true"
            className="form-control mt-16 w-full max-w-md flex flex-col self-center"
            // onSubmit={(e) => registerAccount(e)}
          >
            <div className="grid grid-cols-1 gap-2 mb-10">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <label className="flex flex-col col-span-1">
                <span className="ml-4">Company Name</span>
                <input
                  type="text"
                  placeholder="Company Name"
                  name="company_name"
                  className="input input-primary input-bordered"
                />
              </label>
              <label className="flex flex-col col-span-1">
                <span className="ml-4">Company Username</span>
                <input
                  type="text"
                  placeholder="@companyname"
                  name="company_username"
                  className="input input-primary input-bordered"
                />
                <span className="text-xs opacity-25 ml-4">
                  We will add @ before your username
                </span>
              </label>
              <label className="flex flex-col col-span-full">
                <span className="ml-4">Company Description</span>
                <textarea
                  name="company_description"
                  className="input textarea textarea-primary textarea-bordered h-32"
                  placeholder="What is your company about?"
                ></textarea>
              </label>
              <label className="flex flex-col col-span-full">
                <span className="ml-4">Company Address</span>
                <textarea
                  name="company_address"
                  className="input textarea textarea-primary textarea-bordered h-32"
                  placeholder="Where is your company located?"
                ></textarea>
              </label>
              <label className="flex flex-col col-span-full">
                <span className="ml-4">Company City</span>
                <select
                  name="city"
                  defaultValue={cities[0].name}
                  className="select select-primary select-bordered"
                >
                  {cities.map((city, i) => (
                    <option key={i} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* submit button */}
            <button disabled className="btn btn-primary mt-10">
              Register your account
            </button>

            {/* already had an account */}
            <Link href={"/signin"} legacyBehavior>
              <p className="text-center mt-5">
                Already have an account?{" "}
                <span className="text-primary cursor-pointer">Login</span>
              </p>
            </Link>
          </form>
        )}

        {hasUser && (
          <div className="flex flex-col items-center mt-28">
            <p className="text-2xl">You are already signed in</p>
            <Link href={"/feed"} legacyBehavior>
              <button className="btn btn-primary mt-10">Go back to feed</button>
            </Link>
          </div>
        )}
      </motion.main>
    </>
  );
};

export default PageSignUp;
