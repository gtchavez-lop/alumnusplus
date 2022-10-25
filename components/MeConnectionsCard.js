import { FiMail, FiUserMinus } from "react-icons/fi";
import { useEffect, useState } from "react";

import __supabase from "../lib/supabase";
import toast from "react-hot-toast";

const MeConnectionCard = ({ userData }) => {
  const [isFollowing, setIsFollowing] = useState(true);

  const updatePublicData = async (e) => {
    const user = __supabase.auth.user();
    const userData = user.user_metadata;

    const { data: oldData, error: oldDataError } = await __supabase
      .from("user_data")
      .select("*")
      .single()
      .eq("user_id", user.id);

    if (oldDataError) {
      toast.error(oldDataError.message);
      return;
    } else {
      const newData = {
        ...oldData.data,
        connections: userData.connections,
      };

      const { error: newDataError } = await __supabase
        .from("user_data")
        .update({
          data: newData,
        })
        .eq("user_id", user.id);

      if (newDataError) {
        toast.error(newDataError.message);
        return;
      }

      toast.success("Updated user data!");
      setIsFollowing(false);
    }
  };

  const unfollowHandler = async (e) => {
    const user = await __supabase.auth.user();
    const userMetaData = user.user_metadata;
    const connections = userMetaData.connections;

    // remove the user from the connections array
    const newConnections = connections.filter((e) => e !== userData.user_id);

    // console.log(newConnections);

    __supabase.auth
      .update({
        data: {
          connections: newConnections,
        },
      })
      .then(({ error }) => {
        if (error) {
          console.log(error);
        } else {
          toast("User unfollowed!");
          updatePublicData();
        }
      });
  };

  return (
    <>
      <div
        // key={e.user_id}
        className="flex items-center justify-between p-3 bg-base-200 rounded-md transition-all shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-2">
          <img
            src={`https://avatars.dicebear.com/api/micah/${userData.user_id}.svg`}
            alt="avatar"
            className="w-10 h-10 rounded-full bg-base-100"
          />
          <div className="flex flex-col">
            <p className="font-semibold">@{userData.data.username}</p>
            <p className="text-sm text-opacity-50">
              {userData.data.first_name} {userData.data.last_name}
            </p>
          </div>
        </div>

        {/* actions */}
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-sm">
            <FiMail />
          </button>
          <button
            onClick={unfollowHandler}
            disabled={!isFollowing}
            className="btn btn-ghost btn-sm"
          >
            <FiUserMinus />
          </button>
        </div>
      </div>
    </>
  );
};

export default MeConnectionCard;
