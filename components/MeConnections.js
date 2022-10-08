import { FiSearch, FiUsers } from "react-icons/fi";
import { useEffect, useState } from "react";

import MeConnectionCard from "./MeConnectionsCard";
import __supabase from "../lib/supabase";

const MeConnections = ({ connections }) => {
  const [connectedUserData, setConnectedUserData] = useState([]);

  const fetchUserData = async () => {
    const user = await __supabase.auth.user();
    const list = [...connections];

    const res = await fetch(
      "/api/userData?" + new URLSearchParams({ idList: JSON.stringify(list) })
    );
    const data = await res.json();
    // console.log(data);
    setConnectedUserData(data);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      {connectedUserData?.length < 1 && (
        <div className="flex flex-col items-center justify-center h-full mt-16">
          <div className="flex flex-col items-center gap-2">
            <FiUsers className="text-4xl" />
            <p className="text-xl">No connections yet</p>
          </div>
        </div>
      )}

      {connectedUserData?.length > 0 && (
        // grid for connectionCards
        <div className="grid grid-cols-2 gap-2 mt-4 items-start sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {connectedUserData.map((user, i) => {
            let filtered = {
              user_id: user.user_id,
              data: JSON.parse(user.data),
            };

            return <MeConnectionCard userData={filtered} key={`card_${i}`} />;
          })}
        </div>
      )}
    </>
  );
};

export default MeConnections;
