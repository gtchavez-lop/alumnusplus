import { useEffect, useState } from "react";

import FeedCard from "../../components/Feed/FeedCard";
import { FiLoader } from "react-icons/fi";
import Image from "next/image";
import { __PageTransition } from "../../lib/animation";
// import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { __supabase } from "../../supabase";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useLocalStorage from "../../lib/localStorageHook";
import { useRouter } from "next/router";

export const getServerSideProps = async (context) => {
  const { id } = context.query;

  const { data, error } = await __supabase
    .from("user_hunters")
    .select("*")
    .eq("id", id)
    .single();

  console.log(data);

  if (error) {
    console.log(error);
    return {
      props: {},
    };
  }

  return {
    props: {
      hunter_data: data,
    },
  };
};

const HunterPage = ({ hunter_data }) => {
  const router = useRouter();

  const [hunterPosts, setHunterPosts] = useState([]);
  const [tabSelected, setTabSelected] = useState("posts");
  const [loaded, setLoaded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [authState, setAuthState] = useLocalStorage("authState");
  // const __supabase = useSupabaseClient();

  const fetchHunterPosts = async () => {
    const { data, error } = await __supabase
      .from("hunt_blog")
      .select("*")
      .eq("uploaderID", hunter_data.id);

    if (error) {
      toast.error(error.message);
    } else {
      console.log(data);
      setHunterPosts(data);
      setLoaded(true);
    }
  };

  const addUserToConnection = async () => {
    const oldConnections = authState.user_metadata.connections;
    const newConnections = [...oldConnections, hunter_data.id];

    // update user_metadata
    const { error: localUserError } = await __supabase.auth.updateUser({
      data: {
        connections: newConnections,
      },
    });

    if (localUserError) {
      toast.error("Something went wrong. Please try again later.");
      return;
    }

    // update hunter_metadata
    const { error: remoteUserError } = await __supabase
      .from("user_hunters")
      .update({
        connections: newConnections,
      })
      .eq("id", authState.id);

    if (remoteUserError) {
      toast.error("Something went wrong. Please try again later.");
      return;
    }

    setIsFollowing(true);
    toast.dismiss();
    toast.success("Added to connections");
  };

  const removeUserFromConnection = async () => {
    const {
      data: { user },
    } = await __supabase.auth.getUser();

    const oldConnections = user.user_metadata.connections;
    const newConnections = oldConnections.filter(
      (connection) => connection !== hunter_data.id
    );

    // update user_metadata
    const { error: localUserError } = await __supabase.auth.updateUser({
      data: {
        connections: newConnections,
      },
    });

    if (localUserError) {
      toast.error("Something went wrong. Please try again later.");
      return;
    }

    // update hunter_metadata
    const { error: remoteUserError } = await __supabase
      .from("user_hunters")
      .update({
        connections: newConnections,
      })
      .eq("id", user.id);

    if (remoteUserError) {
      toast.error("Something went wrong. Please try again later.");
      return;
    }

    setIsFollowing(false);
    toast.dismiss();
    toast.success("Removed from connections");
  };

  const checkForConnection = async () => {
    const {
      data: { user },
    } = await __supabase.auth.getUser();

    const isFollowing = user.user_metadata.connections.includes(hunter_data.id);

    setIsFollowing(isFollowing);
    fetchHunterPosts();
  };

  useEffect(() => {
    checkForConnection();
  }, []);

  if (!hunter_data) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center">
        <FiLoader className="animate-spin text-xl" />
      </main>
    );
  }

  return (
    hunter_data && (
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
                src={`https://avatars.dicebear.com/api/bottts/${hunter_data.username}.svg`}
                width={100}
                height={100}
                className="rounded-full border-4 border-primary p-2 border-opacity-10"
                alt="avatar"
              />
              <div className="flex flex-col justify-between">
                <div className="flex gap-2">
                  <h1 className="text-2xl font-semibold">
                    @{hunter_data.username}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={
                      isFollowing
                        ? () => {
                            toast.loading("Removing to Connections");
                            removeUserFromConnection();
                          }
                        : () => {
                            toast.loading("Adding to connections");
                            addUserToConnection();
                          }
                    }
                    className="btn btn-primary btn-sm "
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col mt-5 lg:mt-0 lg:ml-10">
              <p className="text-lg lg:text-2xl">
                {hunter_data.fullName.first} {hunter_data.fullName.last}
              </p>
              <p className="text-sm opacity-30">{hunter_data.email}</p>

              <div className="flex gap-5 mt-5">
                <p>
                  <span className="font-bold text-primary">
                    {hunterPosts.length}
                  </span>{" "}
                  posts
                </p>
                <p>
                  <span className="font-bold text-primary">
                    {hunter_data.connections?.length}
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
            <button
              onClick={(e) => setTabSelected("details")}
              className={`tab ${tabSelected === "details" && "tab-active"}`}
            >
              Profile Details
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
                  Under construction. Please check back later. Thank you for
                  your patience.
                </p>
              </div>
            )}

            {tabSelected === "details" && (
              <div className="flex flex-col border-2 border-primary-content rounded-btn">
                <div className="flex flex-col gap-2 p-5">
                  <p className="text-xl font-bold text-primary">
                    General Information
                  </p>
                  <p className="flex justify-between ml-5">
                    <span className="font-bold">Full Name: </span>
                    <span>
                      {hunter_data.fullName.first} {hunter_data.fullName.last}
                    </span>
                  </p>
                  <p className="flex justify-between ml-5">
                    <span className="font-bold">Gender:</span>
                    <span>{hunter_data.gender.toUpperCase()}</span>
                  </p>
                  <p className="flex justify-between ml-5">
                    <span className="font-bold">Date of Birth: </span>
                    <span>
                      {dayjs(hunter_data.birthdate).format("MMMM D, YYYY")}
                    </span>
                  </p>
                  <p className="flex justify-between ml-5">
                    <span className="font-bold">Address: </span>
                    <span className="text-right max-w-md">
                      {hunter_data.address.address}, {hunter_data.address.city}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 p-5 border-t-2 border-primary-content">
                  <p className="text-xl font-bold text-primary">
                    Account Information
                  </p>
                  <p className="flex justify-between ml-5">
                    <span className="font-bold">Email: </span>
                    <span>{hunter_data.email}</span>
                  </p>
                  <p className="flex justify-between ml-5">
                    <span className="font-bold">Username: </span>
                    <span>{hunter_data.username}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 p-5 border-t-2 border-primary-content">
                  <p className="text-xl font-bold text-primary">
                    Skillset Information
                  </p>
                  <p className="flex justify-between ml-5">
                    <span className="font-bold">Primary Skill: </span>
                    <span>{hunter_data.skillPrimary}</span>
                  </p>
                  <p className="flex justify-between ml-5">
                    <span className="font-bold">Secondary Skill: </span>
                    <span className="flex flex-col text-right">
                      {hunter_data.skillSecondary?.map((skill, index) => (
                        <span key={index}>{skill}</span>
                      ))}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 p-5 border-t-2 border-primary-content">
                  <p className="text-xl font-bold text-primary">Social Links</p>
                  {/* <p className="flex justify-between ml-5">
                    <span className="font-bold">Facebook: </span>
                    <span>{hunter_data.socialLinks.facebook}</span>
                  </p> */}
                </div>
              </div>
            )}
          </div>
        </motion.main>
      </>
    )
  );
};

export default HunterPage;
