import { useEffect, useInsertionEffect, useState } from "react";

import { FiArrowUp } from "react-icons/fi";
import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { __PageTransition } from "../../../lib/animation";
import { __supabase } from "../../../supabase";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import rehypeRaw from "rehype-raw";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useSession } from "@supabase/auth-helpers-react";
import uuidv4 from "../../../lib/uuidv4";

const BlogPage = ({}) => {
  const session = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const router = useRouter();

  const checkIfLiked = async (blogPostData) => {
    const localIsLiked = blogPostData.upvoters.includes(session.user.id);
    setIsLiked(localIsLiked);
  };

  const fetchBlogPostData = async () => {
    const { id } = router.query;

    const { data, error } = await __supabase
      .from("public_posts")
      .select(
        "id,content,comments,createdAt,updatedAt,uploader(id,fullName,username),upvoters"
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
      checkIfLiked(data);
      console.log("Success");
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
    console.log("Is liked: ", localIsLiked);

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
    blogPost.isSuccess && (
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
                  session.user.id === blogPost.data.uploader
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
                    session.user.id === blogPost.data.uploader
                      ? "/me"
                      : `/h/${blogPost.data.uploader}`
                  }
                >
                  <p className=" font-semibold leading-none hover:underline underline-offset-4">
                    {blogPost.data.uploader.fullName.first}{" "}
                    {blogPost.data.uploader.fullName.last}
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
                  className={`btn gap-2 ${
                    isLiked ? "btn-primary" : "btn-ghost"
                  }`}
                >
                  <FiArrowUp />
                  <span>{blogPost.data.upvoters.length}</span>
                </button>
                <button
                  onClick={() => setIsCommenting(!isCommenting)}
                  className="btn btn-ghost"
                >
                  Comment
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button className="btn btn-ghost">Share</button>
              </div>
            </div>

            {/* add comment section */}
            {isCommenting && (
              <div className="mt-10 lg:p-5">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://avatars.dicebear.com/api/bottts/${session.user.user_metadata.username}.svg`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />

                  <div className="flex flex-col gap-1">
                    <p className=" font-semibold leading-none">
                      {session.user.user_metadata.fullName.first}{" "}
                      {session.user.user_metadata.fullName.last}
                    </p>
                    <p className="text-gray-500 text-sm leading-none">
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

                    if (latestDataError) {
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
                        fullName: session.user.user_metadata.fullName,
                      },
                    };

                    const newComments = [...latestData.comments, newComment];

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
              </div>
            )}
            <div className="divider" />

            {/* comments */}
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
                        {comment.commenter.fullName.first}{" "}
                        {comment.commenter.fullName.last}
                      </p>
                      <p className="text-gray-500 text-sm leading-none">
                        {dayjs(comment.createdAt).format(
                          "MMMM D, YYYY - HH:mm"
                        )}
                      </p>
                    </div>
                  </div>

                  <ReactMarkdown
                    // components={markdownRenderer}
                    rehypePlugins={[rehypeRaw]}
                    className="prose"
                  >
                    {comment.content}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          </div>
        </motion.main>
      </>
    )
  );
};

export default BlogPage;
