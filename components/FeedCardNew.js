import { AnimatePresence, motion } from "framer-motion";
import {
  FiAlertTriangle,
  FiHeart,
  FiMessageCircle,
  FiMoreHorizontal,
  FiShare2,
  FiTrash2,
} from "react-icons/fi";
import { useEffect, useState } from "react";

import __supabase from "../lib/supabase";
import dayjs from "dayjs";
import draftToHtml from "draftjs-to-html";
import toast from "react-hot-toast";

// uuidv4 generator for unique id
const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const FeedCardNew = ({ feedItem }) => {
  const {
    id,
    uploaderData,
    content,
    created_at,
    uploader_email,
    upvoters,
    comments,
  } = feedItem;

  const [upvoterList, setUpvoterList] = useState(upvoters);
  const [localUser, setLocalUser] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const [theme, setTheme] = useState();

  const [upvoted, setUpvoted] = useState(false);
  const [upvoteLoading, setUpvoteLoading] = useState(false);
  const [isSelfPost, setIsSelfPost] = useState(false);
  const [toggleComment, setToggleComment] = useState(false);

  const handleUpvote = async () => {
    setUpvoteLoading(true);
    const user = await __supabase.auth.user();

    const { data: latestUpvoterList } = await __supabase
      .from("hunt_blog")
      .select("*")
      .single()
      .eq("id", id);

    if (upvoted) {
      const newList = latestUpvoterList.upvoters.filter(
        (item) => item.id !== user.id
      );

      const { error } = await __supabase
        .from("hunt_blog")
        .update({ upvoters: newList })
        .eq("id", id);

      if (error) {
        toast.error(error.message);
      } else {
        setUpvoted(false);
        setUpvoteLoading(false);
      }
    } else {
      const newList = [
        ...upvoterList,
        {
          id: user.id,
          email: user.email,
          username: user.user_metadata.username,
        },
      ];

      const { error } = await __supabase
        .from("hunt_blog")
        .update({ upvoters: newList })
        .eq("id", id);

      if (error) {
        toast.error(error.message);
      }
      setUpvoted(true);
      setUpvoteLoading(false);
    }
  };

  const checkIfUpvoted = async () => {
    const user = await __supabase.auth.user();

    if (user && upvoters !== null) {
      const upvoted = upvoters.some((upvoter) => upvoter.id === user.id);
      setUpvoted(upvoted);
    }
  };

  const checkIfSelfPost = async () => {
    const user = await __supabase.auth.user();

    if (user) {
      const isSelfPost = user.id === uploaderData.id;
      setIsSelfPost(isSelfPost);
    }
  };

  const handleDeletePost = async () => {
    const { error } = await __supabase.from("hunt_blog").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Post deleted!");
    }
  };

  const fetchUser = async () => {
    const user = await __supabase.auth.user();
    setLocalUser(user);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    //check if pressed enter
    if (e.keyCode === 13) {
      const user = await __supabase.auth.user();
      toast.loading("Adding comment...");

      const commentdata = {
        id: uuidv4(),
        content: e.target.value,
        created_at: new Date().toISOString(),
        uploader: {
          id: user.id,
          email: user.email,
          username: user.user_metadata.username,
          name: {
            first: user.user_metadata.first_name,
            last: user.user_metadata.last_name,
          },
        },
      };

      const { error } = await __supabase
        .from("hunt_blog")
        .update({
          comments: [...comments, commentdata],
        })
        .eq("id", id);

      toast.dismiss();

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Comment added!");
        e.target.value = "";
      }
    }
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setTheme(theme);

    fetchUser();
    checkIfUpvoted();
    checkIfSelfPost();
  }, []);

  return (
    <>
      <div
        id={`feed-card-${id}`}
        className="p-3 border-b border-primary border-opacity-50 flex flex-col gap-4 last:border-b-transparent"
      >
        <div className="flex items-center">
          <img
            src={`https://avatars.dicebear.com/api/micah/${uploaderData.username}.svg`}
            alt="avatar"
            className="w-10 h-10 rounded-full bg-base-300"
          />
          <div className="ml-2 flex flex-col gap-1">
            <p className="font-bold leading-none">@{uploaderData.username}</p>
            <p className="text-xs opacity-50 leading-none">
              {dayjs(created_at).format("MMM DD YYYY hh:mm A")}
            </p>
          </div>
          <div className="ml-auto">
            <div className="dropdown dropdown-left">
              <label tabIndex={0} className="btn btn-sm btn-ghost">
                <FiMoreHorizontal />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu menu-compact p-2 shadow bg-base-200 rounded-box w-52 mr-2"
              >
                <li>
                  <a>
                    <span>
                      <FiAlertTriangle />
                    </span>
                    <span>Report</span>
                  </a>
                </li>
                {isSelfPost && (
                  <li>
                    <label
                      htmlFor={`delete-post-${id}`}
                      className="text-error flex"
                    >
                      <span>
                        <FiTrash2 />
                      </span>
                      <span>Delete</span>
                    </label>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <motion.div
          animate={{
            height: showMore ? "auto" : content.length < 200 ? "auto" : "110px",
          }}
          transition={{ duration: 0.5 }}
          className="px-3 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {content.length > 200 && (
          <div className="flex justify-end">
            <button
              onClick={() => setShowMore(!showMore)}
              className="btn btn-link"
            >
              {showMore ? "Show less" : "Show more"}
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 ">
            <button
              onClick={handleUpvote}
              disabled={upvoteLoading}
              className={`btn btn-sm btn-ghost ${upvoteLoading && "loading"}`}
            >
              {!upvoteLoading && (
                <FiHeart
                  fill={upvoted ? "#DC2626" : "transparent"}
                  stroke={upvoted ? "#DC2626" : "#3c83f6"}
                />
              )}
              {upvoterList !== null && upvoterList.length > 0 && (
                <span className="ml-2">{upvoterList.length}</span>
              )}
            </button>
            <button
              onClick={() => setToggleComment(!toggleComment)}
              className="btn btn-sm btn-ghost"
            >
              <FiMessageCircle />
              {comments !== null && comments.length > 0 && (
                <span className="ml-2">{comments.length}</span>
              )}
            </button>
            <button className="btn btn-sm btn-ghost ml-auto">
              <FiShare2 />
            </button>
          </div>
        </div>

        {/* comments */}
        <AnimatePresence mode="wait">
          {toggleComment && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex flex-col overflow-hidden gap-3  p-1"
            >
              {comments.length > 0 &&
                comments.map((comment, index) => (
                  <div
                    className="flex flex-col gap-2"
                    key={`comment_${index + 1}`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://avatars.dicebear.com/api/micah/${comment.uploader.username}.svg`}
                        alt="avatar"
                        className="w-10 h-10 rounded-full bg-base-300"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="font-bold leading-none">
                          @{comment.uploader.username}
                        </p>
                        <p className="text-xs opacity-50 leading-none">
                          {dayjs(comment.created_at).format(
                            "MMM DD YYYY hh:mm A"
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="ml-12 px-4 py-2 border-2 border-blue-500 border-opacity-20 rounded-box">
                      {comment.content}
                    </p>
                  </div>
                ))}

              {/* add comment */}
              <div className="flex items-center gap-2">
                <img
                  src={`https://avatars.dicebear.com/api/micah/${localUser.user_metadata.username}.svg`}
                  alt="avatar"
                  className="w-10 h-10 rounded-full bg-base-300"
                />
                <input
                  type="text"
                  placeholder="Add a comment..."
                  onKeyUp={handleAddComment}
                  className="input input-bordered w-full rounded-box"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* delete post modal */}
      <>
        <input
          type="checkbox"
          className="modal-toggle"
          id={`delete-post-${id}`}
        />
        <div className="modal">
          <label
            htmlFor={`delete-post-${id}`}
            className="btn btn-ghost btn-sm"
          />
          <div className="modal-box w-96">
            <div className="modal-title">
              <div className="flex items-center gap-2">
                <FiAlertTriangle />
                <h2 className="text-lg font-bold">Delete Post</h2>
              </div>
            </div>
            <div className="modal-body">
              <div className="modal-content">
                <p className="text-base">
                  Are you sure you want to delete this post?
                </p>
              </div>
            </div>
            <div className="modal-actions mt-5">
              <div className="w-full flex gap-2 justify-end">
                <button className="btn btn-error" onClick={handleDeletePost}>
                  Yes, delete it
                </button>
                <label htmlFor={`delete-post-${id}`} className="btn btn-ghost">
                  Cancel delete
                </label>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default FeedCardNew;
