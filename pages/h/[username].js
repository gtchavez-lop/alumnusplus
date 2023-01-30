import { useEffect, useReducer, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useSession, useUser } from "@supabase/auth-helpers-react";

import Link from "next/link";
// import ProtectedPageContainer from "@/components/ProtectedPageContainer";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { __PageTransition } from "@/lib/animation";
import { __supabase } from "@/supabase";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const ProtectedPageContainer = dynamic(
  () => import("@/components/ProtectedPageContainer"),
  { ssr: false }
);

const ACTIONS = {
  SET_USER_POSTS: "set-user-posts",
  SET_USER_CONNECTIONS: "set-user-connections",
  SET_POSTS_LOADING: "set-posts-loading",
  SET_CONNECTIONS_LOADING: "set-connections-loading",
  SET_IS_CONNECTED: "set-is-connected",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER_POSTS:
      return { ...state, userPosts: action.payload };
    case ACTIONS.SET_USER_CONNECTIONS:
      return { ...state, userConnections: action.payload };
    case ACTIONS.SET_POSTS_LOADING:
      return { ...state, postsLoading: action.payload };
    case ACTIONS.SET_CONNECTIONS_LOADING:
      return { ...state, connectionsLoading: action.payload };
    case ACTIONS.SET_IS_CONNECTED:
      return { ...state, isConnected: action.payload };
    default:
      return state;
  }
};

