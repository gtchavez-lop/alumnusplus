import {
  FiArrowUp,
  FiLoader,
  FiMessageSquare,
  FiMoreHorizontal,
  FiX,
} from "react-icons/fi";
import { useEffect, useState } from "react";

import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { __supabase } from "../../supabase";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import rehypeRaw from "rehype-raw";
import { toast } from "react-hot-toast";
import { useSession } from "@supabase/auth-helpers-react";

const FeedCard = ({ data: blogPostData }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const session = useSession();

  const checkIfLiked = async () => {
    const localIsLiked = blogPostData.upvoters.includes(session.user.id);
    setIsLiked(localIsLiked);
  };

  // post upvote handler
  const upvoteHandler = async (e) => {
    // disable the button while processing
    e.target.disabled = true;
    toast.loading("Processing...");

    // fetch current upvoters
    const { data: currentData, error: currentDataError } = await __supabase
      .from("public_posts")
      .select("upvoters")
      .eq("id", blogPostData.id)
      .single();

    if (currentDataError) {
      console.log(currentDataError);
      return;
    }

    const localIsLiked = currentData.upvoters.includes(session.user.id);

    // if user already liked the post, remove the upvote
    if (localIsLiked) {
      const newUpvoters = currentData.upvoters.filter(
        (id) => id !== session.user.id
      );

      const { error: removeUpvoteError } = await __supabase
        .from("public_posts")
        .update({
          upvoters: newUpvoters,
        })
        .eq("id", blogPostData.id);

      if (removeUpvoteError) {
        console.log(removeUpvoteError);
        return;
      }

      blogPostData.upvoters = newUpvoters;
      setIsLiked(false);
      e.target.disabled = false;
      toast.dismiss();
      return;
    } else {
      // if user hasn't liked the post, add the upvote
      const { error: addUpvoteError } = await __supabase
        .from("public_posts")
        .update({
          upvoters: [...currentData.upvoters, session.user.id],
        })
        .eq("id", blogPostData.id);

      if (addUpvoteError) {
        console.log(addUpvoteError);
        return;
      }

      blogPostData.upvoters = [...currentData.upvoters, session.user.id];
      setIsLiked(true);
      e.target.disabled = false;
      toast.dismiss();
    }
  };

  useEffect(() => {
    checkIfLiked();
  }, []);

  // if (uploaderDataStatus === "loading") {
  //   return <SkeletonCard />;
  // }

  return (
    <>
      <motion.div className="flex flex-col p-5 rounded-btn bg-base-200">
        <div className="flex gap-3">
          <Link
            href={
              session.user.id === blogPostData.uploaderID
                ? "/h/me"
                : `/h/${blogPostData.uploader.username}`
            }
          >
            <img
              // dicebear
              src={`https://avatars.dicebear.com/api/bottts/${blogPostData.uploader.username}.svg`}
              alt="avatar"
              className="w-10 h-10"
            />
          </Link>
          <div className="flex flex-col gap-1 justify-center">
            <p className="leading-none">
              <Link
                href={
                  session.user.id === blogPostData.uploaderID
                    ? "/h/me"
                    : `/h/${blogPostData.uploader.username}`
                }
              >
                {blogPostData.uploader.fullName.first}{" "}
                {blogPostData.uploader.fullName.last}{" "}
              </Link>
              <span className="text-primary opacity-50">posted</span>
            </p>
            <p className="text-sm flex gap-2 leading-none">
              <span className="opacity-50">
                @{blogPostData.uploader.username}
              </span>
              <span>
                {dayjs(blogPostData.createdAt).format("MMM DD YYYY h:MM A")}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-5 h-[101px] overflow-hidden">
          <ReactMarkdown
            // components={markdownRenderer}
            rehypePlugins={[rehypeRaw]}
            className="prose-sm prose-headings:text-xl "
          >
            {blogPostData.content.slice(0, 200) + "..."}
          </ReactMarkdown>
        </div>

        <div className="mt-5 flex justify-between">
          <div className="flex gap-2">
            <button
              onClick={upvoteHandler}
              className={`btn ${isLiked ? "btn-primary" : "btn-ghost"} gap-2`}
            >
              <FiArrowUp className="font-bold" />
              {blogPostData.upvoters.length || ""}
            </button>
            <motion.button
              onClick={() => setCommentsOpen(true)}
              className="btn btn-ghost"
            >
              <FiMessageSquare className="font-bold" />
              <span className="ml-2">{blogPostData.comments.length}</span>
            </motion.button>
          </div>
          <div className="md:hidden dropdown dropdown-top dropdown-end">
            <label tabIndex={0} className="btn btn-ghost">
              <FiMoreHorizontal />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link scroll={false} href={`/h/feed/${blogPostData.id}`}>
                  Read More
                </Link>
              </li>
              <li>
                <button>Share</button>
              </li>
            </ul>
          </div>
          <div className="md:flex gap-2 hidden ">
            {!isMoreOpen ? (
              <Link
                scroll={false}
                href={`/h/feed/${blogPostData.id}`}
                className="btn btn-ghost"
                onClick={() => setIsMoreOpen(true)}
              >
                Read More
              </Link>
            ) : (
              <div className="btn btn-ghost btn-disabled items-center gap-2">
                Loading Page
                <FiLoader className="animate-spin" />
              </div>
            )}
            <button className="btn btn-ghost">Share</button>
          </div>
        </div>
      </motion.div>

      {/* comments */}
      <AnimatePresence mode="wait">
        {commentsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.2, ease: "circOut" },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.2, ease: "circIn" },
            }}
            onClick={(e) =>
              e.target === e.currentTarget && setCommentsOpen(false)
            }
            className="fixed top-0 left-0 z-50 w-full h-screen px-5 lg:px-0 pt-24 pb-16 bg-base-100 flex justify-center"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0, transition: { duration: 0.2, ease: "circOut" } }}
              exit={{ y: 20, transition: { duration: 0.2, ease: "circIn" } }}
              className="w-full max-w-xl"
            >
              {/* top action buttons */}
              <div className="flex justify-between items-center">
                <motion.h1
                  animate={{
                    opacity: [0, 1],
                    x: [-50, 0],
                    transition: { delay: 0.2, duration: 0.2, ease: "circOut" },
                  }}
                  className="text-2xl font-bold"
                >
                  Comments
                </motion.h1>
                <motion.button
                  layoutId={`closebutton-${blogPostData.id}`}
                  onClick={() => setCommentsOpen(false)}
                  className="btn btn-ghost"
                >
                  <FiX />
                </motion.button>
              </div>

              {/* comments */}
              <motion.div
                animate={{
                  opacity: [0, 1],
                  y: [50, 0],
                  transition: { delay: 0.3, duration: 0.2, ease: "circOut" },
                }}
                className="mt-5 flex flex-col gap-2"
              >
                {blogPostData.comments.map((comment, index) => (
                  <div
                    className="p-3 bg-base-200 rounded-btn"
                    key={`comment_${index}`}
                  >
                    {/* commenter */}
                    <div className="flex gap-3">
                      <img
                        // dicebear
                        src={`https://avatars.dicebear.com/api/bottts/${comment.commenter.username}.svg`}
                        alt="avatar"
                        className="w-10 h-10"
                      />
                      <div className="flex flex-col gap-1 justify-center">
                        <p className="leading-none">
                          {comment.commenter.fullName.first}{" "}
                          {comment.commenter.fullName.last}{" "}
                          <span className="text-primary opacity-50">
                            commented
                          </span>
                        </p>
                        <p className="opacity-50 leading-none">
                          {comment.commenter.username}
                        </p>
                      </div>
                    </div>
                    {/* content */}
                    <div className="mt-5">
                      <ReactMarkdown
                        // components={markdownRenderer}
                        rehypePlugins={[rehypeRaw]}
                        className="prose"
                      >
                        {comment.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedCard;
