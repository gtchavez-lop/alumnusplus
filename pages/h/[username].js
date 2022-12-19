import { useEffect, useState } from "react";

import FeedCard from "../../components/Feed/FeedCard";
import { FiLoader } from "react-icons/fi";
import Image from "next/image";
import { __PageTransition } from "../../lib/animation";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export const getServerSideProps = async (context) => {
  const { username } = context.params;
  const __supabase = useSupabaseClient();

  let { data, error } = await __supabase
    .rpc("gethunterbyusername", {
      username_input: username,
    })
    .single();

  if (error) return { props: { error: error.message } };

  return {
    props: {
      hunterData: data,
    },
  };
};

const HunterPage = ({ hunterData, error: hunterDataError }) => {
  const router = useRouter();

  const [hunterPosts, setHunterPosts] = useState([]);
  const [tabSelected, setTabSelected] = useState("posts");

  const checkIfHasUser = async () => {
    const {
      data: { user },
    } = await __supabase.auth.getUser();

    if (!user) {
      router.push("/login");
    }
  };

  useEffect(() => {
    checkIfHasUser();
  }, []);

  const {
    address,
    birthdate,
    birthplace,
    connections,
    createdAt,
    education,
    email,
    gender,
    id,
    fullname,
    phone,
    skillPrimary,
    skillSecondary,
    socialMediaLinks,
    type,
    updatedAt,
    username,
    savedJobs,
  } = hunterData;

  const fetchHunterPosts = async () => {
    let { data, error } = await __supabase.rpc("gethunterpostsbyid", {
      id_input: id,
    });

    if (error) {
      console.log(error);
      return;
    }

    setHunterPosts(data);
  };

  useEffect(() => {
    fetchHunterPosts();
  }, []);

  if (!hunterData) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center">
        <FiLoader className="animate-spin text-xl" />
      </main>
    );
  }

  if (hunterDataError) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center">
        <p>Something went wrong. Please try again later</p>
      </main>
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
                <h1 className="text-2xl font-semibold">@{username}</h1>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm ">Follow</button>
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-5 lg:mt-0 lg:ml-10">
            <p className="text-lg lg:text-2xl">
              {fullname.first} {fullname.last}
            </p>
            <p className="text-sm opacity-30">{email}</p>

            <div className="flex gap-5 mt-5">
              <p>
                <span className="font-bold text-primary">{0}</span> posts
              </p>
              <p>
                <span className="font-bold text-primary">
                  {connections?.length}
                </span>{" "}
                connections
              </p>
            </div>
          </div>
        </div>

        {/* tabs */}
        <div className="tabs tabs-boxed justify-center flex lg:gap-2 mt-10">
          <button
            onClick={(e) => setTabSelected("posts")}
            className={`tab ${tabSelected === "posts" && "tab-active"}`}
          >
            Posts
          </button>
          <button
            onClick={(e) => setTabSelected("connections")}
            className={`tab ${tabSelected === "connections" && "tab-active"}`}
          >
            Connections
          </button>
        </div>

        {/* tab content */}
        <div className="mt-10">
          {tabSelected === "posts" && (
            <div className="flex flex-col gap-5">
              {hunterPosts.map((post, index) => (
                <FeedCard key={post.id} index={index} feedData={post} />
              ))}
            </div>
          )}

          {tabSelected === "connections" && (
            <div className="flex flex-col gap-5">
              <p>
                Under construction. Please check back later. Thank you for your
                patience.
              </p>
            </div>
          )}
        </div>
      </motion.main>
    </>
  );
};

export default HunterPage;
