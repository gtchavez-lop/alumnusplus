import "quill/dist/quill.snow.css";

import { FiHeart, FiMoreHorizontal, FiShare2 } from "react-icons/fi";
import { useEffect, useState } from "react";

import FeedCard from "../components/FeedCard";
import { __PageTransition } from "../lib/animtions";
import __supabase from "../lib/supabase";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useQuill } from "react-quilljs";
import { useRouter } from "next/router";

const PageFeed = () => {
  const [feed, setFeed] = useState([]);
  const router = useRouter();
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [["bold", "italic", "underline"]],
    },
    placeholder: "Compose an meaningful message to everyone...",
  });

  const getFeed = () => {
    __supabase
      .from("user_feed")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          toast.error(error.message);
        } else {
          setFeed(data);
        }
      });
  };

  useEffect(() => {
    // check if user is signed in
    if (!__supabase.auth.user()) {
      router.push("/signin");
    } else {
      getFeed();
    }
  }, []);

  const postFeed = async () => {
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
        if (error) {
          toast.dismiss();
          toast.error(error.message);
        } else {
          quill.root.innerHTML = "";
          toast.dismiss();
          toast.success("Posted feed!");
          getFeed();
        }
      });
  };

  return (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="grid grid-cols-5 gap-4 relative min-h-screen">
          <div className="col-span-full lg:col-span-3 flex flex-col items-center gap-4">
            {/* editor */}
            <div className="w-full max-w-xl h-52 mb-16 flex flex-col">
              <div ref={quillRef} className="text-base-content" />
              <div className="flex justify-end mt-5">
                <button onClick={postFeed} className="btn btn-primary ">
                  Post
                </button>
              </div>
            </div>

            {/* card */}
            {feed &&
              feed.map((item, index) => <FeedCard key={index} item={item} />)}
          </div>
          <div className="col-span-2 hidden lg:flex flex-col gap-5 sticky top-32 h-max">
            <p className="text-xl">Recommended Users</p>

            <div className="flex flex-col gap-3">
              {/* cards */}
              {/* {Array(5)
                .fill()
                .map((e, index) => (
                  <div className="w-full flex items-center p-5 bg-base-200">
                    <img
                      src="https://avatars.dicebear.com/api/micah/your-custom-seed.svg"
                      alt="avatar"
                      className="w-10 h-10 rounded-full bg-white"
                    />
                    <div className="ml-3">
                      <h3 className="text-lg ">@someone</h3>
                      <p className="text-sm font-thin text-gray-500">
                        Someone IKnow
                      </p>
                    </div>
                  </div>
                ))} */}
            </div>
          </div>
        </div>
      </motion.main>
    </>
  );
};

export default PageFeed;
