import { FiGrid, FiSettings, FiUsers } from "react-icons/fi";
import { useEffect, useState } from "react";

import { AnimatePresence } from "framer-motion";
import MeConnections from "../components/MeConnections";
import MeFeed from "../components/MeFeed";
import { _PageTransition } from "../lib/animations";
import __supabase from "../lib/auth";
import { motion } from "framer-motion";

const PageMe = () => {
  const [localFeed, setLocalFeed] = useState([]);
  const [connections, setConnections] = useState([]);
  const [userData, setUserData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [tabSelected, setTabSelected] = useState("feed");

  const fetchdata = () => {
    setIsLoaded(false);
    let parsedUser = window.localStorage.getItem("supabase.auth.token")
      ? JSON.parse(window.localStorage.getItem("supabase.auth.token"))
      : null;

    __supabase
      .from("user_data")
      .select("*")
      .eq("id", parsedUser.currentSession.user.id)
      .single()
      .then((res) => {
        if (res.error) {
          console.log(res.error);
          return;
        }
        let userConnections = JSON.parse(res.data.connections);

        setConnections(userConnections);
        setUserData(res.data);

        __supabase
          .from("user_feed")
          .select("*")
          .eq("uploader_id", parsedUser.currentSession.user.id)
          .order("created_at", { ascending: false })
          .then((res) => {
            if (res.error) {
              console.log(res.error);
              return;
            }
            setLocalFeed(res.data);
          });
      });
  };

  useEffect(() => {
    fetchdata();
  }, []);

  useEffect(() => {
    setIsLoaded(userData && localFeed && connections ? true : false);
  }, [userData, localFeed, connections]);

  return (
    <motion.main
      variants={_PageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-max"
    >
      {/* profile */}
      {isLoaded && (
        <>
          <div className=" flex flex-col items-center justify-center bg-base-100 relative">
            <img
              src={`https://avatars.dicebear.com/api/micah/${userData.user_handle}.svg`}
              alt="avatar"
              className="w-28 h-28 rounded-full bg-gray-400"
            />
            <div className="flex flex-col text-center w-full ">
              <p className="text-2xl font-bold">@{userData.user_handle}</p>
              <p className="text-base">
                {userData.name_given} {userData.name_last}
              </p>

              <div className="grid grid-cols-2 max-w-sm mx-auto w-full mt-5 gap-5 sticky top-32">
                <p className="flex flex-col">
                  <span className="opacity-30">Connections</span>
                  <span className="text-2xl">{connections.length}</span>
                </p>
                <p className="flex flex-col">
                  <span className="opacity-30">Post</span>
                  <span className="text-2xl">{localFeed.length}</span>
                </p>
              </div>
            </div>
          </div>

          {/* tabs */}
          <div className="tabs tabs-boxed justify-center gap-5 mt-10 w-full">
            <a
              onClick={(e) => setTabSelected("feed")}
              className={`tab gap-3 ${tabSelected == "feed" && "tab-active"}`}
            >
              <FiGrid className="text-lg" />
              <span className="hidden md:block">Feed</span>
            </a>
            <a
              onClick={(e) => setTabSelected("connections")}
              className={`tab gap-3 ${
                tabSelected == "connections" && "tab-active"
              }`}
            >
              <FiUsers className="text-lg" />
              <span className="hidden md:block">Connections</span>
            </a>
            <a
              onClick={(e) => setTabSelected("settings")}
              className={`tab gap-3 ${
                tabSelected == "settings" && "tab-active"
              }`}
            >
              <FiSettings className="text-lg" />
              <span className="hidden md:block">Settings</span>
            </a>
          </div>

          {/* tab content */}
          <div className="py-16">
            <AnimatePresence mode="sync" key={tabSelected}>
              {tabSelected == "feed" && (
                <MeFeed posts={localFeed} key={tabSelected} />
              )}
              {tabSelected == "connections" && (
                <MeConnections
                  connectionIDs={connections}
                  setConnectionsIDs={setConnections}
                  key={tabSelected}
                />
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </motion.main>
  );
};

export default PageMe;
