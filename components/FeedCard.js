import {
  FiAlertCircle,
  FiHeart,
  FiMoreHorizontal,
  FiShare2,
  FiTrash2,
} from "react-icons/fi";
import { useEffect, useState } from "react";

import __supabase from "../lib/supabase";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const FeedCard = ({ item }) => {
  const {
    feed_id,
    created_at,
    uploader_handler,
    content,
    upvoted_by,
    uploader_id,
  } = item;

  const [owner, setOwner] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [upvvoteList, setUpvoteList] = useState([]);

  const __owner = useQuery([`user_${uploader_handler}`], async () => {
    const res = await fetch(
      "/api/singleUser?" +
        new URLSearchParams({
          id: uploader_id,
        })
    );

    return await res.json();
  });

  useEffect(() => {
    if (upvoted_by) {
      const parsedUpvotedBy = JSON.parse(upvoted_by);
      setUpvoteList(parsedUpvotedBy);
      if (parsedUpvotedBy.includes(__supabase.auth.user().id)) {
        setUpvoted(true);
      }
    }
  }, []);

  const handleUpvote = () => {
    if (upvoted) {
      const newUpvoteList = upvvoteList.filter(
        (item) => item !== __supabase.auth.user().id
      );
      setUpvoteList(newUpvoteList);
      setUpvoted(false);

      __supabase
        .from("user_feed")
        .update({ upvoted_by: JSON.stringify(newUpvoteList) })
        .eq("feed_id", feed_id)
        .then(({ data, error }) => {
          if (error) {
            console.log(error);
          }
        });
    } else {
      const newUpvoteList = [...upvvoteList, __supabase.auth.user().id];
      setUpvoteList(newUpvoteList);
      setUpvoted(true);

      __supabase
        .from("user_feed")
        .update({ upvoted_by: JSON.stringify(newUpvoteList) })
        .eq("feed_id", feed_id)
        .then(({ data, error }) => {
          if (error) {
            console.log(error);
          }
        });
    }
  };

  const deletePost = () => {
    __supabase
      .from("user_feed")
      .delete()
      .eq("feed_id", feed_id)
      .then(({ data, error }) => {
        if (error) {
          console.log(error);
        } else {
          toast.success("Post deleted successfully!");
        }
      });
  };

  return (
    <>
      {__owner.isSuccess && __owner.data && (
        <>
          <div className="p-5 bg-base-300 bg-opacity-20 rounded-btn max-w-xl w-full break-word overflow-hidden">
            <div className="flex justify-between mb-10">
              <div className="flex items-center gap-3 w-full">
                <img
                  src={`https://avatars.dicebear.com/api/micah/${uploader_handler}.svg`}
                  alt="avatar"
                  className="w-12 h-12 rounded-full bg-white"
                />
                <div>
                  <h3 className="text-lg font-semibold">@{uploader_handler}</h3>
                  <p className="text-xs md:text-sm text-base-content opacity-50">
                    {__owner.data.first_name} {__owner.data.last_name} ·{" "}
                    {dayjs(created_at).format("D/M/YY h:mm A")}
                  </p>
                </div>
                {/* <div className="btn btn-ghost ml-auto btn-circle">
                  <FiMoreHorizontal />
                </div> */}
              </div>
            </div>

            <div dangerouslySetInnerHTML={{ __html: content }} />

            <div className="divider" />
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                {upvoted ? (
                  <motion.div
                    onClick={handleUpvote}
                    className="btn btn-ghost btn-circle text-lg text-white overflow-visible"
                  >
                    <motion.div animate={{ scale: [1, 2, 1] }}>
                      <FiHeart
                        fill="rgb(220, 38, 38)"
                        stroke="rgb(220, 38, 38)"
                      />
                    </motion.div>
                  </motion.div>
                ) : (
                  <div
                    onClick={handleUpvote}
                    className="btn btn-ghost btn-circle text-lg"
                  >
                    <FiHeart />
                  </div>
                )}

                <span className={`${upvvoteList.length < 1 && "text-xs"}`}>
                  {upvvoteList.length > 0
                    ? upvvoteList.length
                    : "be the first to react"}
                </span>
              </div>
              <div className="dropdown dropdown-top dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle ">
                  <FiMoreHorizontal />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow-lg mb-3 bg-base-100 rounded-box w-max"
                >
                  {/* only show delete option when its the user's post */}
                  {__supabase.auth.user().id === item.uploader_id && (
                    <li>
                      <label
                        htmlFor="deleteModal"
                        className="modal-button text-red-500 font-bold"
                      >
                        <FiTrash2 className="inline-block" />
                        Delete Post
                      </label>
                    </li>
                  )}
                  <li>
                    <a>
                      <FiAlertCircle className="inline-block" />
                      Report
                    </a>
                  </li>
                  <li>
                    <a>
                      <FiShare2 className="inline-block" />
                      Share
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* skeleton if not loaded */}
      {__owner.isLoading && (
        <>
          <div className="p-5 bg-base-200 bg-opacity-50 rounded-btn max-w-xl w-full">
            <div className="flex justify-between mb-10">
              <div className="flex items-center gap-3 w-full">
                <div className="w-12 h-12 rounded-full bg-base-300 animate-pulse" />
                <div className="flex flex-col gap-1">
                  <div className="w-32 h-4 rounded-full bg-base-300 animate-pulse" />
                  <div className="w-24 h-4 rounded-full bg-base-300 animate-pulse" />
                </div>
                <div className="btn btn-ghost ml-auto btn-circle">
                  <FiMoreHorizontal />
                </div>
              </div>
            </div>

            <div className="w-full h-32 bg-base-300 animate-pulse" />

            {/* <div className="divider" /> */}
            {/* <div className="flex justify-between">
              <div className="btn bg-red-500 border-red-500 hover:bg-red-600 btn-circle btn-sm">
                <FiHeart />
              </div>
              <div className="btn btn-ghost btn-circle btn-sm">
                <FiShare2 />
              </div>
            </div> */}
          </div>
        </>
      )}

      {/* delete post modal */}
      <input type="checkbox" id="deleteModal" className="modal-toggle" />
      <label htmlFor="deleteModal" className="modal cursor-pointer">
        <label className="modal-box relative">
          <h3 className="text-lg font-bold">
            Are you sure you want to delete this post?
          </h3>
          <p className="text-base-content text-opacity-50">
            This action cannot be undone.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-10">
            <button onClick={deletePost} className="btn btn-error ">
              Delete
            </button>
            <label htmlFor="deleteModal" className="btn btn-ghost">
              Cancel
            </label>
          </div>
        </label>
      </label>
    </>
  );
};

export default FeedCard;
