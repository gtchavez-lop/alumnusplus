import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowDown,
  FiLoader,
  FiPlus,
  FiSearch,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useEffect, useState } from "react";

import { $schema_blog } from "../../schemas/blog";
import FeedCard from "../../components/Feed/FeedCard";
import Link from "next/link";
import { __PageTransition } from "../../lib/animation";
import { __supabase } from "../../supabase";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import useLocalStorage from "../../lib/localStorageHook";
import { useRouter } from "next/router";
// import { useSupabaseClient } from "@supabase/auth-helpers-react";
import uuidv4 from "../../lib/uuidv4";

const Feed = () => {
  const [blogContent, setBlogContent] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterMode, setFilterMode] = useState("content");
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  const [recommendedHunters, setRecommendedHunters] = useState([]);
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogData, setBlogData] = useState([]);
  const [user, setUser] = useState(null);
  const [authState] = useLocalStorage("authState");
  // const __supabase = useSupabaseClient();
  const router = useRouter();

  const fetchRecommendedUsers = async () => {
    const {
      data: { user },
    } = await __supabase.auth.getUser();

    const connections = user.user_metadata.connections;

    const { data, error } = await __supabase
      .from("recommended_hunters")
      .select("id,fullname,email,username")
      .limit(5);

    if (error) {
      toast.error(error.message);
      return;
    }

    const filtered = data.filter((person) => {
      if (!connections.includes(person.id) && person.id !== user.id) {
        return person;
      }
    });

    setRecommendedHunters(filtered);
  };

  const fetchBlogs = async () => {
    const {
      data: { user },
    } = await __supabase.auth.getUser();
    const connections = user.user_metadata.connections;

    const { data, error } = await __supabase
      .from("hunt_blog")
      .select("*")
      .in("uploaderID", [...connections, user.id]);

    if (error) {
      toast.error(error.message);
    } else {
      setBlogData(data);
      fetchRecommendedUsers();
      setBlogLoading(false);
    }
  };

  const fetchUser = async () => {
    if (authState) {
      fetchBlogs();
    } else {
      router.push("/h/login");
    }
  };

  const addPost = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const content = formData.get("content");

    if (content.length < 1) {
      toast.error("Please enter some content");
      return;
    }

    const {
      data: { user: localUser },
      error: userError,
    } = await __supabase.auth.getUser();
    const blogSchema = $schema_blog;

    blogSchema.id = uuidv4();
    blogSchema.content = content;
    blogSchema.uploader.email = localUser.email;
    blogSchema.uploader.id = localUser.id;
    blogSchema.uploader.username = localUser.user_metadata.username;
    blogSchema.uploader.firstName = localUser.user_metadata.fullName.first;
    blogSchema.uploader.lastName = localUser.user_metadata.fullName.last;
    blogSchema.uploader.middleName = localUser.user_metadata.fullName.middle;
    blogSchema.type = "hunt_blog";
    blogSchema.createdAt = dayjs().format("YYYY-MM-DD HH:mm:ss");
    blogSchema.updatedAt = dayjs().format("YYYY-MM-DD HH:mm:ss");

    toast.loading("Posting blog...");

    const { error } = await __supabase.from("hunt_blog").insert({
      ...blogSchema,
      uploaderID: localUser.id,
    });

    if (error) {
      toast.dismiss();
      toast.error(error.message);
      return;
    }

    toast.dismiss();
    toast.success("Blog posted!");
    setBlogContent("");
    setCreatePostModalOpen(false);
    fetchBlogs();
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

        {/* recommend friend */}
        <div className="lg:flex flex-col gap-4 hidden overflow-hidden">
          <p className="text-lg font-bold">You might know</p>
          <div>
            {recommendedHunters.length > 0 &&
              recommendedHunters.map((hunter) => (
                <Link
                  href={`/h/${hunter.username}`}
                  key={`recommended_hunter_${hunter.id}`}
                  className="flex items-center gap-4 mt-4 bg-base-300 p-2 rounded-btn"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full">
                    <img
                      src={`https://avatars.dicebear.com/api/bottts/${hunter.username}.svg`}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold">@{hunter.username}</p>
                    <p className="text-xs opacity-50">
                      {hunter.fullname.first} {hunter.fullname.last}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
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
                    {authState?.user_metadata?.username}
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
