import { FiHeart, FiMoreHorizontal, FiShare2 } from "react-icons/fi";
import { useEffect, useState } from "react";

import __supabase from "../lib/supabase";
import dayjs from "dayjs";
import draftToHtml from "draftjs-to-html";

const FeedCardNew = ({ feedItem }) => {
  const { uploader_handler, body, created_at, upvoteList, feed_id } = feedItem;
  const [theme, setTheme] = useState();

  const [upvoted, setUpvoted] = useState(false);

  const handleUpvote = () => {
    const user = JSON.parse(localStorage.getItem("supabase.auth.token"));
    const session = user.currentSession;
    const user_id = session.user.id;

    if (upvoted) {
      let newList = upvoteList.filter((e) => e !== user_id);
      upvoteList = newList;

      setUpvoted(false);

      __supabase
        .from("user_feed")
        .update({ upvoteList: upvoteList })
        .eq("feed_id", feed_id);
    } else {
      let newList = [...upvoteList, user_id];
      upvoteList = newList;
      setUpvoted(true);

      __supabase
        .from("user_feed")
        .update({ upvoteList: upvoteList })
        .eq("feed_id", feed_id);
    }
  };

  useEffect(() => {
    // check if user has upvoted
    const user = JSON.parse(localStorage.getItem("supabase.auth.token"));
    const theme = localStorage.getItem("theme");
    const session = user.currentSession;
    const user_id = session.user.id;

    const upvoted = upvoteList ? upvoteList.includes(user_id) : false;

    setUpvoted(upvoted);
    setTheme(theme);
  }, []);

  return (
    <>
      <div className="p-3 border-b border-primary border-opacity-50 flex flex-col gap-4 last:border-b-transparent">
        <div className="flex items-center">
          <img
            src={`https://avatars.dicebear.com/api/micah/${uploader_handler}.svg`}
            alt="avatar"
            className="w-10 h-10 rounded-full bg-base-300"
          />
          <div className="ml-2 flex flex-col gap-1">
            <p className="font-bold leading-none">@{uploader_handler}</p>
            <p className="text-xs opacity-50 leading-none">
              {dayjs(created_at).format("MMM DD YYYY")}
            </p>
          </div>
          <div className="ml-auto">
            <button className="btn btn-circle btn-ghost">
              <FiMoreHorizontal />
            </button>
          </div>
        </div>

        <div
          className="px-3"
          dangerouslySetInnerHTML={{ __html: draftToHtml(body) }}
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 ">
            <button onClick={handleUpvote} className="btn btn-circle btn-ghost">
              <FiHeart
                fill={upvoted ? "#DC2626" : "transparent"}
                stroke={
                  upvoted
                    ? "#DC2626"
                    : theme == "wicket-light"
                    ? "#2D2F34"
                    : "#F3F4F6"
                }
              />
            </button>
            <button className="btn btn-circle btn-ghost">
              <FiShare2 />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedCardNew;
