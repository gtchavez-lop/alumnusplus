import { AnimatePresence, motion } from "framer-motion";
import {
  FiHeart,
  FiMessageSquare,
  FiMoreHorizontal,
  FiSend,
  FiTrash2,
  FiX
} from "react-icons/fi";
import { useEffect, useState } from "react";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import __supabase from "../../lib/supabase";
import dayjs from "dayjs";
import rehypeRaw from "rehype-raw";
import toast from "react-hot-toast";
import { useClient } from "react-supabase";
import uuidv4 from "../../lib/uuidv4";

const markdownRederers = {
  ul: ({ children }) => <ul className="list-disc">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal">{children}</ol>,
  li: ({ children }) => <li className="ml-4">{children}</li>
};

const FeedCard = ({ feedData, index }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const supabase = useClient();

  const addComment = async () => {
    if (commentInput.length < 1) {
      toast.error("Please enter some content");
      return;
    }

    const newComment = {
      id: uuidv4(),
      content: commentInput,
      uploader: {
        id: supabase.auth.user().id,
        email: supabase.auth.user().email,
        username: supabase.auth.user().user_metadata.username
      }
    };
    const { error } = await __supabase
      .from("hunt_blog")
      .update({
        comments: [...feedData.comments, newComment]
      })
      .eq("id", feedData.id);

    if (error) {
      toast.error(error.message);
    } else {
      feedData.comments.push(newComment);

      toast.success("Comment added");
      setCommentInput("");
    }
  };

  const likePost = async () => {
    // check if user already liked the post
    const userLiked = feedData.upvoters.find(
      (upvoter) =>
        upvoter.id === supabase.auth.user().id ||
        upvoter.email === supabase.auth.user().email ||
        upvoter.username === supabase.auth.user().user_metadata.username
    );

    const newUpvoter = {
      id: supabase.auth.user().id,
      email: supabase.auth.user().email,
      username: supabase.auth.user().user_metadata.username
    };

    if (userLiked) {
      // remove upvote
      const { error } = await __supabase
        .from("hunt_blog")
        .update({
          upvoters: feedData.upvoters.filter(
            (upvoter) => upvoter.id !== supabase.auth.user().id
          )
        })
        .eq("id", feedData.id);

      if (error) {
        toast.error(error.message);
      } else {
        feedData.upvoters = feedData.upvoters.filter(
          (upvoter) => upvoter.id !== supabase.auth.user().id
        );

        toast.success("Upvote removed");
        setIsLiked(false);
      }
    }

    if (!userLiked) {
      // add upvote
      const { error } = await __supabase
        .from("hunt_blog")
        .update({
          upvoters: [...feedData.upvoters, newUpvoter]
        })
        .eq("id", feedData.id);

      if (error) {
        toast.error(error.message);
      } else {
        feedData.upvoters.push(newUpvoter);

        toast.success("Upvote added");
        setIsLiked(true);
      }
    }
  };

  useEffect(() => {
    // check if user already liked the post
    const userLiked = feedData.upvoters.find(
      (upvoter) =>
        upvoter.id === supabase.auth.user().id ||
        upvoter.email === supabase.auth.user().email ||
        upvoter.username === supabase.auth.user().user_metadata.username
    );

    setIsLiked(userLiked);
  }, []);

  return (
    feedData && (
      <>
        {/* comment section */}
        <AnimatePresence>
          {commentOpen && (
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                if (e.currentTarget === e.target) {
                  setCommentOpen(false);
                }
              }}
              className="fixed w-full h-screen top-0 left-0 bg-primary bg-opacity-20 flex justify-end z-50"
            >
              <motion.div
                initial={{ x: 100 }}
                animate={{ x: 0, transition: { ease: "easeOut" } }}
                exit={{ x: 100, transition: { ease: "easeIn" } }}
                transition={{ duration: 0.2 }}
                className="bg-base-100 rounded-box w-full max-w-xl h-screen flex flex-col gap-2 p-4 lg:pt-24 pt-36 overflow-y-auto"
              >
                <div className="flex justify-between items-center">
                  <p className="text-xl">Comments</p>
                  <button
                    onClick={() => setCommentOpen(false)}
                    className="btn btn-circle btn-ghost"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>

                <div className="flex flex-col gap-2 pb-10">
                  <div className="flex flex-col gap-2 my-10">
                    <div className="flex items-center gap-2">
                      <Image
                        src={`https://avatars.dicebear.com/api/bottts/${
                          supabase.auth.user().user_metadata.username
                        }.svg`}
                        width={45}
                        height={45}
                        className="rounded-full"
                        alt="avatar"
                      />
                      <div>
                        <p className="leading-none">
                          {supabase.auth.user().user_metadata.username}
                        </p>
                        <p className="text-xs opacity-50">
                          {dayjs().format("DD MMM YYYY hh:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mt-2">
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Add a comment..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyUp={(e) => {
                          if (e.key === "Enter") {
                            addComment();
                          }
                        }}
                      />
                      <button
                        onClick={addComment}
                        className="btn btn-square btn-primary"
                      >
                        <FiSend />
                      </button>
                    </div>
                  </div>
                  {feedData.comments?.map((comment, index) => {
                    return (
                      <div key={comment.id} className="border-2 rounded-box">
                        <div className="flex flex-col p-2">
                          <div className="flex gap-2 items-center">
                            <Image
                              src={`https://avatars.dicebear.com/api/bottts/${comment.uploader.username}.svg`}
                              width={45}
                              height={45}
                              className="rounded-full"
                              alt="avatar"
                            />
                            <div>
                              <p className="leading-none">
                                {comment.uploader.username}
                              </p>
                              <p className="text-xs opacity-50">
                                {dayjs(comment.createdAt).format(
                                  "DD MMM YYYY hh:mm a"
                                )}
                              </p>
                            </div>
                          </div>

                          <p className="mt-2 p-2">{comment.content}</p>
                        </div>
                      </div>
                    );
                  })}

                  {feedData.comments.length === 0 && (
                    <p className="mt-10">No comments yet</p>
                  )}
                </div>
              </motion.div>
            </motion.main>
          )}
        </AnimatePresence>

        {/* content section */}
        <AnimatePresence>
          {contentOpen && (
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                if (e.currentTarget === e.target) {
                  setContentOpen(false);
                }
              }}
              className="fixed w-full h-screen top-0 left-0 bg-primary bg-opacity-20 flex justify-end z-[40]"
            >
              <motion.div
                initial={{ x: 100 }}
                animate={{ x: 0, transition: { ease: "easeOut" } }}
                exit={{ x: 100, transition: { ease: "easeIn" } }}
                transition={{ duration: 0.2 }}
                className="bg-base-100 rounded-box w-full max-w-xl h-screen flex flex-col gap-2 p-4 lg:pt-24 pt-36"
              >
                <div className="flex justify-between items-center">
                  <p className="text-xl">Content</p>
                  <button
                    onClick={() => setContentOpen(false)}
                    className="btn btn-circle btn-ghost"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>
                <div className="flex items-center">
                  <Image
                    src={`https://avatars.dicebear.com/api/bottts/${feedData.uploaderData.username}.svg`}
                    width={45}
                    height={45}
                    className="rounded-full"
                    alt="avatar"
                  />
                  <div className="flex flex-col ml-2">
                    <p className="leading-none">
                      {feedData.uploaderData.username}
                    </p>
                    <p className="text-xs opacity-50">
                      {dayjs(feedData.createdAt).format("DD MMM YYYY hh:mm a")}
                    </p>
                  </div>
                </div>
                <div className="p-4 ">
                  <ReactMarkdown
                    className="flex flex-col "
                    components={markdownRederers}
                    skipHtml={false}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {feedData.content}
                  </ReactMarkdown>
                </div>
                <div className="divider mb-0 pb-0" />
                {/* action buttons */}
                <div className="flex gap-2 items-center">
                  <button className="btn btn-ghost gap-2" onClick={likePost}>
                    <FiHeart
                      className={isLiked && "fill-red-500 stroke-red-500"}
                    />
                    {feedData.upvoters.length > 0
                      ? feedData.upvoters.length
                      : null}
                  </button>
                  {/* comment button */}
                  <button
                    className="btn btn-ghost gap-2"
                    onClick={() => setCommentOpen(true)}
                  >
                    <FiMessageSquare />
                    {feedData.comments.length > 0
                      ? feedData.comments.length
                      : null}
                  </button>
                  {feedData.uploaderData.email ===
                    supabase.auth.user().email && (
                    <button className="btn btn-error btn-sm ml-auto">
                      <FiTrash2 />
                      <span className="ml-2">Delete Post</span>
                    </button>
                  )}
                </div>

                {/* user only action buttons */}
              </motion.div>
            </motion.main>
          )}
        </AnimatePresence>

        {/* card */}
        <motion.div
          key={`post_${index + 1}`}
          animate={{ opacity: [0, 1], y: [10, 0] }}
          transition={{
            duration: 0.5,
            ease: "circOut",
            delay: (index + 1) * 0.1
          }}
          className={
            "rounded-box min-h-[250px] py-3 px-4 flex flex-col gap-2 opacity-0 border-primary border-2"
          }
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <Image
                width={40}
                height={40}
                priority={true}
                className="rounded-full bg-base-100"
                alt="profile"
                src={`https://avatars.dicebear.com/api/bottts/${feedData.uploaderData.username}.svg`}
              />
            </div>
            <div className="flex flex-col">
              <p className="text-sm leading-none">
                {feedData.uploaderData.firstName}{" "}
                {feedData.uploaderData.lastName}
              </p>
              <p className="text-xs opacity-60 leading-none">
                @{feedData.uploaderData.username}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs opacity-70 ml-2 mt-2">
              {dayjs(feedData.created_at).format("MMM D YYYY | HH:MM A")}
            </p>
            <div
              className="px-2 max-h-full overflow-ellipsis cursor-pointer relative"
              onClick={() => setContentOpen(true)}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-base-100 opacity-0 hover:opacity-80 transition-all flex justify-center items-center">
                <p>See More</p>
              </div>
              <ReactMarkdown
                className="flex flex-col min-h-[100px] max-h-[100px] truncate"
                components={markdownRederers}
                skipHtml={false}
                rehypePlugins={[rehypeRaw]}
              >
                {feedData.content}
              </ReactMarkdown>
            </div>
          </div>
          <div className="flex gap-2 items-center mt-auto">
            <button onClick={likePost} className="btn btn-ghost gap-3">
              <FiHeart className={isLiked && "fill-red-500 stroke-red-500"} />
              {feedData.upvoters.length > 0 ? feedData.upvoters.length : null}
            </button>
            <button
              onClick={(e) => setCommentOpen(!commentOpen)}
              className="btn btn-ghost gap-3"
            >
              <FiMessageSquare />
              {feedData.comments.length > 0 ? feedData.comments.length : null}
            </button>
            <button
              onClick={() => setContentOpen(true)}
              className="btn btn-ghost btn-square ml-auto"
            >
              <FiMoreHorizontal />
            </button>
          </div>
        </motion.div>
      </>
    )
  );
};

export default FeedCard;
