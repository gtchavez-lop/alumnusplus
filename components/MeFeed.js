import FeedCardNew from "./FeedCardNew";
// import FeedCard from "./FeedCard";
import { FiSearch } from "react-icons/fi";

const MeFeed = ({ feed }) => {
  return (
    <>
      <div className="flex flex-col border border-primary border-opacity-50 rounded-box overflow-hidden w-full max-w-lg">
        {feed.length > 0 && (
          <div className="flex flex-col space-y-4 ">
            {feed.map((e, index) => (
              <FeedCardNew feedItem={e} key={`feed_item${index}`} />
            ))}
          </div>
        )}
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
