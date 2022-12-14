import {
  FiEdit2,
  FiGithub,
  FiGrid,
  FiLoader,
  FiMail,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import { motion, useInView, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { AnimatePresence } from "framer-motion";
import MeConnections from "../../components/Me/MeConnections";
import MeFeed from "../../components/Me/MeFeed";
import MeSettings from "../../components/Me/MeSettings";
import { __PageTransition } from "../../lib/animation";
import { __supabase } from "../../supabase";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const ProfilePage = (e) => {
  const [tabActive, setTabActive] = useState("feed");
  const [tabNumberActive, setTabNumberActive] = useState(1);
  const [localUser, setLocalUser] = useState();
  const [localConnections, setLocalConnections] = useState([]);
  const [localFeed, setLocalFeed] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  // tabs
  const tabContainer = useRef(null);
  const tab1 = useRef(null);
  const tab2 = useRef(null);
  const tab3 = useRef(null);
  const tab1InView = useInView(tab1);
  const tab2InView = useInView(tab2);
  const tab3InView = useInView(tab3);

  const fetchData = async () => {
    const {
      data: { user },
    } = await __supabase.auth.getUser();

    const { data: userData, error: userError } = await __supabase
      .rpc("gethunterbyusername", {
        username_input: user.user_metadata?.username,
      })
      .single();

    const connections = userData.connections;

    const { data: feedData, error: feedError } = await __supabase.rpc(
      "gethunterpostsbyid",
      {
        id_input: user.id,
      }
    );

    if (userError || feedError || !user) {
      toast.error("Something went wrong");
      return;
    }

    // console.log(userData);

    setLocalUser(userData);
    setLocalConnections(connections);
    setLocalFeed(feedData);

    setIsLoaded(true);
  };

  const checkUser = async () => {
    const {
      data: { user },
    } = await __supabase.auth.getUser();
    if (user) {
      setLocalUser(user);
      fetchData();
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <>
      {isLoaded && localUser ? (
        <motion.main
          variants={__PageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="pb-16 pt-36 lg:pt-24"
        >
          <>
            {/* profile */}
            <div className="flex gap-4 items-end relative z-10 py-5 bg-base-100">
              <img
                src={`https://dicebear.com/api/bottts/${localUser?.username}.svg`}
                className="w-24 h-24 lg:w-32 lg:h-32 z-10"
                alt="profile"
              />

              <div className="flex flex-col gap-2 z-10 ">
                <h1 className="text-2xl lg:text-3xl font-bold leading-3 lg:leading-3">
                  {localUser?.fullname?.first} {localUser?.fullname?.last}
                </h1>
                <p className="opacity-50">@{localUser?.username}</p>
              </div>

              {/* <div
                className="hidden lg:inline-block tooltip tooltip-left ml-auto"
                data-tip="Edit profile"
              >
                <div className="btn btn-primary btn-square ml-auto">
                  <FiEdit2 />
                </div>
              </div> */}
            </div>

            {/* tabs */}
            <div className="bg-base-100 sticky top-28 pt-5 pb-2">
              {/* tab desktop */}
              <div className="tabs tabs-boxed justify-center hidden md:flex lg:gap-2">
                <button
                  onClick={(e) => setTabActive("feed")}
                  className={`tab ${tabActive === "feed" && "tab-active"}`}
                >
                  My Feed
                </button>
                <button
                  onClick={(e) => setTabActive("connections")}
                  className={`tab ${
                    tabActive === "connections" && "tab-active"
                  }`}
                >
                  My Connections
                </button>
                <button
                  onClick={(e) => setTabActive("settings")}
                  className={`tab ${tabActive === "settings" && "tab-active"}`}
                >
                  Settings
                </button>
              </div>

              {/* tab mobile */}
              {/* <div className="tabs tabs-boxed grid grid-cols-3 md:hidden lg:gap-2 justify-center md:justify-start">
							<button
								onClick={(e) => setTabActive("feed")}
								className={`tab rounded-full ${tabActive === "feed" && "tab-active"}`}
							>
								<FiEdit2 />
							</button>
							<button
								onClick={(e) => setTabActive("connections")}
								className={`tab rounded-full ${tabActive === "connections" && "tab-active"}`}
							>
								<FiUsers />
							</button>
							<button
								onClick={(e) => setTabActive("settings")}
								className={`tab rounded-full ${tabActive === "settings" && "tab-active"}`}
							>
								<FiSettings />
							</button>
						</div> */}
            </div>

            <div>
              {/* desktop view */}
              <AnimatePresence mode="popLayout">
                <motion.div
                  initial={{
                    opacity: 0,
                    x: "-50px",
                  }}
                  animate={{
                    opacity: 1,
                    x: "0px",
                    transition: { duration: 0.5, ease: "circOut" },
                  }}
                  exit={{
                    clipPath: "inset(0 0 0 100%)",
                    x: "50px",
                    transition: { duration: 0.5, ease: "circOut" },
                  }}
                  className="md:flex flex-col gap-5 hidden pt-10 relative"
                  key={tabActive}
                >
                  {tabActive === "feed" && <MeFeed feed={localFeed} />}
                  {tabActive === "connections" && (
                    <MeConnections connections={localConnections} />
                  )}
                  {tabActive === "settings" && <MeSettings data={localUser} />}
                </motion.div>
              </AnimatePresence>
              {/* mobile view */}
              <AnimatePresence mode="wait">
                <>
                  <div className="grid grid-cols-3 w-full gap-2 mb-10 md:hidden">
                    <div
                      onClick={() => {
                        // scroll tab1 into view without y scroll
                        document.getElementById("feed").scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                          inline: "nearest",
                        });
                      }}
                      scroll={false}
                      className={`btn ${
                        tab1InView ? "btn-primary" : "btn-link"
                      }`}
                    >
                      <FiGrid />
                    </div>
                    <div
                      onClick={() => {
                        document.querySelector("#connections").scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                          inline: "nearest",
                        });
                      }}
                      scroll={false}
                      className={`btn ${
                        tab2InView ? "btn-primary" : "btn-link"
                      }`}
                    >
                      <FiUsers />
                    </div>
                    <div
                      onClick={() => {
                        document.querySelector("#settings").scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                          inline: "nearest",
                        });
                      }}
                      scroll={false}
                      className={`btn ${
                        tab3InView ? "btn-primary" : "btn-link"
                      }`}
                    >
                      <FiSettings />
                    </div>
                  </div>
                  <motion.div
                    variants={__PageTransition}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="md:hidden carousel gap-10"
                    ref={tabContainer}
                  >
                    <motion.div
                      ref={tab1}
                      id="feed"
                      className="carousel-item w-full flex flex-col items-start"
                    >
                      <MeFeed feed={localFeed} />
                    </motion.div>
                    <motion.div
                      ref={tab2}
                      id="connections"
                      className="carousel-item w-full flex flex-col items-start"
                    >
                      <MeConnections connections={localConnections} />
                    </motion.div>
                    <motion.div
                      ref={tab3}
                      id="settings"
                      className="carousel-item w-full flex flex-col items-start"
                    >
                      <MeSettings data={localUser} />
                    </motion.div>
                  </motion.div>
                </>
              </AnimatePresence>
            </div>
          </>
        </motion.main>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <FiLoader className="animate-spin py-10" />
        </div>
      )}
    </>
  );
};

export default ProfilePage;
