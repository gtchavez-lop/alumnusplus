import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowDown,
  FiChevronsDown,
  FiFilter,
  FiHeart,
  FiLoader,
  FiMessageCircle,
  FiMessageSquare,
  FiMoreHorizontal,
  FiPlusCircle,
  FiShare2,
  FiX
} from "react-icons/fi";
import { useClient, useFilter, useRealtime, useSelect } from "react-supabase";

import { $schema_blog } from "../../schemas/blog";
import FeedCard from "./FeedCard";
import Image from "next/image";
import { __PageTransition } from "../../lib/animtions";
import __supabase from "../../lib/supabase";
import dayjs from "dayjs";
import reactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { useState } from "react";
import uuidv4 from "../../lib/uuidv4";

const FeedPage = () => {
  const [blogContent, setBlogContent] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterMode, setFilterMode] = useState("content");
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);
  const supabaseClient = useClient();

  const feedFilter = useFilter(
    (query) => query.order("createdAt", { ascending: false }),
    []
  );

  const [
    {
      count: blogCount,
      data: blogData,
      error: blogError,
      fetching: blogLoading
    },
    reexecuteHunterBlog
  ] = useSelect("hunt_blog", { filter: feedFilter });

  const addPost = async (e) => {
    e.preventDefault();

    if (blogContent.length < 1) {
      toast.error("Please enter some content");
      return;
    }

    const user = await __supabase.auth.user();
    const uploaderMetadata = user.user_metadata;

    toast.loading("Uploading post...");

    const schema = $schema_blog;

    schema.type = "blog";
    schema.id = uuidv4();
    schema.content = blogContent;
    schema.comments = [];
    schema.upvoters = [];
    schema.createdAt = dayjs().format("YYYY-MM-DD HH:mm:ss");
    schema.updatedAt = dayjs().format("YYYY-MM-DD HH:mm:ss");
    schema.uploaderID = user.id;
    schema.uploader = {
      id: user.id,
      username: uploaderMetadata.username,
      firstName: uploaderMetadata.fullname.first,
      lastName: uploaderMetadata.fullname.last,
      middleName: uploaderMetadata.fullname.middle,
      email: user.email,
      type: "hunter"
    };

    // console.log(schema);

    const { error } = await __supabase.from("hunt_blog").insert(schema);

    toast.dismiss();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Post uploaded!");
      setBlogContent("");
      setCreatePostModalOpen(false);
      reexecuteHunterBlog();
    }
  };

  if (blogLoading) {
    return (
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed w-full h-screen flex flex-col justify-center items-center top-0 left-0"
      >
        <FiLoader className="animate-spin text-4xl " />
        <p>Loading...</p>
      </motion.main>
    );
  }

  const filterPostHandler = (e) => {
    const input = e.target.value;
    if (input.length >= 3) {
      const filtered =
        filterMode === "content"
          ? blogData.filter((post) =>
              post.content.toLowerCase().includes(input.toLowerCase())
            )
          : filterMode === "uploader_email"
          ? blogData.filter((post) =>
              post.uploader_email.toLowerCase().includes(input.toLowerCase())
            )
          : filterMode === "username"
          ? blogData.filter((post) =>
              post.uploaderData.username
                .toLowerCase()
                .includes(input.toLowerCase())
            )
          : filterMode === "fullname"
          ? blogData.filter(
              (post) =>
                post.uploaderData.firstName
                  .toLowerCase()
                  .includes(input.toLowerCase()) ||
                post.uploaderData.lastName
                  .toLowerCase()
                  .includes(input.toLowerCase())
            )
          : blogData.filter((post) =>
              post.content.toLowerCase().includes(input.toLowerCase())
            );

      setFilteredPosts(filtered);
    } else {
      setFilteredPosts([]);
    }
  };

  return (
    !blogLoading &&
    blogData && (
      <>
        <motion.main
          variants={__PageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-3 gap-4 pt-24"
        >
          {/* feed */}
          <div className="col-span-2 flex flex-col gap-16">
            {/* create post */}

            {/* cards */}
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

          {/* sidebar */}
          <div className="hidden lg:flex flex-col gap-4">
            <div className="p-5 bg-base-200 rounded-btn">
              {/* search for someone */}
              <div>
                <form className="w-full">
                  <span className="">Search for someone</span>
                  <input className="input input-primary input-bordered w-full" />
                </form>
              </div>
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
                transition: { duration: 0.3, ease: "circOut" }
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.3, ease: "circIn" }
              }}
              className="fixed w-full h-screen bg-base-300 bg-opacity-80 top-0 left-0"
              onClick={(e) => {
                if (e.currentTarget === e.target) {
                  setCreatePostModalOpen(false);
                }
              }}
            >
              <motion.div
                initial={{ x: -50 }}
                animate={{
                  x: 0,
                  transition: { duration: 0.3, ease: "circOut" }
                }}
                exit={{ x: -50, transition: { duration: 0.3, ease: "circIn" } }}
                className="absolute w-full max-w-xl h-screen max-h-screen overflow-y-auto top-0 left-0 bg-base-100 py-36 lg:py-24 px-5"
              >
                <div className="modal-title flex justify-between items-center">
                  <h5>
                    Add Post as{" "}
                    <span className="text-secondary underline underline-offset-4">
                      {supabaseClient.auth.user().user_metadata?.username}
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
                        e.target.style.height = `${
                          e.target.scrollHeight + 8
                        }px`;

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
    )
  );
};

export default FeedPage;
