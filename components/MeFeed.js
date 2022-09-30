import FeedCard from "./FeedCard";
import { _PageTransition } from "../lib/animations";
import { motion } from "framer-motion";

const MeFeed = ({ posts }) => {
  return (
    <>
      <motion.main
        variants={_PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="mx-auto w-full flex flex-col gap-5 max-w-lg">
          {posts &&
            posts.map((post) => <FeedCard item={post} key={post.feed_id} />)}

          {!posts && <p>No posts yet</p>}
        </div>
      </motion.main>
    </>
  );
};

export default MeFeed;
