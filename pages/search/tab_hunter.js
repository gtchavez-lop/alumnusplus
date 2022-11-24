import { useEffect, useState } from "react";

import { __PageTransition } from "../../lib/animtions";
import __supabase from "../../lib/supabase";
import { motion } from "framer-motion";

const Tab_Hunter = ({ searchQuery }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);

  const findPeople = async () => {
    if (!searchQuery) return;

    const { data, error } = await __supabase
      .from("user_hunters")
      .select("email,username,id,fullname");

    const filtered = data.filter((item) => {
      return (
        item.fullname.first.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fullname.last.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fullname.middle
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    setResults(filtered);
    setIsLoading(false);
  };

  useEffect(() => {
    findPeople();
  }, [searchQuery]);

  isLoading && (
    <motion.section
      variants={__PageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-center justify-center w-full h-full"
    >
      <p>Loading...</p>
    </motion.section>
  );

  return (
    <motion.section
      variants={__PageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="mt-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((item) => (
          <div className="flex flex-col items-center justify-center bg-base-300 p-5 rounded-btn">
            <img
              src={`https://avatars.dicebear.com/api/bottts/${item.username}.svg`}
              alt="profile"
              className="w-16 h-16 "
            />
            <p className="text-lg font-bold">
              {item.fullname.first} {item.fullname.last}
            </p>
            <p className="text-sm text-gray-500">{item.username}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default Tab_Hunter;
