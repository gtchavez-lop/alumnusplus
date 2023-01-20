import { AnimatePresence, motion } from "framer-motion";
import { __PageTransition, __TabTransition } from "../../lib/animation";
import { useEffect, useState } from "react";

import { FiX } from "react-icons/fi";
import { __supabase } from "../../supabase";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useSession } from "@supabase/auth-helpers-react";

const ProvMe = () => {
  const [activeTab, setActiveTab] = useState("account");
  const router = useRouter();
  const session = useSession();

  const signOutUser = async () => {
    toast.loading("Signing out...");
    await __supabase.auth.signOut();
    toast.dismiss();
    toast.success("Signed out successfully");
    router.push("/");
  };

  return (
    !!session && (
      <>
        <motion.main
          variants={__PageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative min-h-screen w-full flex flex-col gap-10 pt-24 pb-36"
        >
          {/* tabs */}
          <div className="tabs tabs-boxed">
            <p
              onClick={() => setActiveTab("account")}
              className={`tab rounded-full ${
                activeTab === "account" && "tab-active"
              }`}
            >
              Account Details
            </p>
            <p
              onClick={() => setActiveTab("settings")}
              className={`tab rounded-full ${
                activeTab === "settings" && "tab-active"
              }`}
            >
              Settings
            </p>
          </div>

          {/* content */}
          <AnimatePresence mode="wait">
            {activeTab === "account" && (
              <motion.div
                variants={__TabTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                key="account"
                className="flex flex-col gap-10"
              >
                <p className="text-2xl">Account Details</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {/* company details */}
                  <div className="bg-base-200 p-5 rounded-btn max-h-max">
                    <p className="text-lg font-bold text-primary">
                      Company Details
                    </p>

                    <p className="flex items-center justify-between">
                      <span>Company Name</span>
                      <span>{session.user.user_metadata.legalName}</span>
                    </p>

                    <p className="flex items-center justify-between">
                      <span>Company Type</span>
                      <span>{session.user.user_metadata.companyType}</span>
                    </p>

                    <p className="flex items-center justify-between">
                      <span>Company Size</span>
                      <span>{session.user.user_metadata.companySize}</span>
                    </p>

                    <p className="flex items-center justify-between">
                      <span>Founding Year</span>
                      <span>{session.user.user_metadata.foundingYear}</span>
                    </p>
                  </div>

                  {/* contact information */}
                  <div className="bg-base-200 p-5 rounded-btn max-h-max">
                    <p className="text-lg font-bold text-primary">
                      Contact Information
                    </p>

                    <p className="flex items-center justify-between">
                      <span>Company Email</span>
                      <span>
                        {session.user.user_metadata.contactInformation.email}
                      </span>
                    </p>

                    <p className="flex items-center justify-between">
                      <span>Company Phone</span>
                      <span>
                        {session.user.user_metadata.contactInformation.phone}
                      </span>
                    </p>

                    <p className="flex items-center justify-between">
                      <span>Company Address</span>
                      <span>
                        {session.user.user_metadata.address.physicalAddress},{" "}
                        {session.user.user_metadata.address.city}
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                variants={__TabTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                key="settings"
                className="flex flex-col gap-10"
              >
                <p className="text-2xl">Settings</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <div className="bg-base-200 p-5 rounded-btn">
                    <label className="label cursor-pointer">
                      <span className="label-text">Dark Mode</span>
                      <input type="checkbox" className="toggle" />
                    </label>

                    <label className="label cursor-pointer">
                      <span className="label-text">Notifications</span>
                      <input type="checkbox" className="toggle" />
                    </label>

                    <label className="label cursor-pointer">
                      <span className="label-text">Email Notifications</span>
                      <input type="checkbox" className="toggle" />
                    </label>

                    <label className="label cursor-pointer">
                      <span className="label-text">Push Notifications</span>
                      <input type="checkbox" className="toggle" />
                    </label>
                  </div>

                  <div>
                    <div className="bg-base-200 p-5 rounded-btn">
                      <p>Sign Out Account and end session</p>
                      <label
                        htmlFor="signOutModal"
                        className="btn btn-error btn-block"
                      >
                        Sign out
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>

        {/* sign out modal */}
        <input type="checkbox" id="signOutModal" className="modal-toggle" />
        <label htmlFor="signOutModal" className="modal">
          <div className="modal-box relative">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">
                Do you want to sign out from your account?
              </h3>
              <label htmlFor="signOutModal" className="btn fab fab-sm">
                <FiX />
              </label>
            </div>
            <p className="py-4">
              Signing out will end your session and you will have to sign in
              again to access your account.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5">
              <label htmlFor="signOutModal" className="btn btn-ghost btn-block">
                Cancel
              </label>
              <label
                onClick={signOutUser}
                htmlFor="signOutModal"
                className="btn btn-error btn-block"
              >
                Sign out
              </label>
            </div>
          </div>
        </label>
      </>
    )
  );
};

export default ProvMe;
