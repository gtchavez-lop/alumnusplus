import { FiLoader, FiSearch, FiUsers } from "react-icons/fi";
import { useEffect, useState } from "react";

import MeConnectionCard from "./MeConnectionsCard";
import __supabase from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";

const MeConnections = ({ connections }) => {
  const [connectedUserData, setConnectedUserData] = useState([]);
  const user = __supabase.auth.user();

  const __connectedUsers = useQuery(["connectedUsers"], async () => {
    const list = [...connections];

    const res = await fetch(
      "/api/userData?" +
        new URLSearchParams({
          idList: JSON.stringify(list),
        })
    );

    return res.json();
  });

  // const fetchUserData = async () => {
  //   const user = await __supabase.auth.user();
  //   const list = [...connections];

  //   const res = await fetch(
  //     "/api/userData?" + new URLSearchParams({ idList: JSON.stringify(list) })
  //   );
  //   const data = await res.json();
  //   // console.log(data);
  //   setConnectedUserData(data);
  // };

  // useEffect(() => {
  //   fetchUserData();
  // }, []);

  return (
    <>
      {__connectedUsers.isLoading && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <FiLoader className="text-xl animate-spin" />
        </div>
      )}

      {__connectedUsers.isError && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <p className="text-xl">Error</p>
        </div>
      )}

      {__connectedUsers.isSuccess && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="grid grid-cols-2 gap-2 mt-4 items-start sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {__connectedUsers.data.map((user, i) => {
              let filtered = {
                user_id: user.user_id,
                data: JSON.parse(user.data),
              };

              return <MeConnectionCard userData={filtered} key={`card_${i}`} />;
            })}
          </div>
        </div>
      )}

      {/* {connectedUserData?.length < 1 && (
        <div className="flex flex-col items-center justify-center h-full mt-16">
          <div className="flex flex-col items-center gap-2">
            <FiUsers className="text-4xl" />
            <p className="text-xl">No connections yet</p>
          </div>
        </div>
      )}

      {connectedUserData?.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4 items-start sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {connectedUserData.map((user, i) => {
            let filtered = {
              user_id: user.user_id,
              data: JSON.parse(user.data),
            };

            return <MeConnectionCard userData={filtered} key={`card_${i}`} />;
          })}
        </div>
      )} */}
    </>
  );
};

export default MeConnections;
