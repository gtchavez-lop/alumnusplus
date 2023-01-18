import { useEffect, useState } from "react";

import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { __PageTransition } from "../../lib/animation";
import { __supabase } from "../../supabase";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import useLocalStorage from "../../lib/localStorageHook";
import { useRouter } from "next/router";

const ProfilePage = () => {
  const [authState, setAuthState] = useLocalStorage("authState");
  const [hasUser, setHasUser] = useState(false);
  const [userActivities, setUserActivities] = useState([]);
  const [userConnections, setUserConnections] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [connectionsLoading, setConnectionsLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();

  const fetchUserActivities = async () => {
    const { data, error } = await __supabase
      .from("public_posts")
      .select("id,content,createdAt,uploaderID")
      .eq("uploaderID", authState?.id)
      .order("createdAt", { ascending: false })
      .limit(5);

    if (error) {
      toast.error(error.message);
      return;
    }

    setUserActivities(data);
  };

  const fetchUserConnections = async () => {
    const thisUserConnection = authState.user_metadata.connections;
    const { data, error } = await __supabase
      .from("user_hunters")
      .select("id,email,fullName,username")
      .in("id", thisUserConnection);

    if (error) {
      toast.error(error.message);
      return;
    }

    setUserConnections(data);
    setConnectionsLoading(false);
  };

  const fetchRecommendedUsers = async () => {
    const thisUserConnections = authState.user_metadata.connections;

    const { data, error } = await __supabase
      .from("recommended_hunters")
      .select("id,email,fullname,username");

    if (error) {
      toast.error(error.message);
      return;
    }

    // filter out the users that are already connected and the current user
    const filtered = data.filter(
      (user) =>
        !thisUserConnections.includes(user.id) && user.id !== authState.id
    );

    setRecommendedUsers(filtered);
    setRecommendedLoading(false);
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
    setAuthState(null);
    router.push("/login");
  };

  useEffect(() => {
    if (authState) {
      setHasUser(true);
      fetchUserActivities();
      fetchUserConnections();
      fetchRecommendedUsers();
    } else {
      router.push("/login");
    }
  }, [authState]);

  useEffect(() => {
    checkTheme();
  }, []);

  return (
    hasUser && (
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
                  src={`https://avatars.dicebear.com/api/bottts/${authState?.user_metadata?.username}.svg`}
                  alt="avatar"
                  className="w-32 h-32 rounded-full bg-primary border-white border-2"
                />
                <p className="text-3xl font-bold">
                  {authState?.user_metadata?.fullName.first}{" "}
                  {authState?.user_metadata?.fullName.last}
                </p>

                <p className="font-semibold opacity-75">
                  @{authState?.user_metadata?.username}
                </p>
                <p>
                  Joined at:{" "}
                  <span className="opacity-50">
                    {dayjs(authState?.created_at).format("MMMM DD, YYYY")}
                  </span>
                </p>
              </div>
              {/* bio */}
              <div className="flex flex-col border-2 border-base-content border-opacity-30 rounded-btn p-5 gap-3">
                <p className="text-2xl font-bold">Bio</p>
                <ReactMarkdown className="prose">
                  {authState.user_metadata.bio ||
                    "This user has not added a bio yet"}
                </ReactMarkdown>
              </div>
              {/* skills */}
              <div className="flex flex-col border-2 border-base-content border-opacity-30 rounded-btn p-5 gap-3">
                <p className="text-2xl font-bold">Skillsets</p>
                <div className="flex flex-col">
                  <h4 className="text-lg font-semibold">Primary Skill</h4>
                  <p className="badge badge-primary">
                    {authState?.user_metadata?.skillPrimary}
                  </p>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-lg font-semibold">Secondary Skills</h4>
                  <p className="flex flex-wrap gap-4">
                    {authState?.user_metadata?.skillSecondary.map(
                      (skill, index) => (
                        <span
                          key={`secondaryskill_${index}`}
                          className="badge badge-accent"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </p>
                </div>
              </div>
              {/* residence */}
              <div className="flex flex-col border-2 border-base-content border-opacity-30 rounded-btn p-5 gap-3">
                <p className="text-2xl font-bold">Residence</p>
                <div className="flex flex-col ">
                  <h4 className="text-lg font-semibold">Address</h4>
                  <p>{authState?.user_metadata?.address.address}</p>
                  <h4 className="text-lg font-semibold mt-3">
                    City of Residence
                  </h4>
                  <p className="badge badge-accent">
                    {authState?.user_metadata?.address.city}
                  </p>
                </div>
              </div>
              {/* activity */}
              <div className="flex flex-col border-2 border-base-content border-opacity-30 rounded-btn p-5 gap-3">
                <p className="text-2xl font-bold">Recent Activities</p>
                <div className="flex flex-col gap-2">
                  {userActivities.map((activity, index) => (
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
                {connectionsLoading &&
                  Array(5)
                    .fill()
                    .map((_, index) => (
                      <div
                        key={`connectionloading_${index}`}
                        className="h-[72px] w-full bg-base-300 rounded-btn animate-pulse"
                      />
                    ))}

                {!connectionsLoading && userConnections.length < 1 ? (
                  <p>
                    Looks like you have not connected to other people right now.
                    Add people to your connections to see their posts and
                    activities.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {userConnections.map((connection, index) => (
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
                              {connection.fullName.first}{" "}
                              {connection.fullName.last}
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
                )}
              </div>
              <div className="flex flex-col rounded-btn p-2 gap-3">
                <p className="text-2xl font-bold">Suggested Connections</p>
                <div className="flex flex-col gap-2">
                  {recommendedLoading &&
                    Array(5)
                      .fill()
                      .map((_, index) => (
                        <div
                          key={`recommendedloading_${index}`}
                          className="h-[72px] w-full bg-base-300 rounded-btn animate-pulse"
                        />
                      ))}

                  {!recommendedLoading && recommendedUsers.length < 1 ? (
                    <p>
                      Looks like you have not connected to other people right
                      now. Add people to your connections to see their posts and
                      activities.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {recommendedUsers.map((thisUser, index) => (
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
                                {thisUser.fullname.first}{" "}
                                {thisUser.fullname.last}
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
                <label htmlFor="signoutmodal" className="btn btn-error w-full">
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
    )
  );
};

export default ProfilePage;
