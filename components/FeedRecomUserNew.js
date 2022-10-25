import __supabase from "../lib/supabase";
import toast from "react-hot-toast";
import { useState } from "react";

const FeedRecomUserNew = ({ user }) => {
  const { user_id, data } = user;
  const [isFollowing, setIsFollowing] = useState(false);

  const pushUpdateToUserData = (e) => {
    const token = localStorage.getItem("supabase.auth.token");
    const session = JSON.parse(token);
    const user = session.currentSession.user;

    const userData = __supabase.auth.user().user_metadata;
    toast.loading("Updating user...");

    console.log(userData);

    __supabase
      .from("user_data")
      .update({
        data: userData,
      })
      .eq("user_id", user.id)
      .then(({ error }) => {
        if (error) {
          toast.error(error.message);
        } else {
          toast.dismiss();
          toast.success("Updated user!");
        }
      });
  };

  const handleFollow = (e) => {
    let oldConnections = __supabase.auth.user().user_metadata.connections;
    let newConnections = [...oldConnections, user_id];

    // remove duplicate id
    newConnections = newConnections.filter(
      (item, index) => newConnections.indexOf(item) === index
    );

    toast.loading("Following user...");

    __supabase.auth
      .update({
        data: {
          connections: newConnections,
        },
      })
      .then(({ error }) => {
        if (error) {
          toast.error(error.message);
          return;
        }

        toast.dismiss();
        toast.success("Followed user!");
        pushUpdateToUserData();
        setIsFollowing(true);
      });
  };

  return (
    <div className="flex items-center gap-3">
      <img
        src={`https://avatars.dicebear.com/api/micah/${data.username}.svg`}
        alt="user"
        className="w-10 h-10 rounded-full bg-base-300"
      />
      <div className="flex flex-col">
        <p className="font-semibold">@{data.username}</p>
        <p className="text-sm opacity-50">
          {data.first_name} {data.last_name}
        </p>
      </div>

      {!isFollowing && (
        <button className="btn btn-primary ml-auto" onClick={handleFollow}>
          Follow
        </button>
      )}
      {isFollowing && (
        <button disabled className="btn btn-ghost ml-auto">
          Followed
        </button>
      )}
    </div>
  );
};

export default FeedRecomUserNew;
