import { FiArrowUp, FiMessageSquare } from "react-icons/fi";
import { useEffect, useState } from "react";

import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { __supabase } from "../../supabase";
import rehypeRaw from "rehype-raw";
import { toast } from "react-hot-toast";
import useLocalStorage from "../../lib/localStorageHook";

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

const FeedCard = ({ data: blogPostData }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [uploaderData, setUploaderData] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [authState] = useLocalStorage("authState");

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

  // check if user liked the post
  const checkIfLiked = async () => {
    const localIsLiked = blogPostData.upvoters.includes(authState.id);
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
          upvoters: [...currentData.upvoters, authState.id],
        })
        .eq("id", blogPostData.id);

      if (addUpvoteError) {
        console.log(addUpvoteError);
        return;
      }

      blogPostData.upvoters = [...currentData.upvoters, authState.id];
      setIsLiked(true);
      e.target.disabled = false;
      toast.dismiss();
    }
  };

  useEffect(() => {
    if (blogPostData && authState) {
      fetchUploaderData();
    }
  }, [blogPostData, authState]);

  useEffect(() => {
    checkIfLiked();
  }, []);

  if (!isLoaded) {
    return (
      <div className="rounded-btn p-5 bg-base-200">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-base-100 animate-pulse" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-20 animate-pulse bg-base-100" />
            <div className="h-4 w-40 animate-pulse bg-base-100" />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <div className="h-4 w-full animate-pulse bg-base-100" />
          <div className="h-4 w-full animate-pulse bg-base-100" />
          <div className="h-4 w-full animate-pulse bg-base-100" />
          <div className="h-4 w-full animate-pulse bg-base-100" />
        </div>

        <div className="mt-5 flex justify-between">
          <div className="h-6 w-24 animate-pulse bg-base-100" />
          <div className="h-6 w-24 animate-pulse bg-base-100" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col p-5 rounded-btn bg-base-200">
        <div className="flex gap-3">
          <img
            // dicebear
            src={`https://avatars.dicebear.com/api/bottts/${uploaderData.username}.svg`}
            alt="avatar"
            className="w-10 h-10"
          />
          <div className="flex flex-col gap-1 justify-center">
            <p className="leading-none">
              {uploaderData.fullName.first} {uploaderData.fullName.last}{" "}
              <span className="text-primary opacity-50">posted</span>
            </p>
            <p className="opacity-50 leading-none">{uploaderData.username}</p>
          </div>
        </div>

        <div className="mt-5">
          <ReactMarkdown
            components={markdownRenderer}
            rehypePlugins={[rehypeRaw]}
            className="flex flex-col gap-2 max-h-28 overflow-hidden"
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
            <button className="btn btn-ghost">
              <FiMessageSquare className="font-bold" />
            </button>
          </div>
          <div className="flex gap-2">
            <Link href={`/h/blog/${blogPostData.id}`} className="btn btn-ghost">
              Read More
            </Link>
            <button className="btn btn-ghost">Share</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedCard;
