import __supabase from "../lib/supabase";
import toast from "react-hot-toast";
import { useState } from "react";

const FeedRecomUserNew = ({ user }) => {
  const { created_at, firstName, id, lastName, middleName, username } = user;
  const [isFollowing, setIsFollowing] = useState(false);

  const pushUpdateToUserData = async (e) => {
    const token = localStorage.getItem("supabase.auth.token");
    const session = JSON.parse(token);
    const user = session.currentSession.user;

    const userData = await __supabase.auth.user().user_metadata;

    __supabase
      .from("user_hunters")
      .update({
        connections: userData.connections,
      })
      .eq("id", user.id)
      .then(({ error }) => {
        if (error) {
          toast.error(error.message);
        } else {
          toast.dismiss();
          toast.success("Followed user!");
        }
      });
  };

  const handleFollow = (e) => {
    let oldConnections = __supabase.auth.user().user_metaconnections;
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
        pushUpdateToUserData();
        setIsFollowing(true);
      });
  };

  return (
    <div className="flex items-center gap-3">
      <img
        src={`https://avatars.dicebear.com/api/micah/${username}.svg`}
        alt="user"
        className="w-10 h-10 rounded-full bg-base-300"
      />
      <div className="flex flex-col">
        <p className="font-semibold">@{username}</p>
        <p className="text-sm opacity-50">
          {firstName} {lastName}
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
