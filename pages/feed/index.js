import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { EditorState, convertToRaw } from "draft-js";
import {
  FiBold,
  FiHeart,
  FiItalic,
  FiLoader,
  FiMoreHorizontal,
  FiShare2,
  FiUnderline,
} from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { useRealtime, useSelect } from "react-supabase";

import FeedCardNew from "../../components/FeedCardNew";
import FeedRecomUserNew from "../../components/FeedRecomUserNew";
import { __PageTransition } from "../../lib/animtions";
import __supabase from "../../lib/supabase";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

const Feed = (e) => {
  const [feed, setFeed] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [postContent, setPostContent] = useState({});

  useEffect(() => {
    const user = __supabase.auth.user();
    if (!localStorage.getItem("supabase.auth.token")) {
      router.push("/");
    } else {
      const token = localStorage.getItem("supabase.auth.token");
      const parsedToken = JSON.parse(token);
      const user = parsedToken.currentSession.user;
      setUser(user);
    }
  }, []);

  const [
    { data: feedData, error: feedError, fetching: feedLoading },
    FeedReExecute,
  ] = useRealtime("user_feed");

  const [
    { data: recomUserData, error: recomUserError, fetching: recomUserLoading },
  ] = useSelect("user_data", {
    columns: "data, user_id, created_at",
    order: "created_at",
    limit: 5,
  });

  if (feedError) {
    toast.error(error.message);
    FeedReExecute();
  }

  useEffect(() => {
    if (feedData) {
      let sorted = feedData.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setFeed(sorted);
    }

    if (recomUserData) {
      const token = localStorage.getItem("supabase.auth.token");
      const parsedToken = JSON.parse(token);
      const user = parsedToken.currentSession.user;
      const connections = user.user_metadata.connections;
      const filtered = recomUserData.filter((e) => {
        return !connections.includes(e.user_id) && e.user_id !== user.id;
      });

      setRecommendedUsers(filtered);
    }
  }, [feedData, recomUserData]);

  if (feedLoading || recomUserLoading || !feed || !recommendedUsers || !user) {
    return (
      <motion.div
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed top-0 left-0 flex flex-col justify-center items-center w-full min-h-screen"
      >
        <FiLoader className="animate-spin text-lg" />
        <p>Loading...</p>
      </motion.div>
    );
  }

  const handlePost = () => {
    if (postContent.blocks) {
      toast("Posting...");
      const token = localStorage.getItem("supabase.auth.token");
      const parsedToken = JSON.parse(token);
      const user = parsedToken.currentSession.user;

      __supabase
        .from("user_feed")
        .insert([
          {
            uploader_handler: user.user_metadata.username,
            uploader_id: user.id,
            body: postContent,
            uploader_email: user.email,
          },
        ])
        .then(({ error }) => {
          toast.dismiss();
          if (error) {
            toast.error(error.message);
          } else {
            toast.success("Posted!");
            setPostContent(null);
          }
        });
    } else {
      toast.error("Please enter some text");
    }
  };

  return (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="py-16 pt-20 lg:pt-16"
      >
        <div className="grid grid-cols-5 gap-5">
          <div className="col-span-full lg:col-span-3 flex flex-col gap-10">
            <div className="flex w-full gap-2">
              <img
                src={`https://dicebear.com/api/micah/${user.user_metadata.username}.svg`}
                className="w-12 h-12 rounded-full bg-base-300"
              />

              <div className="flex flex-col gap-2 rounded-box w-full">
                <div className="p-3 bg-base-300 bg-opacity-40 rounded-box">
                  {/* editor */}
                  <Editor
                    toolbarHidden
                    editorClassName="bg-transparent gap-0"
                    onEditorStateChange={(e) => {
                      let raw = convertToRaw(e.getCurrentContent());
                      setPostContent(raw);
                    }}
                  />
                </div>
                <button
                  onClick={handlePost}
                  className="btn btn-primary btn-sm mt-5"
                >
                  Post
                </button>
              </div>
            </div>

            {recommendedUsers.length > 0 && (
              <div className="flex flex-col gap-5 lg:hidden">
                <p className="text-lg font-semibold">Recommended Users</p>
                <div className="flex flex-col gap-5">
                  {recommendedUsers.map((item, index) => (
                    <FeedRecomUserNew user={item} key={`recom_user${index}`} />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col border border-primary border-opacity-50 rounded-box overflow-hidden ">
              {feed.map((item, index) => (
                <FeedCardNew feedItem={item} key={`feed_item${index}`} />
              ))}
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-2 sticky top-32 h-max">
            {recommendedUsers.length > 0 && (
              <>
                <p className="text-xl font-semibold">Recommended Users</p>
                <div className="flex flex-col mt-6 gap-3">
                  {recommendedUsers.map((item, index) => (
                    <FeedRecomUserNew user={item} key={`recom_user${index}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.main>
    </>
  );
};

export default Feed;
