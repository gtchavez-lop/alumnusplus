import FeedCard from "../Feed/FeedCard";

const MeFeed = ({ feed }) => {
  return (
    <>
      <div className="flex justify-start w-full">
        <div className="flex flex-col gap-5 w-full max-w-xl">
          {feed.map((post, index) => (
            <FeedCard feedData={post} index={index} />
          ))}
        </div>
      </div>
    </>
  );
};

export default MeFeed;
