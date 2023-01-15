import { AnimatePresence, motion } from "framer-motion";
import { FiLoader, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";

import FeedCard from "../../components/Feed/FeedCard";
import { __PageTransition } from "../../lib/animation";
import { __supabase } from "../../supabase";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import useLocalStorage from "../../lib/localStorageHook";
import { useRouter } from "next/router";
import uuidv4 from "../../lib/uuidv4";

const FeedPage = () => {
  const [isMakingPost, setIsMakingPost] = useState(false);
  const [authState] = useLocalStorage("authState");
  const [isLoaded, setIsLoaded] = useState(false);
  const [feedList, setFeedList] = useState([]);
  const [feedListPage, setFeedListPage] = useState(0);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const rouer = useRouter();

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
      uploaderID: authState.id,
      upvoters: [],
    });

    toast.dismiss();
    if (error) {
      toast.error("Something went wrong");
      return;
    }

    toast.success("Posted!");

    router.reload();
    setIsMakingPost(false);
  };

  const fetchFeedList = async () => {
    const { data, error } = await __supabase
      .from("public_posts")
      .select("*")
      .order("createdAt", { ascending: false })
      .range(feedListPage, feedListPage + 10);

    if (error) {
      toast.error("Something went wrong");
      return;
    }

    setFeedList(data);
  };

  const fetchRecommendedUsers = async () => {
    const { data, error } = await __supabase
      .from("recommended_hunters")
      .select("id,fullname,username,email");

    if (error) {
      toast.error("Error at fetching recommended users");
      return;
    }

    setRecommendedUsers(data);
    console.log(data);
  };

  useEffect(() => {
    if (authState) {
      setIsLoaded(true);
    }
  }, [authState]);

  useEffect(() => {
    fetchFeedList();
    // fetchRecommendedUsers();
  }, [feedListPage]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <FiLoader className="animate-spin text-4xl text-primary" />
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
        className="relative w-full grid grid-cols-1 lg:grid-cols-10 gap-4 pt-24 pb-36"
      >
        {/* profile */}
        <div className="col-span-full lg:col-span-2 max-h-fit flex flex-col gap-5  rounded-btn p-5">
          <div className="flex flex-col items-center">
            <img
              // dicebear avatar
              src={`https://avatars.dicebear.com/api/bottts/${authState?.user_metadata?.username}.svg`}
              alt="avatar"
              className="w-20 h-20 bg-primary rounded-full"
            />
            <p className="font-bold">Gerald Chavez</p>
            <p className="text-primary text-sm hover:link">View Profile</p>
          </div>

          {/* <div className="flex flex-row justify-around lg:flex-col gap-2 ">
            <p className="text-primary text-sm hover:link">Connections</p>
            <p className="text-primary text-sm hover:link">Events</p>
          </div> */}
        </div>

        {/* feed */}
        <div className="col-span-full lg:col-span-5 p-5 ">
          {/* create post */}
          <div className="flex gap-2">
            <img
              src={`https://avatars.dicebear.com/api/bottts/${authState?.user_metadata?.username}.svg`}
              alt="avatar"
              className="w-12 h-12 hidden md:block bg-primary rounded-full"
            />
            <div
              onClick={() => setIsMakingPost(true)}
              className="btn btn-primary w-full md:max-w-xs"
            >
              Create Post
            </div>
          </div>

          {/* feed list */}
          <div className="mt-10">
            <div className="flex flex-col gap-5">
              {feedList &&
                feedList.map((item) => <FeedCard data={item} key={item.id} />)}
            </div>
          </div>
        </div>

        {/* friend suggest and footer */}
        <div className="col-span-full lg:col-span-3">
          <p>Footer</p>
        </div>
      </motion.main>

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
  );
};

export default FeedPage;
