import { FiEdit2, FiGithub, FiMail } from "react-icons/fi";
import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useFeed, useUserFeed } from "../lib/globalStates";

import { AnimatePresence } from "framer-motion";
import MeConnections from "../components/MeConnections";
import MeFeed from "../components/MeFeed";
import MeSettings from "../components/MeSettings";
import { __PageTransition } from "../lib/animtions";
import __supabase from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const MePage = (e) => {
  const [tabActive, setTabActive] = useState("feed");
  const [localUser, setLocalUser] = useState();
  const [localConnections, setLocalConnections] = useState([]);
  const user = __supabase.auth.user();
  const router = useRouter();

  const { scrollY } = useScroll();

  // const { data, isLoading, isSuccess } = useUserFeed();

  const fetchConnections = () => {
    const token = localStorage.getItem("supabase.auth.token");
    const parsedToken = JSON.parse(token);
    const user = parsedToken.currentSession.user;

    setLocalConnections(user.user_metadata.connections);
  };

  const fetchUser = () => {
    const user = window.localStorage.getItem("supabase.auth.token");
    const parsedUser = JSON.parse(user);
    const localUser = parsedUser.currentSession.user;

    if (user) {
      setLocalUser(localUser);
      fetchConnections();
    }
  };

  useEffect(() => {
    const token = window.localStorage.getItem("supabase.auth.token");
    const session = JSON.parse(token);
    const user = session.currentSession.user;

    if (!user) {
      router.push("/login");
    } else {
      setLocalUser(user);
      fetchConnections();
    }
  }, []);

  return (
    localUser && (
      <>
        <motion.main
          variants={__PageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="mt-16"
        >
          {/* profile */}
          <div className="flex gap-4 items-end relative z-10 py-5 bg-base-100">
            <img
              src={`https://dicebear.com/api/micah/${localUser.user_metadata.username}.svg`}
              className="rounded-full w-24 h-24 lg:w-32 lg:h-32 bg-secondary z-10"
            />

            <div className="flex flex-col gap-2 z-10 ">
              <h1 className="text-2xl lg:text-3xl font-bold leading-3 lg:leading-3">
                {localUser.user_metadata.first_name}{" "}
                {localUser.user_metadata.last_name}
              </h1>
              <p className="opacity-50">@{localUser.user_metadata.username}</p>
            </div>

            <div
              className="hidden lg:inline-block tooltip tooltip-left ml-auto"
              data-tip="Edit profile"
            >
              <div className="btn btn-primary btn-square ml-auto">
                <FiEdit2 />
              </div>
            </div>
          </div>

          {/* tabs */}
          <div className="bg-base-100 sticky top-28 pt-5 pb-2">
            <div className="tabs tabs-boxed lg:gap-2 justify-center md:justify-start">
              <a
                onClick={(e) => setTabActive("feed")}
                className={`tab ${tabActive == "feed" && "tab-active"}`}
              >
                My Feed
              </a>
              <a
                onClick={(e) => setTabActive("connections")}
                className={`tab ${tabActive == "connections" && "tab-active"}`}
              >
                My Connections
              </a>
              <a
                onClick={(e) => setTabActive("settings")}
                className={`tab ${tabActive == "settings" && "tab-active"}`}
              >
                Settings
              </a>
            </div>
          </div>

          {/* tab content */}
          <div className="mt-10">
            <AnimatePresence mode="wait">
              <motion.div
                variants={__PageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col gap-5"
                key={tabActive}
              >
                {/* {tabActive == "feed" && <MeFeed feed={data} />} */}
                {tabActive == "connections" && (
                  <MeConnections connections={localConnections} />
                )}
                {tabActive == "settings" && <MeSettings data={localUser} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.main>
      </>
    )
  );
};

export default MePage;
