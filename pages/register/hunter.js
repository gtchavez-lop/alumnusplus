import { FiCheckCircle, FiLoader, FiX } from "react-icons/fi";
import { useReducer, useState } from "react";

import { $schema_hunter } from "@schemas/user";
import { AnimatePresence } from "framer-motion";
import Cities from "@schemas/ph_location.json";
import SkillList from "@schemas/skills.json";
import { __PageTransition } from "@/lib/animation";
import { __supabase } from "@/supabase";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const RegisterHunter = () => {
  const router = useRouter();
  const schema = $schema_hunter;

  const [inputData, setInputData] = useState({
    ...schema,
    connections: [],
    education: [],
    type: "hunter",
    createdAt: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
    updatedAt: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
    password: "",
    confirmPassword: "",
  });

  const [page, setPage] = useState(1);
  const [citySearchResults, setCitySearchResults] = useState([]);
  const [primarySkillSearchResults, setPrimarySkillSearchResults] = useState(
    []
  );
  const [secondarySkillSearchResults, setSecondarySkillSearchResults] =
    useState([]);

  const handleSubmit = async () => {
    setPage(4);
    window.scrollBy({
      top: -window.innerHeight,
      left: 0,
      behavior: "smooth",
    });

    const { data: user, error: userError } = await __supabase.auth.signUp({
      email: inputData.email,
      password: inputData.password,
      options: {
        data: {
          address: inputData.address,
          birthdate: dayjs(inputData.birthdate).format("YYYY-MM-DD"),
          birthplace: inputData.birthplace,
          bio: inputData.bio,
          connections: [],
          created_at: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          education: [],
          email: inputData.email,
          gender: inputData.gender,
          id: inputData.id,
          full_name: inputData.fullName,
          phone: inputData.phone,
          skill_primary: inputData.skillPrimary,
          skill_secondary: inputData.skillSecondary,
          social_media_links: inputData.socialMediaLinks,
          type: "hunter",
          updated_at: dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          username: inputData.username,
          saved_jobs: [],
          subscription_type: "free",
        },
      },
    });

    if (userError) {
      toast.error(userError.message);
      setPage(1);
      return;
    }

    toast.success("Account created successfully!");
    setPage(5);

    setTimeout(() => {
      router.push("/login");
    }, 5000);
  };

  return (
    <>
      <img
        src="/registrationbg.svg"
        alt="Background"
        className="fixed top-0 left-0 w-full h-full object-cover opacity-25"
      />
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative min-h-screen w-full max-w-lg mx-auto pt-24 pb-36"
      >
        <h1 className="text-3xl font-bold">Register as a Hunter</h1>
        <progress
          className="progress progress-primary bg-transparent w-full"
          value={page}
          max={6}
        />

        <div className="flex flex-col mt-10">
          <AnimatePresence mode="wait">
            {page === 1 && (
              <motion.div
                variants={__PageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                key={`page-${page}`}
              >
                <p className="text-xl font-bold">Account Details</p>

                <div className="max-w-lg mt-5">
                  <div className="flex flex-col bg-base-200 p-3 rounded-btn">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      value={inputData.email}
                      onChange={(e) =>
                        setInputData({ ...inputData, email: e.target.value })
                      }
                      id="email"
                      className="input input-primary"
                      placeholder="youremail@mail.com"
                    />

                    <label htmlFor="username" className="mt-2">
                      Username
                    </label>
                    <input
                      type="text"
                      onInput={(e) => {
                        const regex = new RegExp(
                          /^[A-Za-z][A-Za-z0-9_]{7,29}$/
                        );
                        if (
                          regex.test(e.target.value) &&
                          e.target.value.length > 7
                        ) {
                          setInputData({
                            ...inputData,
                            username: e.target.value,
                          });
                          toast.dismiss();
                          e.currentTarget.classList.remove("input-error");
                        } else {
                          setInputData({
                            ...inputData,
                            username: null,
                          });
                          toast.dismiss();
                          toast.error(
                            "Username must be 8-30 characters long and can only contain letters, numbers and underscores."
                          );
                          e.currentTarget.classList.add("input-error");
                        }
                      }}
                      id="username"
                      className="input input-primary"
                      placeholder="youruniqueusername"
                    />

                    <label htmlFor="password" className="mt-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={inputData.password}
                      onChange={(e) =>
                        setInputData({ ...inputData, password: e.target.value })
                      }
                      id="password"
                      className="input input-primary"
                      placeholder="********"
                    />

                    <label htmlFor="confirmPassword" className="mt-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={inputData.confirmPassword}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          confirmPassword: e.target.value,
                        })
                      }
                      id="confirmPassword"
                      className="input input-primary"
                      placeholder="********"
                    />

                    <div className="flex justify-end mt-10">
                      <button
                        disabled={
                          !inputData.email ||
                          !inputData.password ||
                          !inputData.confirmPassword ||
                          inputData.password !== inputData.confirmPassword
                        }
                        onClick={() => {
                          setPage(page + 1);
                          window.scrollBy({
                            top: -window.innerHeight,
                            left: 0,
                            behavior: "smooth",
                          });
                        }}
                        className="btn btn-primary"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {page === 2 && (
              <motion.div
                variants={__PageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                key={`page-${page}`}
              >
                <p className="text-xl font-bold">Personal Details</p>

                <div className="max-w-lg mt-5">
                  <div className="flex flex-col bg-base-200 p-3 rounded-btn">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      value={inputData.fullName.first}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          fullName: {
                            ...inputData.fullName,
                            first: e.target.value,
                          },
                        })
                      }
                      id="firstName"
                      className="input input-primary"
                      placeholder="Juan Miguel"
                    />

                    <label htmlFor="middleName" className="mt-2">
                      Middle Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={inputData.fullName.middle}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          fullName: {
                            ...inputData.fullName,
                            middle: e.target.value,
                          },
                        })
                      }
                      id="middleName"
                      className="input input-primary"
                      placeholder="Jacinto"
                    />

                    <label htmlFor="lastName" className="mt-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={inputData.fullName.last}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          fullName: {
                            ...inputData.fullName,
                            last: e.target.value,
                          },
                        })
                      }
                      id="lastName"
                      className="input input-primary"
                      placeholder="Dela Cruz"
                    />

                    <label htmlFor="birthdate" className="mt-2">
                      Birthdate
                    </label>
                    <input
                      type="date"
                      value={inputData.birthdate}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          birthdate: e.target.value,
                        })
                      }
                      id="birthdate"
                      className="input input-primary"
                    />

                    <label htmlFor="birthplace" className="mt-2">
                      Birthplace
                    </label>
                    <input
                      type="text"
                      value={inputData.birthplace}
                      onInput={(e) =>
                        setInputData({
                          ...inputData,
                          birthplace: e.target.value,
                        })
                      }
                      id="birthplace"
                      className="input input-primary"
                      placeholder="Hospital Name or Home City"
                    />

                    <label htmlFor="gender" className="mt-2">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      className="select select-primary"
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          gender: e.target.value,
                        })
                      }
                    >
                      <option disabled>Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="nonbinary">Non-Binary</option>
                      <option value="unspecified">Not rather say</option>
                    </select>

                    <label
                      htmlFor="bio"
                      className="mt-2 w-full flex justify-between"
                    >
                      <span>Bio</span>
                      <span className="opacity-50">Markdown</span>
                    </label>
                    <textarea
                      value={inputData.bio}
                      onChange={(e) =>
                        setInputData({ ...inputData, bio: e.target.value })
                      }
                      id="bio"
                      className="textarea textarea-primary min-h-[200px]"
                      placeholder="Tell us about yourself"
                    />

                    <div className="flex justify-between mt-10">
                      <button
                        onClick={() => setPage(page - 1)}
                        className="btn btn-primary"
                      >
                        Back
                      </button>
                      <button
                        disabled={
                          !inputData.fullName.first ||
                          !inputData.fullName.last ||
                          !inputData.bio
                        }
                        onClick={() => {
                          setPage(page + 1);
                          window.scrollBy({
                            top: -window.innerHeight,
                            left: 0,
                            behavior: "smooth",
                          });
                        }}
                        className="btn btn-primary"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {page === 3 && (
              <motion.div
                variants={__PageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                key={`page-${page}`}
              >
                <p className="text-xl font-bold">Contact Details</p>

                <div className="max-w-lg mt-5">
                  <div className="flex flex-col bg-base-200 p-3 rounded-btn">
                    <label htmlFor="address.address">Physical Address</label>
                    <input
                      type="text"
                      value={inputData.address.address}
                      onInput={(e) =>
                        setInputData({
                          ...inputData,
                          address: {
                            ...inputData.address,
                            address: e.target.value,
                          },
                        })
                      }
                      id="address.address"
                      className="input input-primary"
                      placeholder="Address"
                    />

                    <label htmlFor="address.city" className="mt-2">
                      City
                    </label>
                    <div className="relative">
                      {/* searchbar */}
                      <input
                        type="text"
                        id="address.city"
                        className="input input-primary w-full"
                        placeholder="City"
                        onInput={(e) => {
                          const value = e.target.value;

                          if (value.length > 0) {
                            const filtered = Cities.filter((c) =>
                              c.city.toLowerCase().includes(value.toLowerCase())
                            );
                            setCitySearchResults(filtered);
                          } else {
                            setCitySearchResults([]);
                            setInputData({
                              ...inputData,
                              address: {
                                ...inputData.address,
                                city: "",
                              },
                            });
                          }
                        }}
                      />

                      {/* search results */}
                      {citySearchResults.length > 0 && (
                        <div className="absolute z-10 w-full bg-base-300 rounded-b-lg">
                          <div className="p-2">
                            {citySearchResults.map((c, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-2 cursor-pointer hover:bg-primary-100"
                                onClick={() => {
                                  setInputData({
                                    ...inputData,
                                    address: {
                                      ...inputData.address,
                                      city: c.city,
                                    },
                                  });
                                  setCitySearchResults([]);
                                  document.getElementById(
                                    "address.city"
                                  ).value = c.city;
                                }}
                              >
                                <span>{c.city}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <label htmlFor="postalCode" className="mt-2">
                      Postal Code
                    </label>
                    <input
                      type="number"
                      maxLength={4}
                      minLength={4}
                      value={inputData.address.postalCode}
                      onInput={(e) =>
                        setInputData({
                          ...inputData,
                          address: {
                            ...inputData.address,
                            postalCode: e.target.value,
                          },
                        })
                      }
                      id="postalCode"
                      className="input input-primary"
                      placeholder="0000"
                    />

                    <label htmlFor="contactNumber" className="mt-2">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      maxLength={11}
                      minLength={11}
                      value={inputData.phone}
                      onInput={(e) => {
                        // format with dashes
                        const formatted = e.target.value
                          .replace(/(\d{4})(\d{3})(\d{4})/, "$1-$2-$3")
                          .replace(/-$/, "");

                        setInputData({
                          ...inputData,
                          phone: formatted,
                        });
                      }}
                      id="contactNumber"
                      className="input input-primary"
                      placeholder="0000-000-0000"
                    />

                    <div className="flex justify-between mt-10">
                      <button
                        onClick={() => setPage(page - 1)}
                        className="btn btn-primary"
                      >
                        Back
                      </button>
                      <button
                        disabled={
                          !inputData.address.address ||
                          !inputData.address.city ||
                          !inputData.address.postalCode ||
                          inputData.address.postalCode.length < 4 ||
                          !inputData.phone ||
                          inputData.phone.length < 11
                        }
                        onClick={() => {
                          setPage(page + 1);
                          window.scrollBy({
                            top: -window.innerHeight,
                            left: 0,
                            behavior: "smooth",
                          });
                        }}
                        className="btn btn-primary"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {page === 4 && (
              <motion.div
                variants={__PageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <p className="text-xl font-bold">Your Skills</p>

                <div className="max-w-lg mt-5">
                  <div className="flex flex-col bg-base-200 p-3 rounded-btn">
                    <label htmlFor="PrimarySkill">Primary Skill</label>
                    <div className="relative">
                      {/* searchbar */}
                      <input
                        type="text"
                        id="PrimarySkill"
                        className="input input-primary w-full"
                        placeholder="Primary Skill"
                        onInput={(e) => {
                          const value = e.target.value;

                          if (value.length > 0) {
                            const filtered = SkillList.filter((c) =>
                              c.toLowerCase().includes(value.toLowerCase())
                            );
                            setPrimarySkillSearchResults(filtered);
                          } else {
                            setPrimarySkillSearchResults([]);
                            setInputData({
                              ...inputData,
                              skillPrimary: "",
                            });
                          }
                        }}
                      />

                      {/* search results */}
                      {primarySkillSearchResults.length > 0 && (
                        <div className="absolute z-10 w-full bg-base-300 rounded-b-lg h-max max-h-[200px] overflow-y-auto">
                          <div className="p-2">
                            {primarySkillSearchResults.map((c, i) => (
                              <div
                                key={`primary-${i}`}
                                className="flex items-center justify-between p-1 text-sm cursor-pointer hover:bg-primary-100"
                                onClick={() => {
                                  setInputData({
                                    ...inputData,
                                    skillPrimary: c,
                                  });
                                  setPrimarySkillSearchResults([]);
                                  document.getElementById(
                                    "PrimarySkill"
                                  ).value = c;
                                }}
                              >
                                <span>{c}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <label htmlFor="SecondarySkills" className="mt-2">
                      Secondary Skills
                    </label>
                    <div className="relative">
                      {/* searchbar */}
                      <input
                        type="text"
                        id="SecondarySkills"
                        className="input input-primary w-full"
                        placeholder="Secondary Skills"
                        onInput={(e) => {
                          const value = e.target.value;

                          if (value.length > 0) {
                            const filtered = SkillList.filter((c) =>
                              c.toLowerCase().includes(value.toLowerCase())
                            );
                            setSecondarySkillSearchResults(filtered);
                          } else {
                            setSecondarySkillSearchResults([]);
                          }
                        }}
                      />

                      {/* search results */}
                      {secondarySkillSearchResults.length > 0 && (
                        <div className="absolute z-10 w-full bg-base-300 rounded-b-lg h-max max-h-[200px] overflow-y-auto">
                          <div className="p-2">
                            {secondarySkillSearchResults.map((c, i) => (
                              <div
                                key={`secondary-${i}`}
                                className="flex items-center justify-between p-1 text-sm cursor-pointer hover:bg-primary-100"
                                onClick={() => {
                                  setInputData({
                                    ...inputData,
                                    skillSecondary: [
                                      ...inputData.skillSecondary,
                                      c,
                                    ],
                                  });
                                  setSecondarySkillSearchResults([]);
                                  document.getElementById(
                                    "SecondarySkills"
                                  ).value = "";
                                }}
                              >
                                <span>{c}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* selected skills */}
                      {inputData.skillSecondary.length > 0 && (
                        <div className="flex flex-wrap mt-5 gap-2">
                          {inputData.skillSecondary.map((c, i) => (
                            <div
                              key={`selected-${i}`}
                              className="badge badge-primary gap-2 items-center"
                              onClick={() => {
                                setInputData({
                                  ...inputData,
                                  skillSecondary:
                                    inputData.skillSecondary.filter(
                                      (s) => s !== c
                                    ),
                                });

                                document.getElementById(
                                  "SecondarySkills"
                                ).value = "";
                              }}
                            >
                              <span>{c}</span>
                              <FiX className="cursor-pointer hover:text-red-500" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between mt-10">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setPage(page - 1);
                        }}
                      >
                        Go Back
                      </button>

                      <button
                        disabled={
                          inputData.skillPrimary === "" ||
                          inputData.skillSecondary.length === 0
                        }
                        className="btn btn-primary"
                        onClick={() => {
                          handleSubmit();
                        }}
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {page === 5 && (
              <motion.div
                variants={__PageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <p className="text-xl font-bold">
                  Please wait while we process your application
                </p>
                <FiLoader className="animate-spin text-4xl" />
              </motion.div>
            )}

            {page === 6 && (
              <motion.div
                variants={__PageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <p className="text-xl font-bold">
                  Your application has been submitted
                </p>
                <FiCheckCircle className="text-4xl text-green-500" />

                <p className="mt-5">
                  Please check your email for confirmation.
                  <br />
                  You will be redirected to the home page in 5 seconds.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>
    </>
  );
};

export default RegisterHunter;
