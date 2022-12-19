import { AnimatePresence, motion } from "framer-motion";
import {
  FiHeart,
  FiLoader,
  FiMessageSquare,
  FiMoreHorizontal,
  FiShare2,
} from "react-icons/fi";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { __PageTransition } from "../../../lib/animation";
// import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { __supabase } from "../../../supabase";
import dayjs from "dayjs";
import rehypeRaw from "rehype-raw";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const markdownRederers = {
  ul: ({ children }) => <ul className="list-disc">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal">{children}</ol>,
  li: ({ children }) => <li className="ml-4">{children}</li>,
  h2: ({ children }) => <h2 className="text-2xl">{children}</h2>,
  h3: ({ children }) => <h3 className="text-xl">{children}</h3>,
  h4: ({ children }) => <h4 className="text-lg">{children}</h4>,
};

const BlogPost = () => {
  const router = useRouter();
  // const __supabase = useSupabaseClient();
  const [localUser, setLocalUser] = useState();
  const [loaded, setLoaded] = useState(false);
  const [blogPost, setBlogPost] = useState(null);

  const fetchBlogPost = async () => {
    const {
      data: { user },
    } = await __supabase.auth.getUser();

    const { data, error } = await __supabase
      .from("hunt_blog")
      .select("*")
      .eq("id", router.query.uuid)
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }

    setBlogPost(data);
    setLocalUser(user);
    setTimeout(() => {
      setLoaded(true);
    }, 500);
  };

  useEffect(() => {
    if (router.query.uuid) {
      fetchBlogPost();
    }
  }, [router.query.uuid]);

  if (!loaded) {
    return (
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative min-h-screen w-full flex flex-col items-center justify-center pt-24 pb-36"
      >
        <FiLoader className="animate-spin text-4xl text-primary" />
      </motion.main>
    );
  }

  return (
    loaded && (
      <>
        <AnimatePresence mode="wait">
          <motion.main
            key={blogPost.id}
            variants={__PageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative min-h-screen w-full flex flex-col pt-24 pb-36"
          >
            <div className=" w-full max-w-xl mx-auto">
              {/* uploader */}
              <div className="flex items-center gap-3">
                <Link href={`/h/${blogPost.uploader.username}`}>
                  <Image
                    src={`https://avatars.dicebear.com/api/bottts/${blogPost.uploader.username}.svg`}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </Link>
                <div>
                  <Link href={`/h/${blogPost.uploader.username}`}>
                    <p className="font-semibold hover:text-primary">
                      {blogPost.uploader.username}
                    </p>
                  </Link>
                  <p className="text-sm text-gray-500 leading-none">
                    {dayjs(blogPost.createdAt).format("MMMM D, YYYY")}
                  </p>
                </div>
              </div>

              {/* content */}
              <div className="mt-7">
                <ReactMarkdown
                  components={markdownRederers}
                  rehypePlugins={[rehypeRaw]}
                >
                  {blogPost.content}
                </ReactMarkdown>
              </div>

              {/* react button, comment button, and share button */}
              <div className="flex items-center justify-between mt-7">
                <div className="flex items-center gap-3">
                  <button className="btn btn-ghost">
                    <FiHeart />
                  </button>
                  <button
                    onClick={() => {
                      window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: "smooth",
                      });
                    }}
                    className="btn btn-ghost items-center gap-2"
                  >
                    <FiMessageSquare className="text-lg" />
                    Comment
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button className="btn btn-ghost items-center gap-2">
                    <FiShare2 className="text-lg" />
                    Share
                  </button>
                </div>
              </div>

              {/* divider */}
              <div className="divider" />

              {/* comments */}
              <div className="mt-7">
                {/* comment input */}
                <form className="mb-10">
                  <div className="flex items-center gap-3">
                    <Image
                      src={`https://avatars.dicebear.com/api/bottts/${localUser.user_metadata.username}.svg`}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      className="input input-bordered w-full"
                    />
                  </div>
                </form>
                {/* all comments */}
                <div className="flex flex-col gap-3">
                  {blogPost.comments.map((comment, index) => (
                    <div
                      key={`comment-${index}`}
                      className="bg-base-300 p-5 rounded-btn"
                    >
                      <div className="flex items-center gap-3">
                        <Link href={`/h/${comment.uploaderDetails.username}`}>
                          <Image
                            src={`https://avatars.dicebear.com/api/bottts/${comment.uploaderDetails.username}.svg`}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        </Link>
                        <div>
                          <Link href={`/h/${comment.uploaderDetails.username}`}>
                            <p className="font-semibold hover:text-primary">
                              {comment.uploaderDetails.username}
                            </p>
                          </Link>
                          <p className="text-sm text-gray-500 leading-none">
                            {dayjs(comment.createdAt).format("MMMM DD, YYYY")}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <ReactMarkdown
                          components={markdownRederers}
                          rehypePlugins={[rehypeRaw]}
                        >
                          {comment.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.main>
        </AnimatePresence>
      </>
    )
  );
};

export default BlogPost;
