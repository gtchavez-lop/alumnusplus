import "quill/dist/quill.snow.css";

import { FiHeart, FiLoader, FiMoreHorizontal, FiShare2 } from "react-icons/fi";
import { useEffect, useState } from "react";

import FeedCard from "../components/FeedCard";
import FeedRecomUser from "../components/FeedRecomUser";
import { __PageTransition } from "../lib/animtions";
import __supabase from "../lib/supabase";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useQuill } from "react-quilljs";
import { useRouter } from "next/router";

const PageFeed = ({}) => {
  const router = useRouter();
  const [currentConnections, setCurrentConnections] = useState([]);
  const [feed, setFeed] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [["bold", "italic", "underline"]],
    },
    placeholder: "Compose an meaningful message to everyone...",
    theme: "snow",
  });
  const user = __supabase.auth.user();

  // query for recommended users
  const __recommendedUsers = useQuery(["recommendedUsers"], async () => {
    let currentConnections = user.user_metadata.connections
      ? JSON.parse(user.user_metadata.connections)
      : [];

    let list = [user.id, ...currentConnections];

    const res = await fetch(
      "/api/recommendedUsers?" +
        new URLSearchParams({
          connectionsList: JSON.stringify(list),
          id: user.id,
        })
    );

    return res.json();
  });

  // query for feed
  const __feed = useQuery(["feed"], async (e) => {
    let currentConnections = user.user_metadata.connections
      ? JSON.parse(user.user_metadata.connections)
      : [];

    let list = [user.id, ...currentConnections];

    const res = await fetch(
      "/api/feed?" +
        new URLSearchParams({
          connectionsList: JSON.stringify(list),
          id: user.id,
        })
    );

    let { data } = await res.json();
    return data;
  });

  const postFeed = async () => {
    // check if the length of the content is greater than 0
    if (quill.getLength() > 1) {
      toast.loading("Posting feed...");

      const content = quill.root.innerHTML;

      __supabase
        .from("user_feed")
        .insert([
          {
            content,
            uploader_id: __supabase.auth.user().id,
            uploader_handler: __supabase.auth.user().user_metadata.username,
            uploader_email: __supabase.auth.user().email,
          },
        ])
        .then(({ data, error }) => {
          // reset feed

          if (error) {
            toast.dismiss();
            toast.error(error.message);
          } else {
            setFeed([]);
            quill.root.innerHTML = "";
            toast.dismiss();
            toast.success("Posted feed!");
            setFeed([data[0], ...feed]);
          }
        });
    } else {
      toast.error("Please enter some content!");
    }
  };

  return (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="pt-24 lg:pt-14"
      >
        {__feed.isLoading && (
          <div className="flex justify-center items-center h-[500px]">
            <FiLoader className="animate-spin text-2xl" />
          </div>
        )}

        {__feed.isSuccess && (
          <>
            <motion.div
              variants={__PageTransition}
              initial="initial"
              animate="animate"
              className="grid grid-cols-5 gap-4 relative min-h-screen"
            >
              <div className="col-span-full lg:col-span-3 flex flex-col items-center gap-4">
                {/* editor */}
                <div className="w-full max-w-xl h-52 mb-16 flex flex-col">
                  <div className="">
                    <div ref={quillRef} />
                  </div>
                  <div className="flex justify-end mt-16">
                    <button onClick={postFeed} className="btn btn-primary ">
                      Post
                    </button>
                  </div>
                </div>

                {/* card */}
                {/* loop the first two only first */}
                {__feed.data.map((item, index) => {
                  if (index < 2) {
                    return <FeedCard key={item.id} item={item} />;
                  }
                })}

                {/* loop 3 recommended users on mobile only */}
                {__recommendedUsers.isSuccess &&
                  __recommendedUsers.data.length > 0 && (
                    <>
                      <div className="lg:hidden flex flex-col gap-3 w-full my-10 max-w-xl">
                        <p className="mx-5">
                          <span className="font-bold">Recommended</span> for you
                        </p>
                        {__recommendedUsers.data.map((item, index) => {
                          return (
                            <FeedRecomUser key={item.user_id} user={item} />
                          );
                        })}
                      </div>
                    </>
                  )}

                {/* continue the loop of the feed */}
                {__feed.data.map((item, index) => {
                  if (index > 1) {
                    return <FeedCard key={item.id} item={item} />;
                  }
                })}
              </div>

              <div className="col-span-2 hidden lg:flex flex-col gap-5 sticky top-32 h-max">
                <p className="text-xl">Recommended Users</p>

                <div className="flex flex-col gap-3">
                  {/* cards */}
                  {__recommendedUsers.isSuccess &&
                    __recommendedUsers.data.length > 0 &&
                    recommendedUsers.map((item, index) => {
                      return <FeedRecomUser key={item.user_id} user={item} />;
                    })}

                  {/* if empty */}
                  {__recommendedUsers.isSuccess &&
                    __recommendedUsers.data.length < 1 && (
                      <div className="flex flex-col">
                        <p className="text-primary font-bold">
                          No recommended users
                        </p>
                        <p className="text-primary text-sm">
                          Try connecting later.
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </motion.main>
    </>
  );
};

export default PageFeed;

// <div className="grid grid-cols-5 gap-4 relative min-h-screen">
// <div className="col-span-full lg:col-span-3 flex flex-col items-center gap-4">
//   {/* editor */}
//   <div className="w-full max-w-xl h-52 mb-16 flex flex-col">
//     <div className="">
//       <div ref={quillRef} />
//     </div>
//     <div className="flex justify-end mt-16">
//       <button onClick={postFeed} className="btn btn-primary ">
//         Post
//       </button>
//     </div>
//   </div>

// </div>
// </div>
