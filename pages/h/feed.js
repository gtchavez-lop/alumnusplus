import { AnimatePresence, motion } from "framer-motion";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useSession, useUser } from "@supabase/auth-helpers-react";

// import FeedCard from "@/components/Feed/FeedCard";
import { FiX } from "react-icons/fi";
import Link from "next/link";
// import ProtectedPageContainer from "@/components/ProtectedPageContainer";
// import SkeletonCard from "@/components/Feed/SkeletonCard";
import { __PageTransition } from "@/lib/animation";
import { __supabase } from "@/supabase";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import { useState } from "react";
import uuidv4 from "@/lib/uuidv4";

const ProtectedPageContainer = dynamic(
  () => import("@/components/ProtectedPageContainer"),
  { ssr: false }
);

const SkeletonCard = dynamic(() => import("@/components/Feed/SkeletonCard"), {
  ssr: false,
});

const FeedCard = dynamic(() => import("@/components/Feed/FeedCard"), {
  ssr: false,
});

const FeedPage = () => {
  const [isMakingPost, setIsMakingPost] = useState(false);
  const thisSession = useSession();
  const thisUser = useUser();

  const currentUser = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data, error } = await __supabase
        .from("user_hunters")
        .select("*")
        .eq("id", thisSession.user.id)
        .single();
      if (error) {
        return null;
      }
      return data;
    },
    enabled: !!thisSession,
    onSuccess: (data) => {
      console.log("currentUser success");
    },
    onError: (error) => {
      console.log("currentUser error");
    },
  });

  const fetchFeed = async () => {
    const userConnections = currentUser.data.connections;

    const { data, error } = await __supabase
      .from("public_posts")
      .select(
        "id,content,comments,createdAt,updatedAt,uploader(id,email,full_name,username),upvoters"
      )
      .in("uploader", [...userConnections, thisUser.id]);

    if (error) {
      console.log("error", error);
      return [];
    }

    return data;
  };

  const fetchRecommendedUsers = async () => {
    const localConnection = currentUser.data.connections;
    const reqString = `(${localConnection.concat(currentUser.data.id)})`;

    const { data, error } = await __supabase
      .from("recommended_hunters")
      .select("id,fullname,username,email")
      .filter("id", "not.in", reqString);

    if (error) {
      return [];
    }

    return data;
  };

  const [feedList, recommendedUsers] = useQueries({
    queries: [
      {
        queryKey: ["mainFeedList"],
        queryFn: fetchFeed,
        enabled: !!currentUser.isSuccess,
        onSuccess: (data) => {
          console.log("feedList success");
        },
        onError: (error) => {
          console.log("feedList error", error);
          toast.error("Something went wrong fetching your feed");
        },
      },
      {
        queryKey: ["recommendedUsers"],
        queryFn: fetchRecommendedUsers,
        enabled: !!currentUser.isSuccess,
        onSuccess: (data) => {
          console.log("recommendedUsers success");
        },
        onerror: () => {
          console.log("recommendedUsers error");
          toast.error("Something went wrong fetching recommended users");
        },
        refetchOnWindowFocus: false,
      },
    ],
  });

  const handlePost = async (e) => {
    const formData = new FormData(e.target);
    const content = formData.get("content");

    if (!content) {
      toast.error("Content is required");
      return;
    }

    toast.loading("Posting...");

    const { error } = await __supabase.from("public_posts").insert({
      id: uuidv4(),
      content,
      comments: [],
      createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      type: "blogpost",
      updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      uploader: currentUser.data.id,
      uploaderID: currentUser.data.id,
      upvoters: [],
    });

    toast.dismiss();
    if (error) {
      toast.error("Something went wrong");
      return;
    }

    toast.success("Posted!");

    // feedList.refetch();
    setIsMakingPost(false);
  };

  return (
    <ProtectedPageContainer>
      <>
        {currentUser.isSuccess && (
          <motion.main
            variants={__PageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full grid grid-cols-1 lg:grid-cols-5 gap-4 pt-24 pb-36"
          >
            {/* feed */}
            <div className="col-span-full lg:col-span-3 ">
              {/* create post */}
              <div className="flex gap-2 w-full items-center">
                <img
                  src={`https://avatars.dicebear.com/api/bottts/${currentUser.data?.username}.svg`}
                  alt="avatar"
                  className="w-12 h-12 hidden md:block bg-primary mask mask-squircle p-1"
                />
                <div
                  onClick={() => setIsMakingPost(true)}
                  className="btn btn-primary btn-block max-w-md"
                >
                  Create Post
                </div>
              </div>

              {/* feed list */}
              <div className="mt-10">
                <div className="flex flex-col gap-5">
                  {feedList.isLoading &&
                    Array(10)
                      .fill(0)
                      .map((_, i) => <SkeletonCard key={`skeleton_${i}`} />)}

                  {feedList.isSuccess &&
                    feedList.data.map((item) => (
                      <FeedCard data={item} key={item.id} />
                    ))}
                </div>
              </div>
            </div>

            {/* friend suggest and footer */}
            <div className="col-span-full lg:col-span-2">
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
                      now. Add people to your connections to see their posts and
                      activities.
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
                                className="w-12 h-12 p-1 mask mask-squircle bg-primary "
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
            </div>
          </motion.main>
        )}
        {/* create blog custom modal */}
        <AnimatePresence mode="wait">
          {isMakingPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { ease: "circOut", duration: 0.2 },
              }}
              exit={{
                opacity: 0,
                transition: { ease: "circIn", duration: 0.2 },
              }}
              layout
              className="fixed inset-0 w-full h-screen bg-base-100 px-5 lg:px-0 flex justify-center overflow-y-scroll "
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{
                  y: 0,
                  transition: { ease: "circOut", duration: 0.2 },
                }}
                exit={{
                  y: 20,
                  transition: { ease: "circIn", duration: 0.2 },
                }}
                className="pt-24 pb-36 w-full max-w-xl"
              >
                <div className="flex justify-between items-center">
                  <motion.p className="text-primary text-lg font-bold">
                    Create a blog post
                  </motion.p>
                  <motion.button
                    onClick={(e) => setIsMakingPost(false)}
                    className="btn btn-error"
                  >
                    <FiX />
                  </motion.button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePost(e);
                  }}
                  className="flex flex-col mt-5 gap-5"
                >
                  <div className="form-control w-full ">
                    <p className="label">
                      <span className="label-text">Blog Content</span>
                      <span className="label-text">Markdown</span>
                    </p>
                    <textarea
                      name="content"
                      placeholder="Type here"
                      className="textarea textarea-bordered w-full h-screen max-h-[200px] font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={(e) => setIsMakingPost(false)}
                      className="btn btn-error"
                    >
                      Cancel
                    </button>
                    <motion.button
                      layoutId="create-post"
                      transition={{ ease: "circOut", duration: 0.2 }}
                      type="submit"
                      className="btn btn-primary"
                    >
                      Create
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    </ProtectedPageContainer>
  );
};

export default FeedPage;
