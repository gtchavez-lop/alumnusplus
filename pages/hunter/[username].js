import { AnimatePresence, motion } from "framer-motion";
import { FiFilter, FiLoader } from "react-icons/fi";
import { useEffect, useState } from "react";

import FeedCard from "../feed/FeedCard";
import Image from "next/image";
import { __PageTransition } from "../../lib/animtions";
import __supabase from "../../lib/supabase";
import { useRouter } from "next/router";
import { useSelect } from "react-supabase";

const HunterPage = ({ blogs, userData }) => {
  const [hunterData, setHunterData] = useState({});
  const [hunterPosts, setHunterPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [tabSelected, setTabSelected] = useState("posts");
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  const fetchHunterPosts = async () => {

    const { data: posts, error } = await __supabase
      .rpc("gethunterpostsbyid", {
          id_input: hunterData.id
      });

      console.log(posts);

    if (error) {
      console.log(error);
      return;
    }

    setHunterPosts(posts);
    setFilteredPosts(posts);
    setIsLoaded(true);
  };

  const fetchUserData = async () => {
    const { data: hunterData, error: hunterError } = await __supabase
      .rpc("gethunterbyusername", {
        username_input: router.query.username
      })
      .single();

    if (hunterError || !hunterData) {
      router.push("/feed");
    } else {
      // check if the request is from the same user
      if (hunterData.email === __supabase.auth.user().email) {
        router.push("/me");
        return
      } else {
        setHunterData(hunterData);
      }

    }
  };

  const filterOptionsHandler = (e) => {
    const input = e.target.value;
    setIsFiltering(input.length >= 3);

    const filtered = hunterPosts.filter((post) =>
      post.content.toLowerCase().includes(input.toLowerCase())
    );

    setFilteredPosts(filtered);
  };

  useEffect(() => {
    // checkIfSelf();
    fetchUserData();
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <FiLoader className="animate-spin text-3xl" />
      </div>
    );
  }

  return (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="pt-36 lg:pt-28 max-w-2xl mx-auto pb-32"
      >
        <div className="flex flex-col lg:flex-row ">
          <div className="flex gap-5">
            <Image
              src={`https://avatars.dicebear.com/api/bottts/${hunterData.username}.svg`}
              width={100}
              height={100}
              className="rounded-full border-4 border-primary p-2 border-opacity-10"
              alt="avatar"
            />
            <div className="flex flex-col justify-between">
              <div className="flex gap-2">
                <h1 className="text-2xl font-semibold">
                  @{hunterData.username}
                </h1>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm ">Follow</button>
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-5 lg:mt-0 lg:ml-10">
            <p className="text-lg lg:text-2xl">
              {hunterData.fullname.first} {hunterData.fullname.last}
            </p>
            <p className="text-sm opacity-30">{hunterData.email}</p>

            <div className="flex gap-5 mt-5">
              <p>
                <span className="font-bold text-primary">
                  {hunterPosts.length}
                </span>{" "}
                posts
              </p>
              <p>
                <span className="font-bold text-primary">
                  {hunterData.connections?.length}
                </span>{" "}
                connections
              </p>
            </div>
          </div>
        </div>

        {/* tabs */}
        <div className="grid grid-cols-2 mt-16">
          <div
            onClick={() => setTabSelected("posts")}
            className={`flex justify-center items-center border-b-4 py-3 cursor-pointer ${
              tabSelected === "posts" ? "border-primary" : "border-transparent"
            }`}
          >
            <p className="text-lg font-semibold">Posts</p>
          </div>
          <div
            onClick={() => setTabSelected("connections")}
            className={`flex justify-center items-center border-b-4 py-3 cursor-pointer ${
              tabSelected === "connections"
                ? "border-primary"
                : "border-transparent"
            }`}
          >
            <p className="text-lg font-semibold">Connections</p>
          </div>
        </div>

        {/* posts */}
        <AnimatePresence mode="wait">
          {tabSelected === "posts" && (
            <div>
              {hunterPosts.length < 1 && (
                <motion.div
                  variants={__PageTransition}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col justify-center items-center mt-10"
                >
                  <p className="text-lg font-semibold">No posts yet</p>
                </motion.div>
              )}

              <motion.div
                variants={__PageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                className=" mt-5 gap-5"
              >
                <div className="flex flex-col">
                  <p>Filter Post by content</p>
                  <div className="flex w-full gap-2">
                    <input
                      onChange={filterOptionsHandler}
                      className="input input-primary w-full"
                    />
                    <button className="btn btn-square btn-primary">
                      <FiFilter />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-5 mt-10">
                  {isFiltering === false
                    ? hunterPosts.map((post, index) => (
                        <FeedCard feedData={post} key={index} />
                      ))
                    : filteredPosts.map((post, index) => (
                        <FeedCard feedData={post} key={index} />
                      ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.main>
    </>
  );
};

export default HunterPage;
