import { useEffect, useState } from "react";

import { FiUserPlus } from "react-icons/fi";
import __supabase from "../lib/supabase";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const FeedRecomUser = ({ user }) => {
  const router = useRouter();

  const followUser = () => {
    let currentData = __supabase.auth.user().user_metadata;
    let connections = currentData.connections
      ? JSON.parse(currentData.connections)
      : [];

    // check if user is already followed
    if (connections.includes(user.user_id)) {
      toast("You are already following this user");
      return;
    } else {
      connections.push(user.user_id);
      let parsedConnections = JSON.stringify(connections);
      let newData = { ...currentData, connections: parsedConnections };

      __supabase.auth.update({ data: newData });

      __supabase
        .from("user_data")
        .update({ data: newData })
        .eq("user_id", __supabase.auth.user().id)
        .then((res) => {
          console.log(res);
          toast.success("User followed!");
          router.reload();
        });
    }

    console.log(connections);
  };

  return (
    <div
      key={`recoUser_${user.user_id + 1}`}
      className="w-full flex items-center p-3 bg-base-300 bg-opacity-50 rounded-btn hover:scale-105 transition-transform"
    >
      <img
        src={`https://avatars.dicebear.com/api/micah/${user.data?.username}.svg`}
        alt="avatar"
        className="w-10 h-10 rounded-full bg-white"
      />
      <div className="ml-3 flex flex-col">
        <h3 className="text-lg font-bold">@{user.data?.username}</h3>
        <p className="text-xs opacity-50">
          {user.data?.first_name} {user.data?.last_name}
        </p>
      </div>
      {/* follow button */}
      <button
        onClick={followUser}
        className="btn btn-primary btn-circle text-xl ml-auto"
      >
        <FiUserPlus />
      </button>
    </div>
  );
};

export default FeedRecomUser;
