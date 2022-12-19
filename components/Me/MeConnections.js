import { useEffect, useState } from "react";

import Link from "next/link";
import { __supabase } from "../../supabase";
import toast from "react-hot-toast";

const MeConnections = ({ connectionIDArray }) => {
  const [connectionData, setConnectionData] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const fetchConnections = async () => {
    if (connectionIDArray) {
      const { data, error } = await __supabase
        .from("user_hunters")
        .select("id,fullName,username")
        .in("id", connectionIDArray);

      if (error) {
        toast.error(error.message);
      } else {
        setConnectionData(data);
        setLoaded(true);
      }
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [connectionIDArray]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {connectionData.map((connection) => (
          <Link
            href={`/h/${connection.username}`}
            key={connection.id}
            className="p-5 bg-base-300 flex flex-col gap-3 items-center rounded-btn"
          >
            <img
              src={`https://avatars.dicebear.com/api/bottts/${connection.username}.svg`}
              alt="avatar"
              className="w-20 h-20 rounded-full"
            />
            <div className="flex flex-col items-center">
              <p>
                {connection.fullName.first} {connection.fullName.last}
              </p>
              <p className="text-sm opacity-50">@{connection.username}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default MeConnections;
