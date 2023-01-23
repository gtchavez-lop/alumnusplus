import {
  $prov_companySize,
  $prov_companyType,
  $prov_industryType,
  $prov_tags,
  $schema_provisioner,
} from "../../schemas/user";

import { AnimatePresence } from "framer-motion";
import Cities from "../../schemas/ph_location.json";
import { FiLoader } from "react-icons/fi";
import Link from "next/link";
import { __PageTransition } from "../../lib/animation";
import { __supabase } from "../../supabase";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useState } from "react";

const RegisterProvisioner = () => {
  const router = useRouter();
  const schema = $schema_provisioner;
  const [page, setPage] = useState(1);

  const [inputData, setInputData] = useState({
    ...$schema_provisioner,
    password: "",
    comfirmPassword: "",
    type: "provisioner",
  });

  const handleSubmit = async () => {
    setPage(4);
    window.scrollBy({
      top: -window.innerHeight,
      left: 0,
      behavior: "smooth",
    });

    const { error } = await __supabase.auth.signUp({
      email: inputData.contactInformation.email,
      password: inputData.password,
      options: {
        data: {
          address: inputData.address,
          alternativeNames: [],
          companySize: inputData.companySize,
          companyType: inputData.companyType,
          contactInformation: inputData.contactInformation,
          foundingYear: inputData.foundingYear,
          fullDescription: inputData.fullDescription,
          id: inputData.id,
          industryType: inputData.industryType,
          jobPostings: [],
          legalName: inputData.legalName,
          shortDescription: inputData.shortDescription,
          socialProfiles: inputData.socialProfiles,
          tags: inputData.tags,
          type: inputData.type,
          website: inputData.website,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setPage(1);
      return;
    }

    toast.success("Account created successfully!");
    router.push("/login");
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
        <h1 className="text-3xl font-bold">Register as a Provisioner</h1>
        <progress
          className="progress progress-primary bg-transparent w-full"
          value={page}
          max={4}
        />

        <div className="flex flex-col mt-10">
          <AnimatePresence mode="wait">
            {page === 1 && (
              <motion.div
                key="1"
                variants={__PageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <p className="text-xl font-bold">Account Details</p>

                <div className="max-w-lg mt-5">
                  <div className="flex flex-col bg-base-200 p-3 rounded-btn">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="input input-primary"
                      value={inputData.contactInformation.email}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          contactInformation: {
                            ...inputData.contactInformation,
                            email: e.target.value,
                          },
                        })
                      }
                    />

                    <label htmlFor="password" className="mt-3">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="input input-primary"
                      value={inputData.password}
                      onChange={(e) =>
                        setInputData({ ...inputData, password: e.target.value })
                      }
                    />

                    <label htmlFor="comfirmPassword" className="mt-3">
                      Comfirm Password
                    </label>
                    <input
                      type="password"
                      name="comfirmPassword"
                      id="comfirmPassword"
                      className="input input-primary"
                      value={inputData.comfirmPassword}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          comfirmPassword: e.target.value,
                        })
                      }
                    />

                    <div className="flex justify-end mt-10">
                      <button
                        disabled={
                          inputData.password !== inputData.comfirmPassword ||
                          inputData.password === "" ||
                          inputData.comfirmPassword === "" ||
                          inputData.contactInformation.email === ""
                        }
                        className="btn btn-primary"
                        onClick={() => setPage(page + 1)}
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
                key="2"
                variants={__PageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <p className="text-xl font-bold">Company Details</p>

                <div className="max-w-lg mt-5">
                  <div className="flex flex-col bg-base-200 p-3 rounded-btn">
                    <label htmlFor="companyName">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      id="companyName"
                      className="input input-primary"
                      value={inputData.legalName}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          legalName: e.target.value,
                        })
                      }
                    />

                    <label htmlFor="companyType" className="mt-3">
                      Company Type
                    </label>
                    <select
                      name="companyType"
                      id="companyType"
                      className="select select-primary w-full"
                      value={inputData.companyType}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          companyType: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Select Company Type
                      </option>
                      {$prov_companyType.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>

                    <label htmlFor="industryType" className="mt-3">
                      Industry Type
                    </label>
                    <select
                      name="industryType"
                      id="industryType"
                      className="select select-primary w-full"
                      value={inputData.industryType}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          industryType: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Select Industry Type
                      </option>
                      {$prov_industryType.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>

                    <label htmlFor="companySize" className="mt-3">
                      Company Size
                    </label>
                    <select
                      name="companySize"
                      id="companySize"
                      className="select select-primary w-full"
                      value={inputData.companySize}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          companySize: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Select Company Size
                      </option>
                      {$prov_companySize.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>

                    <label htmlFor="physicalAddress" className="mt-3">
                      Physical Company Address
                    </label>
                    <input
                      type="text"
                      name="physicalAddress"
                      id="physicalAddress"
                      className="input input-primary"
                      value={inputData.address.physicalAddress}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          address: {
                            ...inputData.address,
                            physicalAddress: e.target.value,
                          },
                        })
                      }
                    />

                    <label htmlFor="postalCode" className="mt-3">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      id="postalCode"
                      className="input input-primary"
                      value={inputData.address.postalCode}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          address: {
                            ...inputData.address,
                            postalCode: e.target.value,
                          },
                        })
                      }
                    />

                    <label htmlFor="city" className="mt-3">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      className="input input-primary"
                      value={inputData.address.city}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          address: {
                            ...inputData.address,
                            city: e.target.value,
                          },
                        })
                      }
                    />

                    <label htmlFor="foundingYear" className="mt-3">
                      Founding Year
                    </label>
                    <input
                      type="number"
                      name="foundingYear"
                      id="foundingYear"
                      className="input input-primary"
                      value={inputData.foundingYear}
                      min="1900"
                      max="2021"
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          foundingYear: e.target.value,
                        })
                      }
                    />

                    <div className="flex justify-between mt-10">
                      <button
                        className="btn btn-primary"
                        onClick={() => setPage(page - 1)}
                      >
                        Back
                      </button>
                      <button
                        disabled={
                          inputData.legalName === "" ||
                          inputData.companyType === "" ||
                          inputData.industryType === "" ||
                          inputData.address.physicalAddress === "" ||
                          inputData.address.postalCode === "" ||
                          inputData.address.city === "" ||
                          inputData.foundingYear === ""
                        }
                        className="btn btn-primary"
                        onClick={() => setPage(page + 1)}
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
                key="3"
                variants={__PageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <p className="text-xl font-bold">Company Descriptions</p>

                <div className="max-w-lg mt-5">
                  <div className="flex flex-col bg-base-200 p-3 rounded-btn">
                    <label htmlFor="shortDescription" className="mt-3">
                      Short Description
                    </label>
                    <textarea
                      name="shortDescription"
                      id="shortDescription"
                      className="textarea texarea-primary"
                      value={inputData.shortDescription}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          shortDescription: e.target.value,
                        })
                      }
                    />

                    <label htmlFor="fullDescription" className="mt-3">
                      Full Description
                    </label>
                    <textarea
                      name="fullDescription"
                      id="fullDescription"
                      className="textarea texarea-primary"
                      value={inputData.fullDescription}
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          fullDescription: e.target.value,
                        })
                      }
                    />

                    <div className="flex justify-between mt-10">
                      <button
                        className="btn btn-primary"
                        onClick={() => setPage(page - 1)}
                      >
                        Back
                      </button>
                      <button
                        disabled={
                          inputData.shortDescription === "" ||
                          inputData.fullDescription === ""
                        }
                        className="btn btn-primary"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {page === 4 && (
              <motion.div
                key="4"
                variants={__PageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <p className="text-xl font-bold">Processing Registration</p>
                <div className="max-w-lg mt-5">
                  <div className="flex flex-col bg-base-200 p-3 rounded-btn">
                    <p className="text-center">
                      Please wait while we process your registration
                    </p>
                    <div className="flex justify-center mt-10">
                      <FiLoader className="animate-spin" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>
    </>
  );
};

export default RegisterProvisioner;
