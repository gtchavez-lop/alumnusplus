import { AnimatePresence, motion } from "framer-motion";

const SkeletonCard = () => {
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div className="rounded-btn p-5 bg-base-200">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-base-100 animate-pulse" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-20 bg-base-100 animate-pulse" />
              <div className="h-4 w-40 bg-base-100 animate-pulse" />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 min-h-[125px]">
            <div className="h-4 w-full bg-base-100 animate-pulse" />
            <div className="h-4 w-full bg-base-100 animate-pulse" />
            <div className="h-4 w-full bg-base-100 animate-pulse" />
            <div className="h-4 w-full bg-base-100 animate-pulse" />
            <div className="h-4 w-full bg-base-100 animate-pulse" />
          </div>

          <div className="mt-5 flex justify-between">
            <div className="h-6 w-24 bg-base-100 animate-pulse" />
            <div className="h-6 w-24 bg-base-100 animate-pulse" />
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default SkeletonCard;
