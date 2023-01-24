import { useEffect, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";

import { FiEdit } from "react-icons/fi";
import Link from "next/link";
import ProtectedPageContainer from "@/components/ProtectedPageContainer";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { __PageTransition } from "../../lib/animation";
import { __supabase } from "../../supabase";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useSession } from "@supabase/auth-helpers-react";

const ProfilePage = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isBioEditing, setIsBioEditing] = useState(false);
  const router = useRouter();
  const session = useSession();

  // methods
  const fetchUserDetails = async () => {
    const { data, error } = await __supabase
      .from("user_hunters")
      .select("*")
      .eq("id", session.user?.id)
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }

    return data;
  };

  const fetchUserActivities = async () => {
    const { data, error } = await __supabase
      .from("public_posts")
      .select("id,content,createdAt,uploaderID")
      .eq("uploaderID", session.user?.id)
      .order("createdAt", { ascending: false })
      .limit(5);

    if (error) {
      console.log(error);
      return;
    }

    return data;
  };

  const fetchUserConnections = async () => {
    if (!!session) {
      const thisUserConnection = session.user.user_metadata.connections;
      const { data, error } = await __supabase
        .from("user_hunters")
        .select("id,email,full_name,username")
        .in("id", thisUserConnection);

      if (error) {
        console.log(error);
        return;
      }

      return data;
    }

    return [];
  };

  const fetchRecommendedUsers = async () => {
    if (!!session) {
      const thisUserConnections = session.user.user_metadata.connections;

      const reqString = `(${thisUserConnections.concat(session.user.id)})`;

      const { data, error } = await __supabase
        .from("recommended_hunters")
        .select("*")
        .filter("id", "not.in", reqString)
        .limit(5);

      if (error) {
        console.log(error);
        return;
      }

      return data;
    }

    return [];
  };

  const checkTheme = () => {
    const theme = window.localStorage.getItem("theme");

    if (theme === "dark") {
      setIsDark(true);
    } else {
      document.body.setAttribute("data-theme", "light");
      setIsDark(false);
    }
  };

  const toggleTheme = (e) => {
    document.body.setAttribute(
      "data-theme",
      e.target.checked ? "dark" : "light"
    );
    window.localStorage.setItem("theme", e.target.checked ? "dark" : "light");
    setIsDark(e.target.checked);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    toast.loading("Logging out...");

    const { error } = await __supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      toast.dismiss();
      toast.error("Failed to log out");
      return;
    }

    toast.dismiss();
    router.push("/login");
  };

  const userDetails = useQuery({
    queryKey: ["userDetails"],
    queryFn: fetchUserDetails,
    enabled: !!session,
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      console.info("✅ User Details Fetched");
    },
  });

  const [userConnections, recommendedUsers, userActivities] = useQueries({
    queries: [
      {
        queryKey: ["userConnections"],
        queryFn: fetchUserConnections,
        enabled: userDetails.isSuccess,
        onerror: (error) => {
          toast.error(error.message);
        },
        onSuccess: () => {
          console.info("✅ User Connections Fetched");
        },
      },
      {
        queryKey: ["recommendedUsers"],
        queryFn: fetchRecommendedUsers,
        enabled: userDetails.isSuccess,
        onError: (error) => {
          console.error(error);
        },
        onSuccess: () => {
          console.info("✅ Recommended Users Fetched");
        },
      },
      {
        queryKey: ["userActivities"],
        queryFn: fetchUserActivities,
        enabled: userDetails.isSuccess,
        onError: (error) => {
          toast.error(error.message);
        },
        onSuccess: (data) => {
          console.info("✅ User Activities Fetched");
        },
      },
    ],
  });

  useEffect(() => {
    checkTheme();
  }, []);

  return (
    <ProtectedPageContainer>
      {userDetails.isSuccess && (
        <>
          <motion.main
            variants={__PageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative min-h-screen w-full pt-24 pb-36"
          >
            <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <div className="col-span-3 flex flex-col gap-3">
                {/* landing profile */}
                <div className="flex flex-col bg-base-300 rounded-btn p-5">
                  <img
                    src={`https://avatars.dicebear.com/api/bottts/${userDetails.data.username}.svg`}
                    alt="avatar"
                    className="w-32 h-32 rounded-full bg-primary border-white border-2"
                  />
                  <p className="text-3xl font-bold">
                    {userDetails.data.full_name.first}{" "}
                    {userDetails.data.full_name.last}
                  </p>

                  <p className="font-semibold opacity-75">
                    @{userDetails.data.username}
                  </p>
                  <p>
                    Joined at:{" "}
                    <span className="opacity-50">
                      {dayjs(session.user?.created_at).format("MMMM DD, YYYY")}
                    </span>
                  </p>
                </div>
                {/* bio */}
                <div className="flex flex-col border-2 border-base-content border-opacity-30 rounded-btn p-5 gap-3">
                  <div className="flex justify-between items-start">
                    <p className="text-2xl font-bold">Bio</p>
                    <button
                      onClick={() => setIsBioEditing(!isBioEditing)}
                      className="btn btn-ghost btn-sm"
                    >
                      <FiEdit />
                    </button>
                  </div>
                  {!isBioEditing ? (
                    <ReactMarkdown className="prose">
                      {userDetails.data.bio ||
                        "This user has not added a bio yet"}
                    </ReactMarkdown>
                  ) : (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();

                        let thisBio = e.target.bio.value;

                        const { error } = await __supabase
                          .from("user_hunters")
                          .update({
                            bio: thisBio,
                          })
                          .eq("id", session.user.id);

                        if (error) {
                          console.error(error);
                          toast.error(error.message);
                          return;
                        }

                        thisBio = "";
                        toast.success("Bio updated successfully");
                        setIsBioEditing(false);
                        userDetails.refetch();
                      }}
                    >
                      <textarea
                        className="textarea textarea-bordered w-full font-mono"
                        placeholder="Add a bio"
                        defaultValue={userDetails.data.bio}
                        name="bio"
                      />
                      <button type="submit" className="btn btn-primary mt-3">
                        Save
                      </button>
                    </form>
                  )}
                </div>
                {/* skills */}
                <div className="flex flex-col border-2 border-base-content border-opacity-30 rounded-btn p-5 gap-3">
                  <p className="text-2xl font-bold">Skillsets</p>
                  <div className="flex flex-col">
                    <h4 className="text-lg font-semibold">Primary Skill</h4>
                    <p className="badge badge-primary">
                      {userDetails.data.skill_primary}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-lg font-semibold">Secondary Skills</h4>
                    <p className="flex flex-wrap gap-4">
                      {userDetails.data.skill_secondary.map((skill, index) => (
                        <span
                          key={`secondaryskill_${index}`}
                          className="badge badge-accent"
                        >
                          {skill}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
                {/* residence */}
                <div className="flex flex-col border-2 border-base-content border-opacity-30 rounded-btn p-5 gap-3">
                  <p className="text-2xl font-bold">Residence</p>
                  <div className="flex flex-col ">
                    <h4 className="text-lg font-semibold">Address</h4>
                    <p>{userDetails.data.address.address}</p>
                    <h4 className="text-lg font-semibold mt-3">
                      City of Residence
                    </h4>
                    <p className="badge badge-accent">
                      {userDetails.data.address.city}
                    </p>
                  </div>
                </div>
                {/* activity */}
                <div className="flex flex-col border-2 border-base-content border-opacity-30 rounded-btn p-5 gap-3">
                  <p className="text-2xl font-bold">Recent Activities</p>
                  <div className="flex flex-col gap-2">
                    {!!userActivities &&
                      !userActivities.isLoading &&
                      userActivities.data.map((activity, index) => (
                        <div
                          key={`activity_${index}`}
                          className="flex gap-2 items-center justify-between p-3 bg-base-200 rounded-btn"
                        >
                          <div>
                            <ReactMarkdown>
                              {activity.content.substring(0, 50)}
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
              </div>
              <div className="col-span-2 flex flex-col gap-5">
                <div className="flex flex-col rounded-btn p-2 gap-3">
                  <p className="text-2xl font-bold">Your Connections</p>

                  {userConnections.isLoading && (
                    <div className="flex flex-col gap-2">
                      {Array(5)
                        .fill()
                        .map((_, index) => (
                          <div
                            key={`connectionloading_${index}`}
                            className="h-[72px] w-full bg-base-300 rounded-btn animate-pulse"
                          />
                        ))}
                    </div>
                  )}

                  {!userConnections.isLoading &&
                  userConnections.isSuccess &&
                  userConnections.data.length ? (
                    <p>
                      Looks like you have not connected to other people right
                      now. Add people to your connections to see their posts and
                      activities.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {userConnections.isSuccess &&
                        userConnections.data
                          .slice(0, 3)
                          .map((connection, index) => (
                            <Link
                              href={`/h/${connection.username}`}
                              key={`connection_${index}`}
                              className="flex gap-2 items-center justify-between p-3 bg-base-200 hover:bg-base-300 transition-all rounded-btn"
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
                            </Link>
                          ))}
                      <Link
                        href={`/h/me/connections`}
                        className="link mt-2 text-center"
                      >
                        See all your connections
                      </Link>
                    </div>
                  )}
                </div>
                <div className="flex flex-col rounded-btn p-2 gap-3">
                  <p className="text-2xl font-bold">Suggested Connections</p>

                  {recommendedUsers.isLoading && (
                    <div className="flex flex-col gap-2">
                      {Array(5)
                        .fill()
                        .map((_, index) => (
                          <div
                            key={`recommendedloading_${index}`}
                            className="h-[72px] w-full bg-base-300 rounded-btn animate-pulse"
                          />
                        ))}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    {recommendedUsers.isSuccess &&
                    recommendedUsers.data.length < 1 ? (
                      <p>
                        Looks like you have not connected to other people right
                        now. Add people to your connections to see their posts
                        and activities.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {recommendedUsers.isSuccess &&
                          recommendedUsers.data.map((thisUser, index) => (
                            <div
                              key={`connection_${index}`}
                              className="flex gap-2 items-center justify-between p-3 bg-base-200 rounded-btn"
                            >
                              <div className="flex gap-2 items-center">
                                <img
                                  src={`https://avatars.dicebear.com/api/bottts/${thisUser.username}.svg`}
                                  alt="avatar"
                                  className="w-12 h-12 rounded-full bg-primary "
                                />
                                <div>
                                  <p className="font-bold leading-none">
                                    {thisUser.full_name.first}{" "}
                                    {thisUser.full_name.last}
                                  </p>
                                  <p className="opacity-50 leading-none">
                                    @{thisUser.username}
                                  </p>
                                </div>
                              </div>
                              <Link
                                href={`/h/${thisUser.username}`}
                                className="btn btn-sm btn-primary"
                              >
                                See Profile
                              </Link>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="divider" />
                <div className="flex flex-col rounded-btn p-2 gap-5">
                  <label className="flex items-center justify-between">
                    <span>Dark Mode</span>
                    <input
                      type="checkbox"
                      className="toggle"
                      checked={isDark}
                      onChange={toggleTheme}
                    />
                  </label>
                  <label
                    htmlFor="signoutmodal"
                    className="btn btn-error w-full"
                  >
                    Sign out session
                  </label>
                </div>
              </div>
            </section>
          </motion.main>

          {/* sign out modal */}
          <input type="checkbox" id="signoutmodal" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                Are you sure you want to sign out?
              </h3>
              <p className="py-4">
                You will be signed out of all your devices. You can sign back in
                anytime.
              </p>
              <div className="modal-action">
                <label htmlFor="signoutmodal" className="btn">
                  Cancel
                </label>
                <button
                  className="btn btn-error"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </ProtectedPageContainer>
  );
};

export default ProfilePage;
