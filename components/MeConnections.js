import { useEffect, useState } from "react";

import MeConnectionCard from "./MeConnectionCard";
import { _PageTransition } from "../lib/animations";
import __supabase from "../lib/auth";
import { motion } from "framer-motion";

const MeConnections = ({ connectionIDs, setConnectionsIDs }) => {
  const [connectionsProfile, setConnectionsProfile] = useState([]);

  const fetchConnections = () => {
    __supabase
      .from("user_data")
      .select("*")
      .in("id", connectionIDs)
      .then((res) => {
        if (res.error) {
          console.log(res.error);
          return;
        }
        setConnectionsProfile(res.data);
      });
  };

  useEffect(() => {
    setConnectionsIDs(connectionIDs);
  }, [connectionsProfile]);

  useEffect(() => {
    if (connectionIDs) {
      fetchConnections();
    }
  }, [connectionIDs]);

  return (
    <>
      <motion.main
        variants={_PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <p className="text-3xl text-center">My Connections</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-16">
          {connectionsProfile.length > 0 ? (
            connectionsProfile.map((connection, i) => (
              <MeConnectionCard
                connection={connection}
                connectionArr={connectionsProfile}
                setConnections={setConnectionsProfile}
                index={i}
                key={i}
              />
            ))
          ) : (
            <p className="text-center col-span-full">No connections yet</p>
          )}
        </div>
      </motion.main>
    </>
  );
};

export default MeConnections;
