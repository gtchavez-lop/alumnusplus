import { useEffect, useReducer, useState } from "react";

import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { __PageTransition } from "../../lib/animation";
import { __supabase } from "../../supabase";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import useLocalStorage from "../../lib/localStorageHook";
import { useRouter } from "next/router";

export const getServerSideProps = async (context) => {
  const { username } = context.params;

  const { data, error } = await __supabase
    .from("user_hunters")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    return {
      props: {
        notfound: true,
      },
    };
  }

  return {
    props: {
      user: data,
    },
  };
};

// {
//   address: {
//     address: 'Bagong Silang ',
//     city: 'Caloocan City',
//     postalCode: '1428'
//   },
//   birthdate: '1999-06-27',
//   birthplace: 'Quezon City ',
//   connections: [],
//   createdAt: '2023-01-11T02:44:43.030613',
//   education: [],
//   email: 'napoto.gabrielle.bscs2019@gmail.com',
//   gender: 'female',
//   id: 'dc078f30-24ed-4874-8ada-8a68f4252b7a',
//   fullName: { first: 'Gabrielle ', last: 'Napoto', middle: 'Domingo ' },
//   phone: null,
//   skillPrimary: 'Art',
//   skillSecondary: [ 'Programming', 'Communication', 'Project Management', 'Research' ],
//   socialMediaLinks: null,
//   type: 'hunter',
//   updatedAt: '2023-01-11T02:44:43.030613',
//   username: 'AbieG',
//   savedJobs: []
// }

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

