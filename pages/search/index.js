import { AnimatePresence, motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiFilter } from "react-icons/fi";

import Tab_Hunter from "./tab_hunter";
import { __PageTransition } from "../../lib/animtions";
import __supabase from "../../lib/supabase";
import { useRouter } from "next/router";
import { useState } from "react";

const SearchPage = () => {
  const router = useRouter();
  const { query } = router;
  const { query: q } = query;

  const [tabSelected, setTabSelected] = useState("hunters");

  const findPosts = async () => {
    const { data, error } = await __supabase
      .from("hunt_blog")
      .select()
      .textSearch("content", q, {
        type: "websearch"
      });

    console.log(data);
  };

  return (
    <motion.main
      variants={__PageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen w-full pt-36 lg:pt-24"
    >
      {/* tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="flex flex-col">
          <p>Category</p>
          <select
            onChange={(e) => setTabSelected(e.target.value)}
            className="select select-primary select-sm lg:select-md w-full max-w-sm"
          >
            <option value={"hunters"}>Hunters</option>
            <option value={"posts"}>Blog Posts</option>
            <option value={"provisioners"}>Provisioners</option>
            <option value={"jobs"}>Job Listings</option>
          </select>
        </div>
      </div>

      {/* content */}
      <AnimatePresence key={tabSelected}>
        {tabSelected === "hunters" && (
          <Tab_Hunter searchQuery={q} key={tabSelected} />
        )}
        {/* {tabSelected === "posts" && (
          <Tab_Hunter searchQuery={q} key={tabSelected} />
        )} */}
      </AnimatePresence>
    </motion.main>
  );
};

export default SearchPage;
