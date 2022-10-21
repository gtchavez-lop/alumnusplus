import { FiHeart, FiMoreHorizontal, FiShare2 } from "react-icons/fi";
import { useEffect, useState } from "react";

import __supabase from "../lib/supabase";
import dayjs from "dayjs";
import draftToHtml from "draftjs-to-html";
import toast from "react-hot-toast";

const FeedCardNew = ({ feedItem }) => {
  const {
    comments,
    content,
    created_at: createdAt,
    id: feed_id,
    uploader_details,
    upvoter_list: initialUpvoterList,
  } = feedItem;

  const { user_metadata: uploader_data } = uploader_details;

  const [theme, setTheme] = useState();

  const [upvoted, setUpvoted] = useState(false);
  const [upvoteLoading, setUpvoteLoading] = useState(false);

  const handleUpvote = async () => {
    setUpvoteLoading(true);
    const user = await __supabase.auth.user();

    const {
      data: { upvoter_list: latestUpvoterList },
    } = await __supabase
      .from("feed_data")
      .select("upvoter_list")
      .single()
      .eq("id", feed_id);

    try {
      if (upvoted) {
        const newUpvoterList = latestUpvoterList.filter(
          (upvoter) => upvoter.id !== user.id
        );
        const { error } = await __supabase
          .from("feed_data")
          .update({ upvoter_list: newUpvoterList })
          .eq("id", feed_id);
        if (error) {
          console.log(error);
        } else {
          setUpvoted(false);
          setUpvoteLoading(false);
        }
      } else {
        const newUpvoterList = [
          ...latestUpvoterList,
          {
            id: user.id,
            email: user.email,
            username: user.user_metadata.username,
          },
        ];
        const { error } = await __supabase
          .from("feed_data")
          .update({ upvoter_list: newUpvoterList })
          .eq("id", feed_id);
        if (error) {
          console.log(error);
        } else {
          setUpvoted(true);
          setUpvoteLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, please try again later");
      setUpvoteLoading(false);
    }
  };

  const checkIfUpvoted = async () => {
    const user = await __supabase.auth.user();

    if (user) {
      const upvoted = initialUpvoterList.some(
        (upvoter) => upvoter.id === user.id
      );
      setUpvoted(upvoted);
    }
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setTheme(theme);

    checkIfUpvoted();
  }, []);

  return (
    <>
      <div
        id={`feed-card-${feed_id}`}
        className="p-3 border-b border-primary border-opacity-50 flex flex-col gap-4 last:border-b-transparent"
      >
        <div className="flex items-center">
          <img
            src={`https://avatars.dicebear.com/api/micah/${uploader_data.username}.svg`}
            alt="avatar"
            className="w-10 h-10 rounded-full bg-base-300"
          />
          <div className="ml-2 flex flex-col gap-1">
            <p className="font-bold leading-none">@{uploader_data.username}</p>
            <p className="text-xs opacity-50 leading-none">
              {dayjs(createdAt).format("MMM DD YYYY hh:mm A")}
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
          dangerouslySetInnerHTML={{ __html: draftToHtml(content) }}
        />

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
                  stroke={
                    upvoted
                      ? "#DC2626"
                      : theme == "wicket-light"
                      ? "#2D2F34"
                      : "#F3F4F6"
                  }
                />
              )}
            </button>
            <button className="btn btn-sm btn-ghost">
              <FiShare2 />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedCardNew;
