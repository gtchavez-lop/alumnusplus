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

  useEffect(() => {
    if (__supabase.auth.user()) {
      setHasUser(true);
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
        className="flex flex-col items-center"
      >
        <p className="text-3xl mt-10">Register a new account</p>

        {!hasUser && (
          <form
            className="form-control mt-16 w-full max-w-md flex flex-col"
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
            <Link href={"/signin"}>
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
            <Link href={"/feed"}>
              <button className="btn btn-primary mt-10">Go back to feed</button>
            </Link>
          </div>
        )}
      </motion.main>
    </>
  );
};

export default PageSignUp;
