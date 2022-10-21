import {
  FiLoader,
  FiMail,
  FiSearch,
  FiUserMinus,
  FiUsers,
} from "react-icons/fi";
import { useEffect, useState } from "react";

import { useSelect } from "react-supabase";

const MeConnections = ({ connections }) => {
  const [userList, setUserList] = useState([]);
  const [{ data: userData, error: userError, fetching: userLoading }] =
    useSelect("user_data", {
      columns: "data, user_id, created_at",
      order: "created_at",
    });

  useEffect(() => {
    if (userError) {
      toast.error(error.message);
    }

    if (userData) {
      let filtered = userData.filter((e) => {
        // return only users that are in the connections array
        return connections.includes(e.user_id);
      });
      setUserList(filtered);
    }
  }, [userData]);

  if (userLoading || !userList) {
    return (
      <div className="flex items-center justify-center">
        <FiLoader className="animate-spin w-8 h-8 " />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {userList.map((e) => (
        <div
          key={e.user_id}
          className="flex items-center justify-between p-3 bg-base-200 rounded-md transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-2">
            <img
              src={`https://avatars.dicebear.com/api/micah/${e.user_id}.svg`}
              alt="avatar"
              className="w-10 h-10 rounded-full bg-base-100"
            />
            <div className="flex flex-col">
              <p className="font-semibold">@{e.data.username}</p>
              <p className="text-sm text-opacity-50">
                {e.data.first_name} {e.data.last_name}
              </p>
            </div>
          </div>

          {/* actions */}
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-sm">
              <FiMail />
            </button>
            <button className="btn btn-ghost btn-sm">
              <FiUserMinus />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MeConnections;
