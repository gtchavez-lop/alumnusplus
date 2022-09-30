import Link from "next/link";
import { _PageTransition } from "../lib/animations";
import { motion } from "framer-motion";
import { useState } from "react";

const RegisterPage = () => {
  const [userAccount, setUserAccount] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const checkValidity = (e) => {
    console.log(e.target.value);
  };

  return (
    <motion.div
      variants={_PageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-center"
    >
      <h1 className="text-3xl mt-16">Register an Alumnus Plus Account</h1>

      <form
        className="form-control w-full max-w-md mt-16"
        onChange={(e) => checkValidity(e)}
      >
        <div className="flex flex-col">
          <span>Email Address</span>
          <input
            type="email"
            className="input input-bordered"
            placeholder="juandelacruz@email.com"
            name="user_email"
            onChange={(e) =>
              setUserAccount({ ...userAccount, email: e.target.value })
            }
            value={userAccount.email}
          />
        </div>
        <div className="flex flex-col mt-3">
          <span>Password</span>
          <input
            type="password"
            className={`input input-bordered ${
              userAccount.password !== userAccount.confirmPassword &&
              userAccount.password.length > 0
                ? "input-error"
                : ""
            }`}
            placeholder="**********"
            name="user_password"
            onChange={(e) =>
              setUserAccount({ ...userAccount, password: e.target.value })
            }
            value={userAccount.password}
          />
        </div>
        <div className="flex flex-col mt-3">
          <span>Confirm Password</span>
          <input
            type="password"
            className={`input input-bordered ${
              userAccount.password !== userAccount.confirmPassword &&
              userAccount.confirmPassword.length > 0
                ? "input-error"
                : ""
            }`}
            placeholder="**********"
            name="user_password_confirm"
            onChange={(e) =>
              setUserAccount({
                ...userAccount,
                confirmPassword: e.target.value,
              })
            }
            value={userAccount.confirmPassword}
          />
        </div>

        <div className="flex flex-col mt-10">
          <button className="btn btn-primary">Get Started</button>

          <div className="flex flex-row justify-center mt-4">
            <span>Already an Alumnus Plus member?</span>
            <Link href="/login">
              <p className="link ml-2">Open your account here</p>
            </Link>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default RegisterPage;