const UserPage = ({ notfound }) => {
  const router = useRouter();
  const { username } = router.query;
  const session = useSession();
  const sessionUser = useUser();
  const [states, stateDispatcher] = useReducer(reducer, {
    userPosts: [],
    userConnections: [],
    postsLoading: true,
    connectionsLoading: true,
    isConnected: false,
  });

  // methods
  const fetchUser = async () => {
    const { data, error } = await __supabase
      .from("user_hunters")
      .select("*")
      .eq("username", username)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    return data;
  };

  const user = useQuery({
    queryKey: ["user", username],
    queryFn: fetchUser,
    enabled: !!username,
    onSuccess: (data) => {
      if (!!sessionUser.user) {
        const isConnected = sessionUser.user_metadata.connections.includes(
          data.id
        );

        stateDispatcher({
          type: ACTIONS.SET_IS_CONNECTED,
          payload: isConnected,
        });
      }
    },
  });

  const fetchUserPosts = async () => {
    const { data, error } = await __supabase
      .from("public_posts")
      .select("id,content")
      .eq("uploader", user.data.id);

    if (error) {
      console.log(error);
      return;
    }

    return data;
  };

  const fetchUserConnections = async () => {
    const localConnections = user.connections ? user.connections : [];

    const { data, error } = await __supabase
      .from("user_hunters")
      .select("id,full_name,username")
      .in("id", localConnections);

    if (error) {
      console.log(error);
      return;
    }

    return data;
  };

  const [userPosts, userConnections] = useQueries({
    queries: [
      {
        queryKey: ["user-posts"],
        queryFn: fetchUserPosts,
        enabled: !!user.isSuccess && !!username,
        onSuccess: () => {
          console.log("User Posts Fetched");
        },
        onError: (error) => {
          console.log(error);
        },
      },
      {
        queryKey: ["user-connections"],
        queryFn: fetchUserConnections,
        enabled: !!user.isSuccess && !!username,
        onSuccess: () => {
          console.log("User Connections Fetched");
        },
        onError: (error) => {
          console.log(error);
        },
      },
    ],
  });

  const addToConnections = async () => {
    toast.loading("Adding connection...");

    // new connections array
    const newConnections = [...session.user.user_metadata.connections, user.id];

    // update the user table
    const { error } = await __supabase
      .from("user_hunters")
      .update({
        connections: newConnections,
      })
      .eq("id", session.user.id);

    if (error) {
      toast.dismiss();
      toast.error("Something went wrong");
      console.log(error);
      return;
    }

    // update the supabase user
    await __supabase.auth.updateUser({
      data: {
        ...session.user.user_metadata,
        connections: newConnections,
      },
    });

    // update the state
    stateDispatcher({
      type: ACTIONS.SET_IS_CONNECTED,
      payload: true,
    });

    toast.dismiss();
    toast.success("Connection added");
  };

  const removeFromConnections = async () => {
    toast.loading("Removing connection...");

    const newConnections = session.user.user_metadata.connections.filter(
      (connection) => connection !== user.id
    );

    const { error } = await __supabase
      .from("user_hunters")
      .update({
        connections: newConnections,
      })
      .eq("id", session.user.id);

    if (error) {
      toast.dismiss();
      toast.error("Something went wrong");
      console.log(error);
      return;
    }

    // update the supabase user
    await __supabase.auth.updateUser({
      data: {
        ...session.user.user_metadata,
        connections: newConnections,
      },
    });

    // update the session
    await __supabase.auth.setSession({});

    // update the state
    stateDispatcher({
      type: ACTIONS.SET_IS_CONNECTED,
      payload: false,
    });

    toast.dismiss();
    toast.success("Connection removed");
  };

  return (
    <>
      <ProtectedPageContainer>
        {!!user.isSuccess && (
          <>
            <motion.main
              variants={__PageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="pt-24 pb-32 grid grid-cols-1 lg:grid-cols-5 gap-5"
            >
              <div className="col-span-full lg:col-span-3 flex flex-col gap-5">
                {/* profile landing */}
                <div className="p-5 bg-base-300 rounded-btn flex items-center gap-5">
                  <img
                    src={`https://avatars.dicebear.com/api/bottts/${
                      user.data.username || "default"
                    }.svg`}
                    alt="avatar"
                    className="w-32 h-32 bg-primary mask mask-squircle p-2"
                  />
                  <div>
                    <p className="text-3xl font-bold">
                      {user.data.full_name.first} {user.data.full_name.middle}{" "}
                      {user.data.full_name.last}
                    </p>

                    <p className="font-semibold opacity-75">
                      @{user.data.username}
                    </p>
                    <p>
                      Joined at:{" "}
                      <span className="opacity-50">
                        {dayjs(
                          user.data.createdAt || new Date().toISOString()
                        ).format("MMMM DD, YYYY")}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="p-5 border-2 border-base-content rounded-btn border-opacity-50 flex flex-col gap-2">
                  <p className="text-2xl font-bold mb-4 text-primary">Bio</p>
                  <ReactMarkdown className="prose">
                    {user.data.bio || "This user has not added a bio yet"}
                  </ReactMarkdown>
                </div>
                <div className="p-5 border-2 border-base-content rounded-btn border-opacity-50 flex flex-col gap-2">
                  <p className="text-2xl font-bold mb-4 text-primary">
                    Skillsets
                  </p>
                  <div>
                    <p className="font-semibold">Primary Skill</p>
                    <p className="flex gap-2 gap-y-1 flex-wrap">
                      <span className="badge badge-primary">
                        {user.data.skill_primary}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Secondary Skillsets</p>
                    <p className="flex gap-2 gap-y-1 flex-wrap">
                      {user.data.skill_secondary.map((skill, index) => (
                        <span
                          className="badge badge-secondary"
                          key={`skill_${index}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
                <div className="p-5 border-2 border-base-content rounded-btn border-opacity-50 flex flex-col gap-2">
                  <p className="text-2xl font-bold mb-4 text-primary">About</p>
                  <div>
                    <p className="font-semibold">Birthday</p>
                    <p className="opacity-50">
                      {dayjs(
                        user.data.birthdate || new Date().toISOString()
                      ).format("MMMM DD, YYYY")}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="opacity-50">
                      {user.data.address.address}, {user.data.address.city}
                    </p>
                  </div>
                </div>
                <div className="p-5 border-2 border-base-content rounded-btn border-opacity-50 flex flex-col gap-2">
                  <p className="text-2xl font-bold mb-4 text-primary">
                    Activities
                  </p>
                  {!!userPosts.isLoading &&
                    Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={`postloading-${i}`}
                          className="w-full h-[72px] bg-base-200 animate-pulse"
                        />
                      ))}

                  {!!userPosts.isSuccess && userPosts.data.length < 1 && (
                    <p className="text-center opacity-50">No activities yet</p>
                  )}

                  {!!userPosts.isSuccess &&
                    userPosts.data.length > 0 &&
                    userPosts.data.map((activity, index) => (
                      <div
                        key={`activity_${index}`}
                        className="flex gap-2 items-center justify-between p-3 bg-base-200 rounded-btn"
                      >
                        <div>
                          <ReactMarkdown className="prose prose-sm prose-headings:text-lg">
                            {activity.content.substring(0, 30)}
                          </ReactMarkdown>
                        </div>
                        <Link
                          href={`/h/feed/${activity.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          See more
                        </Link>
                      </div>
                    ))}
                </div>
              </div>
              <div className="col-span-full lg:col-span-2 flex flex-col gap-5">
                <div className="p-5">
                  <p className="text-2xl font-bold mb-2">Connections</p>

                  {!!userConnections.isLoading &&
                    Array(3)
                      .fill()
                      .map((_, i) => (
                        <div
                          key={`connectionloading-${i}`}
                          className="w-full h-[72px] bg-base-200 animate-pulse"
                        />
                      ))}
                  {!!userConnections.isSuccess &&
                    userConnections.data.length < 1 && (
                      <p className="text-center opacity-50">
                        No connections yet
                      </p>
                    )}

                  {!!userConnections.isSuccess &&
                    userConnections.data.length > 0 &&
                    userConnections.data.map((connection, index) => (
                      <div
                        key={`connection_${index}`}
                        className="flex gap-2 items-center justify-between p-3 bg-base-200 rounded-btn"
                      >
                        <div className="flex gap-2 items-center">
                          <img
                            src={`https://avatars.dicebear.com/api/bottts/${connection.username}.svg`}
                            alt="avatar"
                            className="w-12 h-12 rounded-full bg-primary "
                          />
                          <div>
                            <p className="font-bold leading-none">
                              {connection.full_name.first}{" "}
                              {connection.full_name.last}
                            </p>
                            <p className="opacity-50 leading-none">
                              @{connection.username}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/h/${connection.username}`}
                          className="btn btn-sm btn-primary"
                        >
                          See Profile
                        </Link>
                      </div>
                    ))}
                </div>
                <div className="p-5">
                  <p className="text-2xl font-bold">Actions</p>

                  <div className="flex gap-2 mt-4">
                    {states.isConnected ? (
                      <div
                        onClick={removeFromConnections}
                        className="btn btn-warning"
                      >
                        Remove from connections
                      </div>
                    ) : (
                      <div
                        onClick={addToConnections}
                        className="btn btn-primary"
                      >
                        Add @{user.data.username} to your connections
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.main>
          </>
        )}
      </ProtectedPageContainer>
    </>
  );
};
export default UserPage;
