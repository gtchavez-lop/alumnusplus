import FeedCard from "../pages/feed/FeedCard";
// import FeedCardNew from "./FeedCardNew";
// import FeedCard from "./FeedCard";
import { FiSearch } from "react-icons/fi";

const MeFeed = ({ feed }) => {
  return (
    <>
      <div className="flex flex-col gap-10 w-full max-w-xl relative">
        {feed.length > 0 &&
          feed.map((e, index) => (
            <FeedCard feedData={e} key={`feed_item_${index}`} />
          ))}
      </div>

      {feed.length < 1 && (
        <div className="flex flex-col items-center justify-center h-full mt-16">
          <div className="flex flex-col items-center gap-2">
            <FiSearch className="text-4xl" />
            <p className="text-xl">No posts yet</p>
          </div>
        </div>
      )}
    </>
  );
};

export default MeFeed;
