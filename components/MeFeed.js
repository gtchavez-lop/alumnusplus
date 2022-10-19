// import FeedCard from "./FeedCard";
import { FiSearch } from "react-icons/fi";

const MeFeed = ({ feed }) => {
  return (
    <>
      {feed.length > 0 && (
        <div className="flex flex-col space-y-4">
          {/* {feed.map((e, index) => (
            <FeedCard key={`userfeed_${index}`} item={e} />
          ))} */}
        </div>
      )}

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
