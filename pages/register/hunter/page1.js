import { __PageTransition } from "../../../lib/animtions";
import __supabase from "../../../lib/supabase";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useState } from "react";

const MM_Cities = [
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

const Hunter_SignUp_Page1 = ({ setPage }) => {
  const [usernameTaken, setUsernameTaken] = useState(null);
  const [isAlreadyHunter, setIsAlreadyHunter] = useState(null);
  const router = useRouter();

  const checkIfUsernameIsTaken = async (username) => {
    const { data, error } = await __supabase
      .from("user_hunters")
      .select("*")
      .eq("username", username);
    if (error) {
      console.log(error);
      return;
    } else {
      if (data.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  };

  const checkIfEmailIsAlreadyHunter = async (email) => {
    const { data, error } = await __supabase
      .from("user_hunters")
      .select("*")
      .eq("email", email);
    if (error) {
      console.log(error);
      return;
    } else {
      if (data.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = {
      username: form.username.value || "",
      email: form.email.value || "",
      password: form.password.value || "",
      firstName: form.firstName.value || "",
      lastName: form.lastName.value || "",
      middleName: form.middleName.value || "",
      gender: form.gender.value || "",
      birthdate: form.birthdate.value || "",
      address: form.address.value || "",
      city: form.city.value || "",
      postalCode: form.postalCode.value || "",
      university: form.university.value || "",
      type: "hunter",
      connections: [],
    };

    if (
      formData.username === "" ||
      formData.email === "" ||
      formData.password === "" ||
      formData.firstName === "" ||
      formData.lastName === "" ||
      formData.address === "" ||
      formData.city === "" ||
      formData.postalCode === "" ||
      formData.university === ""
    ) {
      toast.error("Please fill out all fields");
      return;
    } else {
      checkIfUsernameIsTaken(formData.username).then((res) => {
        if (res) {
          setUsernameTaken(true);
          toast.error("Username is already taken");
          // smooth scroll to top
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          return;
        } else {
          setUsernameTaken(false);

          checkIfEmailIsAlreadyHunter(formData.email).then(async (res) => {
            if (res) {
              setIsAlreadyHunter(true);
              toast.error("Email is already registered");
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
              return;
            } else {
              setIsAlreadyHunter(false);
              toast.loading("Creating account...");

              // create user
              const { user, error } = await __supabase.auth.signUp(
                {
                  email: formData.email,
                  password: formData.password,
                },
                {
                  data: {
                    username: form.username.value,
                    email: form.email.value,
                    firstName: form.firstName.value,
                    lastName: form.lastName.value,
                    middleName: form.middleName.value,
                    gender: form.gender.value,
                    birthdate: form.birthdate.value,
                    address: form.address.value,
                    city: form.city.value,
                    postalCode: form.postalCode.value,
                    university: form.university.value,
                    type: "hunter",
                    connections: [],
                  },
                }
              );

              toast.dismiss();
              if (error) {
                toast.error(error.message);
                return;
              } else {
                toast.success("Account created successfully");
                toast("Please check your email for verification link");
                router.push("/login");
              }
            }
          });
        }
      });
    }
  };

  return (
    <motion.main
      transition={{ duration: 0.3, ease: "circOut" }}
      className="relative py-16"
    >
      {/* img background with gradient filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed w-full h-screen top-0 right-0 "
      >
        <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-full bg-gradient-to-r from-base-100 to-transparent" />
        <img
          src="https://images.unsplash.com/photo-1613909207039-6b173b755cc1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80"
          className="absolute top-0 right-0 hidden lg:block w-1/2 h-full object-cover -z-10 transition-all duration-300"
        />
      </motion.div>

      <motion.div
        className="relative"
        initial={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0 }}
      >
        <h1 className="text-3xl">Hunter Account</h1>
        <p className="opacity-50 max-w-md">
          A Hunter is a person who is looking for a job. They can be
          freelancers, contractors, or full-time employees.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 z-10">
          <form
            className="grid grid-cols-2 gap-5 mt-16 gap-y-2"
            onSubmit={handleSubmit}
          >
            {/* email and password */}
            <div className="flex flex-col">
              <label htmlFor="username">Username</label>
              <input
                type="username"
                name="username"
                id="username"
                className={`input ${
                  usernameTaken == true ? "input-error" : "input-primary"
                }`}
                placeholder="Username"
                onChange={(e) => {
                  setUsernameTaken(null);
                }}
              />
            </div>
            <div className="flex flex-col col-start-1">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className={`input ${
                  isAlreadyHunter == true ? "input-error" : "input-primary"
                } `}
                placeholder="Email"
                onChange={(e) => {
                  setIsAlreadyHunter(null);
                }}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className="input input-primary"
                placeholder="Password"
              />
            </div>
            {/* divider */}
            <div className="col-span-full divider my-5" />
            {/* name */}
            <div className="flex flex-col col-start-1">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                className="input input-primary input-bordered"
                placeholder="John"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="middleName">Middle Name (Optional)</label>
              <input
                type="text"
                name="middleName"
                id="middleName"
                className="input input-primary input-bordered"
                placeholder="Christopher"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                className="input input-primary input-bordered"
                placeholder="Doe"
              />
            </div>
            {/* divider */}
            <div className="col-span-full divider my-0 h-2  opacity-0" />
            {/* gender */}
            <div className="flex flex-col col-start-1">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                className="select select-bordered select-primary w-full"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="nonBinary">Non-binary</option>
                <option value="preferNotToSay">Prefer not to say</option>
              </select>
            </div>
            {/* birthdate */}
            <div className="flex flex-col">
              <label htmlFor="birthdate">Birthdate</label>
              <input
                type="date"
                name="birthdate"
                id="birthdate"
                className="input input-primary input-bordered"
              />
            </div>
            {/* divider */}
            <div className="col-span-full divider my-0 h-2  opacity-0" />
            {/* address, city, and postal code */}
            <div className="flex flex-col col-start-1">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                name="address"
                id="address"
                className="input input-primary input-bordered"
                placeholder="1234 Main St"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="city">City</label>
              <select
                id="city"
                className="select select-bordered select-primary w-full"
              >
                {MM_Cities.map((city, index) => (
                  <option key={`city_${index + 1}`} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                id="postalCode"
                className="input input-primary input-bordered"
                placeholder="1234"
              />
            </div>
            {/* divider */}
            <div className="col-span-full divider my-0 h-2  opacity-0" />
            {/* university */}
            <div className="col-span-full flex flex-col col-start-1">
              <label htmlFor="university">University</label>
              <input
                type="text"
                name="university"
                id="university"
                className="input input-primary input-bordered"
                placeholder="University of Caloocan City"
              />
            </div>
            {/* divider */}
            <div className="col-span-full divider my-0 h-2  opacity-0" />
            {/* submit */}
            <div className="col-span-full flex flex-col col-start-1">
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.main>
  );
};

export default Hunter_SignUp_Page1;
