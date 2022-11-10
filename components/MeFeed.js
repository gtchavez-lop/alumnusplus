import FeedCard from "../pages/feed/FeedCard";
// import FeedCardNew from "./FeedCardNew";
// import FeedCard from "./FeedCard";
import { FiSearch } from "react-icons/fi";

const MeFeed = ({ feed }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