const UserPage = ({ user, notfound }) => {
  const router = useRouter();
  const [authState, setAuthState] = useLocalStorage("authState");
  const [states, stateDispatcher] = useReducer(reducer, {
    userPosts: [],
    userConnections: [],
    postsLoading: true,
    connectionsLoading: true,
    isConnected: false,
  });

  const fetchUserActivities = async () => {
    const { data, error } = await __supabase
      .from("public_posts")
      .select("*")
      .eq("uploaderID", user.id)
      .order("createdAt", { ascending: false });

    if (error) {
      console.log(error);
    }

    stateDispatcher({
      type: ACTIONS.SET_USER_POSTS,
      payload: data,
    });
    stateDispatcher({
      type: ACTIONS.SET_POSTS_LOADING,
      payload: false,
    });

    console.log("User Activities:", true);
  };

  const fetchUserConnections = async () => {
    const localConnections = user.connections || [];

    if (localConnections.length === 0) {
      console.warn(
        "User Connections cannot be fetch because the user does not have one"
      );
      stateDispatcher({
        type: ACTIONS.SET_CONNECTIONS_LOADING,
        payload: false,
      });
      return;
    }

    const { data, error } = await __supabase
      .from("user_hunters")
      .select("id, username, fullName")
      .in("id", localConnections);

    if (error) {
      console.log(error);
    }

    stateDispatcher({
      type: ACTIONS.SET_USER_CONNECTIONS,
      payload: data,
    });
    stateDispatcher({
      type: ACTIONS.SET_CONNECTIONS_LOADING,
      payload: false,
    });
    console.log("User Connections:", true);
  };

  const checkIfConnected = async () => {
    const localConnections = authState.user_metadata.connections || [];

    if (localConnections.length === 0) {
      console.warn(
        "User Connections cannot be fetch because the user does not have one"
      );
      return;
    }

    // check if the current user is connected to this user
    let isConnected = localConnections.includes(user.id);

    stateDispatcher({
      type: ACTIONS.SET_IS_CONNECTED,
      payload: isConnected,
    });
  };

  if (notfound) {
    router.push("/");
  }

  useEffect(() => {
    if (user) {
      fetchUserActivities();
      fetchUserConnections();
      checkIfConnected();
    }
  }, [user]);

  const addToConnections = async () => {
    toast.loading("Adding connection...");

    // new connections array
    const newConnections = [...authState.user_metadata.connections, user.id];

    // update the user table
    const { error } = await __supabase
      .from("user_hunters")
      .update({
        connections: newConnections,
      })
      .eq("id", authState.id);

    if (error) {
      toast.dismiss();
      toast.error("Something went wrong");
      console.log(error);
    }

    // update the local storage
    setAuthState({
      ...authState,
      user_metadata: {
        ...authState.user_metadata,
        connections: newConnections,
      },
    });

    // update the supabase user
    await __supabase.auth.updateUser({
      data: {
        ...authState.user_metadata,
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

    const newConnections = authState.user_metadata.connections.filter(
      (connection) => connection !== user.id
    );

    const { error } = await __supabase
      .from("user_hunters")
      .update({
        connections: newConnections,
      })
      .eq("id", authState.id);

    if (error) {
      toast.dismiss();
      toast.error("Something went wrong");
      console.log(error);
    }

    // update the local storage
    setAuthState({
      ...authState,
      user_metadata: {
        ...authState.user_metadata,
        connections: newConnections,
      },
    });

    // update the supabase user
    await __supabase.auth.updateUser({
      data: {
        ...authState.user_metadata,
        connections: newConnections,
      },
    });

    // update the state
    stateDispatcher({
      type: ACTIONS.SET_IS_CONNECTED,
      payload: false,
    });

    toast.dismiss();
    toast.success("Connection removed");
  };

  return (
    user && (
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
            <div className="p-5 bg-base-300 rounded-btn">
              <img
                src={`https://avatars.dicebear.com/api/bottts/${
                  user.username || "default"
                }.svg`}
                alt="avatar"
                className="w-32 h-32 rounded-full bg-primary border-white border-2"
              />
              <p className="text-3xl font-bold">
                {user.fullName.first} {user.fullName.middle}{" "}
                {user.fullName.last}
              </p>

              <p className="font-semibold opacity-75">@{user.username}</p>
              <p>
                Joined at:{" "}
                <span className="opacity-50">
                  {dayjs(user.createdAt || new Date().toISOString()).format(
                    "MMMM DD, YYYY"
                  )}
                </span>
              </p>

              {states.isConnected ? (
                <div
                  onClick={removeFromConnections}
                  className="btn btn-warning mt-5"
                >
                  Remove from connections
                </div>
              ) : (
                <div
                  onClick={addToConnections}
                  className="btn btn-primary mt-5"
                >
                  Add to connections
                </div>
              )}
            </div>
            <div className="p-5 border-2 border-base-content rounded-btn border-opacity-50 flex flex-col gap-2">
              <p className="text-2xl font-bold mb-4">Bio</p>
              <ReactMarkdown className="prose">
                {user.bio || "This user has not added a bio yet"}
              </ReactMarkdown>
            </div>
            <div className="p-5 border-2 border-base-content rounded-btn border-opacity-50 flex flex-col gap-2">
              <p className="text-2xl font-bold mb-4">Skillsets</p>
              <div>
                <p className="font-semibold">Primary Skill</p>
                <p className="flex gap-2 gap-y-1 flex-wrap">
                  <span className="badge badge-primary">
                    {user.skillPrimary}
                  </span>
                </p>
              </div>
              <div>
                <p className="font-semibold">Secondary Skillsets</p>
                <p className="flex gap-2 gap-y-1 flex-wrap">
                  {user.skillSecondary.map((skill, index) => (
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
              <p className="text-2xl font-bold mb-5">About</p>
              <div>
                <p className="font-semibold">Birthday</p>
                <p className="opacity-50">
                  {dayjs(user.birthdate || new Date().toISOString()).format(
                    "MMMM DD, YYYY"
                  )}
                </p>
              </div>
              <div>
                <p className="font-semibold">Location</p>
                <p className="opacity-50">
                  {user.address.address}, {user.address.city}
                </p>
              </div>
            </div>
            <div className="p-5 border-2 border-base-content rounded-btn border-opacity-50 flex flex-col gap-2">
              <p className="text-2xl font-bold">Activities</p>
              {states.postsLoading &&
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={`postloading-${i}`}
                      className="w-full h-[72px] bg-base-200 animate-pulse"
                    />
                  ))}

              {!states.postsLoading && states.userPosts.length === 0 && (
                <p className="text-center opacity-50">No activities yet</p>
              )}

              {!states.postsLoading &&
                states.userPosts.map((activity, index) => (
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

              {states.connectionsLoading &&
                Array(3)
                  .fill()
                  .map((_, i) => (
                    <div
                      key={`connectionloading-${i}`}
                      className="w-full h-[72px] bg-base-200 animate-pulse"
                    />
                  ))}
              {!states.connectionsLoading &&
                states.userConnections.length === 0 && (
                  <p className="text-center opacity-50">No connections yet</p>
                )}

              {!states.connectionsLoading &&
                states.userConnections.map((connection, index) => (
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
                          {connection.fullName.first} {connection.fullName.last}
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
            </div>
          </div>
        </motion.main>
      </>
    )
  );
};
export default UserPage;
