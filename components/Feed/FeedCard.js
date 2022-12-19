import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiHeart,
  FiLoader,
  FiMessageCircle,
  FiMessageSquare,
  FiMoreHorizontal,
  FiSend,
  FiShare2,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { useEffect, useState } from "react";

import { $schema_blogComment } from "../../schemas/blog";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";
import rehypeRaw from "rehype-raw";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import uuidv4 from "../../lib/uuidv4";

const markdownRederers = {
  ul: ({ children }) => <ul className="list-disc">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal">{children}</ol>,
  li: ({ children }) => <li className="ml-4">{children}</li>,
  h2: ({ children }) => <h2 className="text-2xl">{children}</h2>,
  h3: ({ children }) => <h3 className="text-xl">{children}</h3>,
  h4: ({ children }) => <h4 className="text-lg">{children}</h4>,
};

const FeedCard = ({ feedData: blogPostData, index }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [isSelfPost, setIsSelfPost] = useState(false);
  const [seeMore, setSeeMore] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeProcessing, setLikeProcessing] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const __supabase = useSupabaseClient();

  const addComment = async () => {
    const {
      data: { user: localUser },
      error: userError,
    } = await __supabase.auth.getUser();

    if (commentInput.length < 1) {
      toast.error("Please enter some content");
      return;
    }

    const newComment = $schema_blogComment;

    newComment.blogId = blogPostData.id;
    newComment.content = commentInput;
    newComment.createdAt = dayjs().format("YYYY-MM-DD HH:mm:ss");
    newComment.id = uuidv4();
    newComment.type = "comment";
    newComment.updatedAt = dayjs().format("YYYY-MM-DD HH:mm:ss");
    newComment.uploaderDetails = {
      firstName: localUser?.user_metadata.fullName.first,
      lastName: localUser?.user_metadata.fullName.last,
      middleName: localUser?.user_metadata.fullName.middle,
      username: localUser?.user_metadata.username,
    };
    newComment.userId = localUser?.id;

    // add comment
    const { data, error } = await __supabase
      .from("hunt_blog")
      .update({
        comments: [...blogPostData.comments, newComment],
      })
      .eq("id", blogPostData.id);

    if (error) {
      toast.error(error.message);
      return;
    } else {
      blogPostData.comments = [...blogPostData.comments, newComment];
      toast.success("Comment added");
      setCommentInput("");
    }
  };

  const likePost = async () => {
    setLikeProcessing(true);

    const {
      data: { user: localUser },
      error: userError,
    } = await __supabase.auth.getUser();

    // fetch likes
    const { data: prevData, error: prevDataError } = await __supabase
      .from("hunt_blog")
      .select("upvoters")
      .single()
      .eq("id", blogPostData.id);

    const upvoters = [...prevData.upvoters];

    const isLiked =
      upvoters.findIndex((e) => e.userId === localUser?.id) !== -1;

    const newUpvoter = {
      blogId: blogPostData.id,
      createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      id: uuidv4(),
      type: "upvote",
      updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      userId: localUser?.id,
      upvoterDetails: {
        firstName: localUser?.user_metadata.fullName.first,
        lastName: localUser?.user_metadata.fullName.last,
        middleName: localUser?.user_metadata.fullName.middle,
        username: localUser?.user_metadata.username,
      },
    };

    if (isLiked) {
      // remove upvote
      const { error: newDataError } = await __supabase
        .from("hunt_blog")
        .update({
          upvoters: [
            ...prevData.upvoters.filter(
              (item) => item.userId !== localUser?.id
            ),
          ],
        })
        .eq("id", blogPostData.id);

      if (newDataError) {
        toast.error(error.message);
      } else {
        blogPostData.upvoters = prevData.upvoters.filter(
          (item) => item.userId !== localUser?.id
        );
        setIsLiked(false);
      }
    } else {
      // add upvote
      const { error: newDataError } = await __supabase
        .from("hunt_blog")
        .update({
          upvoters: [...prevData.upvoters, newUpvoter],
        })
        .eq("id", blogPostData.id);

      if (newDataError) {
        toast.error(error.message);
      } else {
        blogPostData.upvoters = [...prevData.upvoters, newUpvoter];
        setIsLiked(true);
      }
    }

    setLikeProcessing(false);
  };

  const handleDelete = async () => {
    const { error } = await __supabase
      .from("hunt_blog")
      .delete()
      .eq("id", blogPostData.id);

    if (error) {
      toast.error(error.message);
    } else {
      router.reload();
      toast.success("Post deleted");
    }
  };

  const fetchUser = async () => {
    const {
      data: { user },
    } = await __supabase.auth.getUser();

    setUser(user);

    // check if the post is from the user
    if (user === blogPostData.uploader.userId) {
      setIsSelfPost(true);
    }

    // check if user already liked the post
    const isLiked =
      blogPostData.upvoters.findIndex((e) => e.userId === user?.id) !== -1;
    setIsLiked(isLiked);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    blogPostData && (
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
              className="fixed w-full h-screen top-0 left-0 bg-base-300 bg-opacity-70 flex justify-end z-50"
            >
              <motion.div
                initial={{
                  clipPath: "inset(0 0 100% 0)",
                  y: "-50px",
                }}
                animate={{
                  clipPath: "inset(0 0 0% 0)",
                  y: "0px",
                  transition: { duration: 0.5, ease: "circOut" },
                }}
                exit={{
                  clipPath: "inset(100% 0 0% 0)",
                  y: "50px",
                  transition: { duration: 0.2, ease: "circIn" },
                }}
                className="bg-base-100 rounded-box w-full max-w-xl h-screen flex flex-col gap-2 p-4 lg:pt-24 pt-36 overflow-y-auto"
              >
                <div className="flex justify-between items-center">
                  <motion.p
                    layoutId={`comment_${blogPostData.id}`}
                    className="text-xl"
                  >
                    Comments
                  </motion.p>
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
                        src={`https://avatars.dicebear.com/api/bottts/${user?.user_metadata.username}.svg`}
                        width={45}
                        height={45}
                        className="rounded-full"
                        alt="avatar"
                      />
                      <div>
                        <p className="leading-none">
                          {user?.user_metadata.username}
                        </p>
                        <p className="text-xs opacity-50">
                          {dayjs(blogPostData.createdAt).format(
                            "DD MMM YYYY H:mm a"
                          )}
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
                  {blogPostData.comments?.map((comment, index) => {
                    return (
                      <div key={comment.id} className="bg-base-300 rounded-box">
                        <div className="flex flex-col p-2">
                          <div className="flex gap-2 items-center">
                            <Image
                              src={`https://avatars.dicebear.com/api/bottts/${comment.uploaderDetails.username}.svg`}
                              width={45}
                              height={45}
                              className="rounded-full"
                              alt="avatar"
                            />
                            <div>
                              <p className="leading-none">
                                {comment.uploaderDetails.username}
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

                  {blogPostData.comments.length === 0 && (
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
              className="fixed w-full h-screen top-0 left-0 bg-base-300 bg-opacity-70 flex justify-end z-[40]"
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
                    src={`https://avatars.dicebear.com/api/bottts/${blogPostData.uploader.username}.svg`}
                    width={45}
                    height={45}
                    className="rounded-full"
                    alt="avatar"
                  />
                  <div className="flex flex-col ml-2">
                    <p className="leading-none">
                      {blogPostData.uploader.username}
                    </p>
                    <p className="text-xs opacity-50">
                      {dayjs(blogPostData.created_at).format(
                        "DD MMM YYYY hh:mm a"
                      )}
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
                    {blogPostData.content}
                  </ReactMarkdown>
                </div>
                <div className="divider mb-0 pb-0" />
                {/* action buttons */}
                <div className="flex gap-2 items-center">
                  {likeProcessing ? (
                    <button className="btn btn-ghost gap-2" disabled={true}>
                      <FiLoader className="animate-spin" />
                    </button>
                  ) : (
                    <button className="btn btn-ghost gap-2" onClick={likePost}>
                      <FiHeart
                        className={isLiked && "fill-red-500 stroke-red-500"}
                      />
                      {blogPostData.upvoters.length > 0
                        ? blogPostData.upvoters.length
                        : null}
                    </button>
                  )}
                  {/* comment button */}
                  <button
                    className="btn btn-ghost gap-2"
                    onClick={() => setCommentOpen(true)}
                  >
                    <FiMessageSquare />
                    {blogPostData.comments.length > 0
                      ? blogPostData.comments.length
                      : null}
                  </button>
                  {blogPostData.uploader.email === user?.email && (
                    <label
                      htmlFor="deletePostModal"
                      className="btn btn-error btn-sm ml-auto"
                    >
                      <FiTrash2 />
                      <span className="ml-2">Delete Post</span>
                    </label>
                  )}
                </div>
                <p className="text-right text-sm opacity-50 max-w-lg self-end">
                  Some actions like share and report are not yet implemented.{" "}
                  <br />
                  Please come back later.
                </p>

                {/* user only action buttons */}
              </motion.div>
            </motion.main>
          )}
        </AnimatePresence>
        {/* cards */}

        <div className="flex gap-2 w-full" key={`card_${index}`}>
          <img
            className="w-10 h-10"
            alt="profile"
            src={`https://avatars.dicebear.com/api/bottts/${blogPostData.uploader.username}.svg`}
          />
          <div className="flex flex-col gap-4 w-full">
            <div className="mt-2">
              <Link
                href={
                  blogPostData.uploader.email === user?.email
                    ? "/me"
                    : `/h/${blogPostData.uploader.username}`
                }
                className="font-semibold text-primary hover:underline underline-offset-4 cursor-pointer"
              >
                {blogPostData.uploader.firstName}{" "}
                {blogPostData.uploader.middleName ?? null}{" "}
                {blogPostData.uploader.lastName}{" "}
              </Link>{" "}
              <br className="md:hidden" />
              <span className="opacity-50 ">
                {dayjs(blogPostData.createdAt).format("DD MMM YYYY hh:mm a")}
              </span>
            </div>
            <div onClick={() => setSeeMore(!seeMore)}>
              <ReactMarkdown
                className={`flex flex-col w-full overflow-y-hidden ${
                  seeMore
                    ? "max-h-full cursor-n-resize"
                    : "max-h-[205px] cursor-s-resize hover:opacity-50"
                }`}
                components={markdownRederers}
                // skipHtml={false}
                rehypePlugins={[rehypeRaw]}
              >
                {blogPostData.content}
              </ReactMarkdown>
            </div>
            <div className="flex justify-between mt-3 items-center">
              <div className="flex items-center gap-7">
                {likeProcessing ? (
                  <p>
                    <FiLoader className="animate-spin" />
                  </p>
                ) : (
                  <p
                    onClick={() => likePost()}
                    className="relative flex items-center gap-2 group transition-all hover:underline underline-offset-4 cursor-pointer"
                  >
                    <FiHeart
                      className={isLiked ? "stroke-red-500 fill-red-500" : ""}
                    />
                    {blogPostData.upvoters.length ?? null}{" "}
                    <span className="hidden lg:block">Likes</span>
                    {/* list of upvoters */}
                    {blogPostData.upvoters.length > 0 && (
                      <div className="absolute w-max px-5 py-3 bg-base-300 top-[150%] left-5 hidden group-hover:flex flex-col rounded-btn">
                        {blogPostData.upvoters.map((upvoter, index) => {
                          // only show 5 upvoters
                          // if it is greater than 5 then show a count
                          if (index < 5) {
                            return (
                              <p className="text-xs" key={`upvoters_${index}`}>
                                {upvoter.upvoterDetails.firstName}{" "}
                                {upvoter.upvoterDetails.lastName}
                              </p>
                            );
                          } else if (index === 5) {
                            return (
                              <p
                                key={`upvoter_${5 + index}`}
                                className="text-xs"
                              >
                                {blogPostData.upvoters.length - 5} more
                              </p>
                            );
                          }
                        })}
                      </div>
                    )}
                  </p>
                )}
                <p
                  onClick={() => setCommentOpen(true)}
                  className="flex items-center gap-2 group transition-all hover:underline underline-offset-4 cursor-pointer"
                >
                  <FiMessageCircle className=" transition-all" />
                  {blogPostData.comments.length ?? null}{" "}
                  <motion.span className="hidden lg:block">
                    Comments
                  </motion.span>
                </p>
              </div>
              <div className="flex gap-7">
                <p
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/h/blog/${blogPostData.id}`
                    );

                    toast.success("Link Copied");
                  }}
                  className="flex gap-2 items-center underline-offset-4 hover:underline"
                >
                  <FiShare2 className=" transition-all" />
                  <span className="hidden md:block">Share</span>
                </p>
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="flex gap-2 items-center underline-offset-4 hover:underline"
                  >
                    <FiMoreHorizontal className=" transition-all" />
                    <span className="hidden md:block">More</span>
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-200 rounded-box min-w-[200px] mt-5"
                  >
                    <li>
                      <a>
                        <FiArrowUpRight />
                        <span>Open in a new tab</span>
                      </a>
                    </li>
                    <li>
                      <a className="text-warning">Report</a>
                    </li>
                    <li>
                      <a className="text-error">Delete Post</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* delete modal */}
        <input type="checkbox" id="deletePostModal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <div className="flex justify-between items-center mb-5">
              <h5 className="text-2xl">Delete Post</h5>
              <label htmlFor="deletePostModal" className="btn btn-ghost">
                <FiX />
              </label>
            </div>
            <div className="modal-body mb-10">
              <div className="text-lg">Are you sure?</div>
              <p>
                This action cannot be undone. This will permanently delete this
                post.
              </p>
            </div>
            <div className="flex justify-end items-center">
              <div className="flex gap-2">
                <button className="btn btn-error" onClick={handleDelete}>
                  Delete
                </button>
                <label htmlFor="deletePostModal" className="btn btn-ghost">
                  Cancel
                </label>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default FeedCard;
