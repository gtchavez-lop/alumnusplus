import { AnimatePresence, motion } from "framer-motion";
import { FiArrowDown, FiLoader, FiPlus, FiSearch, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";

import FeedCard from "../components/Feed/FeedCard";
import { __PageTransition } from "../lib/animation";
import { __supabase } from "../supabase";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const Feed = (e) => {
  const [blogContent, setBlogContent] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterMode, setFilterMode] = useState("content");
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogData, setBlogData] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const fetchBlogs = async () => {
    const { data, error } = await __supabase
      .from("hunt_blog")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setBlogData(data);
      setBlogLoading(false);
    }
  };

  const fetchUser = async () => {
    const { data, error } = await __supabase.auth.getUser();
    if (error) {
      toast.error(error.message);
    } else {
      setUser(data);
      fetchBlogs();
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (blogLoading) {
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
        className="relative min-h-screen w-full grid grid-cols-1 lg:grid-cols-3 gap-4 pt-24 pb-36"
      >
        <div className="col-span-2 flex flex-col gap-16">
          <div className="flex flex-col-reverse lg:flex-row lg:items-center gap-4">
            <button
              onClick={() => setCreatePostModalOpen(true)}
              className="btn btn-primary gap-2 btn-sm lg:btn-md w-full max-w-md lg:w-max"
            >
              <FiPlus className="text-xl" />
              <p>Create Post</p>
            </button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const searchQuery = e.target[0].value;
                if (searchQuery.length >= 5) {
                  // trim last whitespace
                  const trimmedQuery = searchQuery.trim();
                  // make the searchQuery URL friendly
                  const urlFriendlyQuery = trimmedQuery.replace(/\s/g, "+");
                  // redirect to search page
                  router.push(`/search?query=${urlFriendlyQuery}`);
                } else {
                  toast.error("Please enter a valid search query");
                }
              }}
              className="w-full input-group"
            >
              <input
                type="text"
                placeholder="Search..."
                className="input input-primary input-sm lg:input-md w-full max-w-md"
              />
              <span>
                <FiSearch />
              </span>
            </form>
          </div>
          {filteredPosts.length >= 1
            ? filteredPosts.map((blog, index) => (
                <FeedCard
                  key={`feedcard_${index + 1}`}
                  feedData={blog}
                  index={index}
                />
              ))
            : blogData?.map((blog, index) => (
                <FeedCard
                  key={`feedcard_${index + 1}`}
                  feedData={blog}
                  index={index}
                />
              ))}
        </div>
      </motion.main>

      {/* add post modal */}
      <AnimatePresence key={"createPostModal"}>
        {createPostModalOpen && (
          <motion.div
            key={`createPostModal_${createPostModalOpen}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.3, ease: "circOut" },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.3, ease: "circIn" },
            }}
            className="fixed w-full h-screen bg-base-300 bg-opacity-80 top-0 left-0"
            onClick={(e) => {
              if (e.currentTarget === e.target) {
                setCreatePostModalOpen(false);
              }
            }}
          >
            <motion.div
              initial={{
                clipPath: "inset(0 0 100% 0)",
                y: "-50px",
              }}
              animate={{
                clipPath: "inset(0 0 0% 0)",
                y: "0px",
                transition: { duration: 0.3, ease: "circOut" },
              }}
              exit={{
                clipPath: "inset(100% 0 0% 0)",
                y: "50px",
                transition: { duration: 0.3, ease: "circIn" },
              }}
              className="absolute w-full max-w-xl h-screen max-h-screen overflow-y-auto top-0 left-0 bg-base-100 py-36 lg:py-24 px-5"
            >
              <div className="modal-title flex justify-between items-center">
                <h5>
                  Add Post as{" "}
                  <span className="text-secondary underline underline-offset-4">
                    {user?.user_metadata?.username}
                  </span>
                </h5>
                <div
                  className="btn btn-ghost btn-circle"
                  onClick={() => setCreatePostModalOpen(false)}
                >
                  <FiX />
                </div>
              </div>
              <div className="modal-body flex flex-col gap-2">
                <form onSubmit={(e) => addPost(e)}>
                  <textarea
                    name="content"
                    className="textarea textarea-bordered w-full"
                    onChange={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight + 8}px`;

                      const content = e.target.value;
                      const newContent = content.replace(/\n/g, "<br />");
                      setBlogContent(newContent);
                    }}
                  />
                  <p
                    onClick={() => {
                      setCheatSheetOpen(!cheatSheetOpen);
                    }}
                    className="text-sm mt-2 flex items-center gap-2 cursor-pointer hover:link"
                  >
                    {cheatSheetOpen ? "Close" : "Open"} markdown cheatsheet{" "}
                    <span>
                      <FiArrowDown />
                    </span>
                  </p>
                  {
                    // markdown cheatsheet
                    cheatSheetOpen && (
                      <div className="grid grid-cols-2 mt-4 gap-3">
                        <p>
                          <strong>Headers</strong>
                          <br />
                          # H1
                          <br />
                          ## H2
                          <br />
                          ### H3
                        </p>
                        <p>
                          <strong>Emphasis</strong>
                          <br />
                          *italic* or _italic_
                          <br />
                          **bold** or __bold__
                          <br />
                          ~~strikethrough~~
                        </p>
                        <p>
                          <strong>Lists</strong>
                          <br />
                          - Unordered list
                          <br />
                          1. Ordered list
                        </p>
                        <p>
                          <strong>Links</strong>
                          <br />
                          [Link](https://supabase.io)
                        </p>
                        <p>
                          <strong>Code</strong>
                          <br />
                          `code`
                        </p>
                        <p>
                          <strong>Blockquotes</strong>
                          <br />
                          {">"} Blockquote
                        </p>
                        <p>
                          <strong>Horizontal Rule</strong>
                          <br />
                          ---
                        </p>
                      </div>
                    )
                  }
                  <div className="modal-action">
                    <label
                      onClick={() => setCreatePostModalOpen(false)}
                      className="btn btn-ghost"
                    >
                      Cancel
                    </label>
                    <button type="submit" className="btn btn-primary">
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Feed;
