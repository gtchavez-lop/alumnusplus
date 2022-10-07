import { FiHeart, FiMoreHorizontal, FiShare2 } from "react-icons/fi";
import { useEffect, useState } from "react";

import __directus from "../lib/directus";
import __supabase from "../lib/supabase";
import dayjs from "dayjs";
import { motion } from "framer-motion";

const FeedCard = ({ item }) => {
  const { feed_id, created_at, uploader_handler, content, upvoted_by } = item;

  const [owner, setOwner] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [upvvoteList, setUpvoteList] = useState([]);

  useEffect(() => {
    __supabase
      .from("user_data")
      .select("*")
      .eq("user_id", item.uploader_id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.log(error);
        } else {
          const parsedData = JSON.parse(data.data);
          setOwner(parsedData);
          setIsLoaded(true);
        }
      });

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

  return (
    <>
      {isLoaded && (
        <>
          <div className="p-5 bg-base-300 rounded-btn max-w-xl w-full break-all">
            <div className="flex justify-between mb-10">
              <div className="flex items-center gap-3 w-full">
                <img
                  src={`https://avatars.dicebear.com/api/micah/${uploader_handler}.svg`}
                  alt="avatar"
                  className="w-12 h-12 rounded-full bg-white"
                />
                <div>
                  <h3 className="text-lg font-semibold">@{uploader_handler}</h3>
                  <p className="text-sm text-base-content opacity-50">
                    {owner.first_name} {owner.last_name} ·{" "}
                    {dayjs(created_at).format("D/M/YY h:mm A")}
                  </p>
                </div>
                <div className="btn btn-ghost ml-auto btn-circle">
                  <FiMoreHorizontal />
                </div>
              </div>
            </div>

            <div dangerouslySetInnerHTML={{ __html: content }} />

            <div className="divider" />
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                {upvoted ? (
                  <motion.div
                    onClick={handleUpvote}
                    className="btn btn-ghost btn-circle btn-sm text-lg text-white overflow-visible"
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
                    className="btn btn-ghost btn-circle btn-sm text-lg"
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
              <div className="btn btn-ghost btn-circle btn-sm">
                <FiShare2 />
              </div>
            </div>
          </div>
        </>
      )}

      {/* skeleton if not loaded */}
      {!isLoaded && (
        <>
          <div className="p-5 bg-base-300 rounded-btn max-w-xl w-full">
            <div className="flex justify-between mb-10">
              <div className="flex items-center gap-3 w-full">
                <div className="w-12 h-12 rounded-full bg-base-100 animate-pulse" />
                <div className="flex flex-col gap-1">
                  <div className="w-32 h-4 rounded-full bg-base-100 animate-pulse" />
                  <div className="w-24 h-4 rounded-full bg-base-100 animate-pulse" />
                </div>
                <div className="btn btn-ghost ml-auto btn-circle">
                  <FiMoreHorizontal />
                </div>
              </div>
            </div>

            <div className="w-full h-32 bg-base-100 animate-pulse" />

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
    </>
  );
};

export default FeedCard;
