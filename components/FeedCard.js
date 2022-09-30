import {
  FiArrowDown,
  FiArrowDownCircle,
  FiArrowUp,
  FiArrowUpCircle,
  FiLoader,
  FiShare2,
  FiTrash,
} from "react-icons/fi";
import { useEffect, useState } from "react";

import __supabase from "../lib/auth";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useUser } from "./UserContext";

const FeedCard = ({ item }) => {
  const { $userData } = useUser();
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [upvoted, setUpvoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [upvoterList, setUpvoterList] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let parsedUpvoters =
      item.upvoted_by != "" ? JSON.parse(item.upvoted_by) : [];
    setUpvoterList(parsedUpvoters);
    setUpvoteCount(parsedUpvoters.length);
    if (
      parsedUpvoters.filter((upvoter) => upvoter === $userData.id).length > 0
    ) {
      setUpvoted(true);
    }
  }, []);

  const handleUpvote = (e) => {
    setIsLoading(true);
    __supabase
      .from("user_feed")
      .update({
        upvoted_by: JSON.stringify([...upvoterList, $userData.id]),
      })
      .eq("feed_id", item.feed_id)
      .then((res) => {
        console.log(JSON.stringify([...upvoterList, $userData.id]));
        setUpvoted(true);
        setUpvoteCount(upvoteCount + 1);
        setUpvoterList([...upvoterList, $userData.id]);
        setIsLoading(false);
      });
  };

  const handleDownvote = (e) => {
    setIsLoading(true);
    __supabase
      .from("user_feed")
      .update({
        upvoted_by: JSON.stringify(
          upvoterList.filter((id) => id !== $userData.id)
        ),
      })
      .eq("feed_id", item.feed_id)
      .then((res) => {
        setUpvoted(false);
        setUpvoteCount(upvoteCount - 1);
        setUpvoterList(upvoterList.filter((id) => id !== $userData.id));
        setIsLoading(false);
      });
  };

  const handleRemove = (e) => {
    setIsLoading(true);
    console.log(item.feed_id);
    setIsDeleting(true);
    __supabase
      .from("user_feed")
      .delete()
      .match({ feed_id: item.feed_id })

      .then((res) => {
        console.log(res);
        setIsLoading(false);
      });
    // __supabase
    //   .from("user_feed")
    //   .delete()
    //   .eq("feed_id", item.feed_id)
    //   .then((res) => {
    //     setIsLoading(false);
    //   });
  };

  return (
    <motion.div
      key={item.feed_id}
      animate={{ scale: isDeleting ? 0 : 1, opacity: isDeleting ? 0 : 1 }}
      className="flex flex-col gap-3 p-5 bg-base-200 rounded-btn w-full max-w-xl mx-auto"
    >
      <div className="flex items-center gap-3">
        <img
          src={`https://avatars.dicebear.com/api/micah/${item.uploader_handler}.svg`}
          className="w-10 h-10 rounded-full bg-gray-400"
        />
        <div className="flex flex-col">
          <p className="font-semibold">@{item.uploader_handler}</p>
          <p className="text-base-content text-opacity-50 text-xs">
            {dayjs(item.created_at).format("MMM D, YYYY h:mm A")}
          </p>
        </div>

        {/* show remove button if the uploader id is the user's */}
        {item.uploader_id === $userData.id && (
          <button
            onClick={(e) => handleRemove(e)}
            className="btn btn-outline btn-error btn-xs btn-square ml-auto"
          >
            <FiTrash className="" />
          </button>
        )}
      </div>
      <div className="divider" />
      <p className="text-base-content">{item.content}</p>
      <div className="flex items-center justify-between gap-3 mt-8">
        <div className="flex items-center gap-3">
          {!upvoted ? (
            <button
              onClick={handleUpvote}
              disabled={isLoading}
              className="btn btn-primary gap-4 btn-sm"
            >
              {isLoading ? (
                <div className="animate-spin">
                  <FiLoader />
                </div>
              ) : (
                <>
                  <FiArrowUp className="text-lg" />
                  <span>{upvoteCount || 0}</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleDownvote}
              disabled={isLoading}
              className="btn btn-ghost gap-4 btn-sm"
            >
              {isLoading ? (
                <div className="animate-spin">
                  <FiLoader />
                </div>
              ) : (
                <>
                  <FiArrowDown className="text-lg" />
                  <span>{upvoteCount || 0}</span>
                  <span>You upvoted this</span>
                </>
              )}
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost gap-3 btn-sm">
            <FiShare2 className="text-lg" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedCard;
