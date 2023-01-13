import { useEffect, useInsertionEffect, useState } from "react";

import { FiArrowUp } from "react-icons/fi";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { __PageTransition } from "../../../lib/animation";
import { __supabase } from "../../../supabase";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import rehypeRaw from "rehype-raw";
import { toast } from "react-hot-toast";
import useLocalStorage from "../../../lib/localStorageHook";
import uuidv4 from "../../../lib/uuidv4";

const markdownRenderer = {
  h1: (props) => <h1 className="text-2xl font-bold" {...props} />,
  h2: (props) => <h2 className="text-xl font-bold mt-5" {...props} />,
  h3: (props) => <h3 className="text-lg font-bold mt-5" {...props} />,
  h4: (props) => <h4 className="text-base font-bold mt-5" {...props} />,
  h5: (props) => <h5 className="text-sm font-bold mt-5" {...props} />,
  h6: (props) => <h6 className="text-xs font-bold mt-5" {...props} />,
  ul: (props) => <ul className="list-disc ml-5" {...props} />,
  ol: (props) => <ol className="list-decimal ml-5" {...props} />,
};
// export const getStaticPaths = async () => {
//   const { data, error } = await __supabase
//   .from("public_posts")
//   .select("id")

//   if (error) {
//     console.log(error)
//     return
//   }

//   const paths = data.map(post => {
//     return {
//       params: { id: post.id }
//     }
//   })

//   return {
//     paths,
//     fallback: false
//   }
// }

export const getServerSideProps = async (context) => {
  // get blog post data
  const { data: blogPostData, error: blogPostDataError } = await __supabase
    .from("public_posts")
    .select("*")
    .eq("id", context.params.id)
    .single();

  if (blogPostDataError) {
    console.log(blogPostDataError);
    return;
  }

  return {
    props: {
      blogPostData,
    },
  };
};

const BlogPage = ({ blogPostData }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [authState] = useLocalStorage("authState");
  const [uploaderData, setUploaderData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const fetchUploaderData = async () => {
    const { data: uploader, error } = await __supabase
      .rpc("get_hunter_by_id", {
        input_id: blogPostData.uploaderID,
      })
      .single();

    if (error) {
      console.log(error);
      return;
    }

    setUploaderData(uploader);
    setIsLoaded(true);
  };

  const checkIfLiked = async () => {
    const localIsLiked = blogPostData.upvoters.includes(authState.id);
    setIsLiked(localIsLiked);
  };

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

    const localIsLiked = currentData.upvoters.includes(authState.id);
    console.log("Is liked: ", localIsLiked);

    // if user already liked the post, remove the upvote
    if (localIsLiked) {
      const newUpvoters = currentData.upvoters.filter(
        (id) => id !== authState.id
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

      setIsLiked(false);
      toast.dismiss();
      e.target.disabled = false;
      blogPostData.upvoters = newUpvoters;
      return;
    }

    // if user hasn't liked the post, add the upvote
    const newUpvoters = [...currentData.upvoters, authState.id];

    const { error: addUpvoteError } = await __supabase
      .from("public_posts")
      .update({
        upvoters: newUpvoters,
      })
      .eq("id", blogPostData.id);

    if (addUpvoteError) {
      console.log(addUpvoteError);
      return;
    }

    setIsLiked(true);
    toast.dismiss();
    e.target.disabled = false;
    blogPostData.upvoters = newUpvoters;
  };

  useEffect(() => {
    if (authState) {
      checkIfLiked();
    }
  }, [authState]);

  useEffect(() => {
    fetchUploaderData();
  }, []);

  return (
    isLoaded &&
    authState && (
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
              <img
                src={`https://avatars.dicebear.com/api/bottts/${uploaderData.username}.svg`}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col gap-1">
                <p className=" font-semibold leading-none">
                  {uploaderData.fullName.first} {uploaderData.fullName.last}
                </p>
                <p className="text-gray-500 text-sm leading-none">
                  {dayjs(blogPostData.createdAt).format("MMMM D, YYYY")}
                </p>
              </div>
            </div>

            <div className="mt-10 lg:p-5">
              <ReactMarkdown
                // components={markdownRenderer}
                rehypePlugins={[rehypeRaw]}
                className="prose prose-a:text-primary prose-lead:underline underline-offset-4"
              >
                {blogPostData.content}
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
                  <span>{blogPostData.upvoters.length}</span>
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
                    src={`https://avatars.dicebear.com/api/bottts/${authState.user_metadata.username}.svg`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />

                  <div className="flex flex-col gap-1">
                    <p className=" font-semibold leading-none">
                      {authState.user_metadata.fullName.first}{" "}
                      {authState.user_metadata.fullName.last}
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
                        .eq("id", blogPostData.id);

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
                        id: authState.id,
                        username: authState.user_metadata.username,
                        fullName: authState.user_metadata.fullName,
                      },
                    };

                    const newComments = [...latestData.comments, newComment];

                    const { error } = await __supabase
                      .from("public_posts")
                      .update({
                        comments: newComments,
                      })
                      .eq("id", blogPostData.id);

                    if (error) {
                      console.log(error);
                      toast.error("Something went wrong!");
                      return;
                    }

                    e.target.reset();
                    toast.success("Comment posted!");
                    blogPostData.comments = newComments;
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
              {blogPostData.comments.map((comment) => (
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
