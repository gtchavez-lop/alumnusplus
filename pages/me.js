import { FiEdit2, FiGithub, FiMail } from "react-icons/fi";
import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

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
  const [scrollYValue, setScrollYValue] = useState(0);
  const user = __supabase.auth.user();
  const router = useRouter();
  const __feed = useQuery(["feed"], async () => {
    const res = await fetch(
      "/api/feed?" +
        new URLSearchParams({
          id: user.id,
        })
    );

    const { data } = await res.json();
    return data;
  });

  const { scrollY } = useScroll();

  const fetchConnections = () => {
    const connections = __supabase.auth.user().user_metadata.connections
      ? JSON.parse(__supabase.auth.user().user_metadata.connections)
      : [];
    setLocalConnections(connections);
  };

  const fetchUser = () => {
    const user = __supabase.auth.user();

    if (user) {
      setLocalUser(user);
      fetchConnections();
    }
  };

  useEffect(() => {
    // check if user is signed in
    if (!__supabase.auth.user()) {
      router.push("/signin");
    } else {
      fetchUser();
    }
    return () => {
      scrollY.onChange((latest) => {
        setScrollYValue(latest);
      });
    };
  }, []);

  return (
    localUser &&
    __feed.isSuccess && (
      <>
        {/* <motion.div
          animate={{
            opacity: scrollYValue > 10 ? 0 : 1,
            y: scrollYValue > 10 ? -100 : 0,
          }}
          transition={{
            duration: 0.2,
            ease: "circOut",
          }}
          className="bg-primary w-screen fixed top-0 h-[310px] lg:h-[330px] left-0 opacity-0 hidden lg:block"
        /> */}

        <motion.main
          variants={__PageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="lg:mt-16"
        >
          {/* profile */}
          <div className="flex gap-4 items-end relative">
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
          <div className="tabs tabs-boxed mt-10 lg:gap-2 justify-center md:justify-start">
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
                {tabActive == "feed" && <MeFeed feed={__feed.data} />}
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
