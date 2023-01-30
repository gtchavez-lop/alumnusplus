import { FiArrowUp, FiMessageSquare } from "react-icons/fi";

import { AnimatePresence } from "framer-motion";
import Link from "next/link";
// import ProtectedPageContainer from "@/components/ProtectedPageContainer";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { __PageTransition } from "@/lib/animation";
import { __supabase } from "@/supabase";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import rehypeRaw from "rehype-raw";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";
import uuidv4 from "@/lib/uuidv4";

const ProtectedPageContainer = dynamic(
  () => import("@/components/ProtectedPageContainer"),
  { ssr: false }
);

const BlogPage = ({}) => {
  const session = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const router = useRouter();

  // methods
  const checkIfLiked = async (upvoterArrays) => {
    const localIsLiked = upvoterArrays.includes(session.user.id);
    setIsLiked(localIsLiked);
  };

  const fetchBlogPostData = async () => {
    const { id } = router.query;

    const { data, error } = await __supabase
      .from("public_posts")
      .select(
        "id,content,comments,createdAt,updatedAt,uploader(id,full_name,username),upvoters"
      )
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    return data;
  };

  const blogPost = useQuery({
    queryKey: ["blogPost"],
    queryFn: fetchBlogPostData,
    enabled: !!session && !!router.query.id,
    onSuccess: (data) => {
      checkIfLiked(data.upvoters);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const upvoteHandler = async (e) => {
    // disable the button while processing
    e.target.disabled = true;
    toast.loading("Processing...");

    // fetch current upvoters
    const { data: currentData, error: currentDataError } = await __supabase
      .from("public_posts")
      .select("upvoters")
      .eq("id", blogPost.data.id)
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
        .eq("id", blogPost.data.id);

      if (removeUpvoteError) {
        console.log(removeUpvoteError);
        return;
      }

      setIsLiked(false);
      toast.dismiss();
      e.target.disabled = false;
      blogPost.refetch();
      return;
    }

    // if user hasn't liked the post, add the upvote
    const newUpvoters = [...currentData.upvoters, session.user.id];

    const { error: addUpvoteError } = await __supabase
      .from("public_posts")
      .update({
        upvoters: newUpvoters,
      })
      .eq("id", blogPost.data.id);

    if (addUpvoteError) {
      console.log(addUpvoteError);
      return;
    }

    setIsLiked(true);
    toast.dismiss();
    e.target.disabled = false;
    blogPost.refetch();
  };

  return (
    <>
      <ProtectedPageContainer>
        {!!blogPost.isSuccess && (
          <>
            <motion.main
              variants={__PageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative min-h-screen w-full flex justify-center pt-24 pb-36"
            >
              <div className="w-full max-w-2xl">
                <div className="flex items-center gap-3 lg:bg-base-200 lg:p-5 lg:rounded-btn">
                  <Link
                    href={
                      session.user.id === blogPost.data.uploader.id
                        ? "/me"
                        : `/h/${blogPost.data.uploader.username}`
                    }
                  >
                    <img
                      src={`https://avatars.dicebear.com/api/bottts/${blogPost.data.uploader.username}.svg`}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  </Link>
                  <div className="flex flex-col gap-1">
                    <Link
                      href={
                        session.user.id === blogPost.data.uploader.id
                          ? "/me"
                          : `/h/${blogPost.data.uploader.username}`
                      }
                    >
                      <p className=" font-semibold leading-none hover:underline underline-offset-4">
                        {blogPost.data.uploader.full_name.first}{" "}
                        {blogPost.data.uploader.full_name.last}
                      </p>
                    </Link>
                    <p className="text-gray-500 text-sm leading-none">
                      {dayjs(blogPost.data.createdAt).format("MMMM D, YYYY")}
                    </p>
                  </div>
                </div>

                <div className="mt-10 lg:p-5">
                  <ReactMarkdown
                    // components={markdownRenderer}
                    rehypePlugins={[rehypeRaw]}
                    className="prose prose-a:text-primary prose-lead:underline underline-offset-4"
                  >
                    {blogPost.data.content}
                  </ReactMarkdown>
                </div>

                <div className="flex items-center justify-between mt-10 lg:p-5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={upvoteHandler}
                      className={`btn gap-2 items-center ${
                        isLiked ? "btn-primary" : "btn-ghost"
                      }`}
                    >
                      <FiArrowUp />
                      <span>{blogPost.data.upvoters.length ?? 0}</span>
                    </button>
                    <button
                      onClick={() => setIsCommenting(!isCommenting)}
                      className="btn btn-ghost gap-2 items-center"
                    >
                      <FiMessageSquare />
                      <span>{blogPost.data.comments.length ?? 0}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="btn btn-ghost">Share</button>
                  </div>
                </div>

                {/* add comment section */}
                <AnimatePresence mode="wait">
                  {isCommenting && (
                    <motion.div
                      key={`comment-section-${isCommenting}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 0.2, ease: "circOut" },
                      }}
                      className="mt-10 lg:p-5"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://avatars.dicebear.com/api/bottts/${session.user.user_metadata.username}.svg`}
                          alt="avatar"
                          className="w-10 h-10 rounded-full"
                        />

                        <div className="flex flex-col gap-1">
                          <p className=" font-semibold leading-none">
                            {session.user.user_metadata.full_name.first}{" "}
                            {session.user.user_metadata.full_name.last}
                          </p>
                          <p className="opacity-50 text-sm leading-none">
                            {dayjs().format("MMMM D, YYYY")}
                          </p>
                        </div>
                      </div>

                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const commentContent = e.target.commentContent.value;

                          // disable the form
                          e.target.disabled = true;

                          if (commentContent.length === 0) {
                            toast.error("Comment cannot be empty!");
                            return;
                          }

                          // fetch latest data
                          const { data: latestData, error: latestDataError } =
                            await __supabase
                              .from("public_posts")
                              .select("comments")
                              .single()
                              .eq("id", blogPost.data.id);

                          if (latestDataError || !latestData) {
                            console.log(latestDataError);
                            toast.error("Something went wrong!");
                            return;
                          }

                          const newComment = {
                            id: uuidv4(),
                            content: commentContent,
                            createdAt: dayjs().format(),
                            commenter: {
                              id: session.user.id,
                              username: session.user.user_metadata.username,
                              full_name: session.user.user_metadata.full_name,
                            },
                          };

                          const newComments = [
                            ...latestData.comments,
                            newComment,
                          ];

                          const { error } = await __supabase
                            .from("public_posts")
                            .update({
                              comments: newComments,
                            })
                            .eq("id", blogPost.data.id);

                          if (error) {
                            console.log(error);
                            toast.error("Something went wrong!");
                            return;
                          }

                          e.target.reset();
                          toast.success("Comment posted!");
                          setIsCommenting(false);
                          blogPost.refetch();
                        }}
                        className="mt-5"
                      >
                        <textarea
                          name="commentContent"
                          className="w-full h-32 p-3 bg-base-200 rounded-btn"
                          placeholder="Write a comment..."
                        />

                        <div className="flex justify-between mt-3 gap-2">
                          <p>Markdown</p>
                          <div>
                            <button type="reset" className="btn btn-ghost ml-3">
                              Clear and Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                              Post
                            </button>
                          </div>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="divider" />

                {/* comments */}
                {!!blogPost.data.comments ? (
                  <div className="mt-10 lg:p-5 flex flex-col gap-5">
                    {blogPost.data.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex flex-col bg-base-200 p-5 rounded-btn gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://avatars.dicebear.com/api/bottts/${comment.commenter.username}.svg`}
                            alt="avatar"
                            className="w-10 h-10 rounded-full"
                          />

                          <div className="flex flex-col gap-1">
                            <p className=" font-semibold leading-none">
                              {comment.commenter.full_name.first}{" "}
                              {comment.commenter.full_name.last}
                            </p>
                            <p className="text-gray-500 text-sm leading-none">
                              {dayjs(comment.createdAt).format(
                                "MMMM D, YYYY - HH:mm"
                              )}
                            </p>
                          </div>
                        </div>

                        <ReactMarkdown
                          rehypePlugins={[rehypeRaw]}
                          className="prose"
                        >
                          {comment.content}
                        </ReactMarkdown>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-10 lg:p-5 flex flex-col gap-5">
                    <p className="opacity-50 text-center">No comments yet!</p>
                  </div>
                )}
              </div>
            </motion.main>
          </>
        )}
      </ProtectedPageContainer>
    </>
  );
};

export default BlogPage;
