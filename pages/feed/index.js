import { FiArrowUpCircle, FiShare2 } from "react-icons/fi";
import { useEffect, useState } from "react";

import FeedCard from "../../components/FeedCard";
import FeedUserCard from "../../components/FeedUserCard";
import { _PageTransition } from "../../lib/animations";
import __supabase from "../../lib/auth";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useUser } from "../../components/UserContext";

const Page_Feed = () => {
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userConnections, setUserConnections] = useState([]);
  const [userData, setUserData] = useState({});

  const [postLength, setPostLength] = useState(0);

  const [recommendedUsers, setRecommendedUsers] = useState([]);

  const submitPost = (e) => {
    e.preventDefault();
    const user = __supabase.auth.user();
    const { content } = e.target.elements;
    toast.loading("Uploading post...");

    __supabase
      .from("user_feed")
      .insert([
        {
          uploader_id: user.id,
          uploader_handler: userData.user_handle,
          uploader_email: user.email,
          content: content.value,
        },
      ])
      .then((res) => {
        if (res.error) {
          console.log(res.error);
          return;
        }
        toast.dismiss();
        toast.success("Post uploaded!");
        content.value = "";
      });
  };

  const fetchData = () => {
    const session = window.localStorage.getItem("supabase.auth.token")
      ? JSON.parse(window.localStorage.getItem("supabase.auth.token"))
      : null;
    let localConnection = [];

    __supabase
      .from("user_data")
      .select("*")
      .eq("id", session.currentSession.user.id)
      .single()
      .then((res) => {
        if (res.error) {
          console.log(res.error);
          return;
        }
        setUserData(res.data);
        const localConnection = JSON.parse(res.data.connections) || [];

        // initial load
        __supabase
          .from("user_feed")
          .select("*")
          .limit(20 * page)
          .order("created_at", { ascending: false })
          .in("uploader_id", [
            ...localConnection,
            session.currentSession.user.id,
          ])
          .then((res) => {
            setFeed(res.data);
            setLoading(false);

            __supabase
              .from("user_data")
              .select("*")
              .not("id", "eq", session.currentSession.user.id)
              .limit(6)
              .then((res) => {
                if (res.error) {
                  console.log(res.error);
                  return;
                }
                // filter out users that are already connected
                let filteredUsers = res.data.filter((user) => {
                  return !localConnection.includes(user.id);
                });

                setRecommendedUsers(filteredUsers);
              });
          });
      });
  };

  useEffect(() => {
    const feedSubscription = __supabase
      .from("user_feed")
      .on("*", (payload) => {
        setFeed((prev) => {
          // if the payload is an insert, add it to the top of the feed
          if (payload.eventType == "INSERT") {
            return [payload.new, ...prev];
          }

          // if the payload is an update, update the feed item
          if (payload.eventType == "UPDATE") {
            return prev.map((item) => {
              if (item.feed_id == payload.new.feed_id) {
                return payload.new;
              } else {
                return item;
              }
            });
          }

          // if the payload is a delete, remove the feed item
          if (payload.eventType == "DELETE") {
            return prev.filter((item) => item.feed_id !== payload.old.feed_id);
          }

          return prev;
        });
      })
      .subscribe();

    setLoading(true);

    return () => __supabase.removeSubscription(feedSubscription);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    userData &&
    !loading && (
      <motion.main
        variants={_PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* <div>{!loading && JSON.stringify(feed, 2)}</div> */}

        <div className="grid grid-cols-1 lg:grid-cols-5 w-full gap-5">
          {/* feed card list */}
          <div className="flex flex-col col-span-3 gap-y-5">
            {/* post input field */}
            <form
              className="form-control mt-10 gap-5 max-w-xl mx-auto w-full"
              onSubmit={(e) => submitPost(e)}
            >
              <div className="flex flex-col gap-y-2">
                <textarea
                  minLength={1}
                  maxLength={250}
                  onChange={(e) => setPostLength(e.target.value.length)}
                  className="w-full h-32 textarea textarea-bordered textarea-primary"
                  placeholder="What's on your mind?"
                  name="content"
                />
              </div>

              <div className="flex justify-end items-center gap-2">
                <span className="text-gray-500 text-sm">{postLength}/250</span>
                <button className="btn btn-primary" type="submit">
                  Post
                </button>
              </div>
            </form>
            <div className="divider mx-10" />
            {feed.map((post, i) => (
              // <p>{JSON.stringify(item)}</p>
              <FeedCard item={post} key={post.feed_id} />
            ))}
          </div>

          {/* recommendedUsers */}
          <div className="hidden lg:flex flex-col col-span-2 gap-y-5 w-full sticky top-32 h-max">
            <p className="text-xl">Recommended Users</p>

            {recommendedUsers.map((user) => {
              // return only users that are not the current user and not already in the user's connections
              return (
                user.id !== userData.id &&
                !userConnections.includes(user.id) && (
                  <FeedUserCard user={user} key={user.id} />
                )
              );
            })}
          </div>
        </div>
      </motion.main>
    )
  );
};

export default Page_Feed;
