import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "@mui/material";
const SkeletonCard = () => {
  return (
    <>
      {/* using div & animatepresence, motion */}
      {/* <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: { duration: 2 , ease: "backInOut" },
          }}
          className="rounded-btn p-5 bg-base-200"
        >
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-base-100 animate-pulse" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-20 bg-base-100 animate-pulse" />
              <div className="h-4 w-40 bg-base-100 animate-pulse" />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
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
      </AnimatePresence> */}

      {/* using material ui skeleton lib */}
      <div className="rounded-btn p-5 bg-base-200">
        <div className="flex gap-3">
          <Skeleton variant="circular" width={43} height={43} />
          <div className="flex flex-col gap-2">
            <Skeleton variant="rectangular" width={80} height={18} />
            <Skeleton variant="rectangular" width={160} height={18} />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <Skeleton variant="rectangular" width="100%" height={18} />
          <Skeleton variant="rectangular" width="100%" height={18} />
          <Skeleton variant="rectangular" width="100%" height={18} />
          <Skeleton variant="rectangular" width="100%" height={18} />
          <Skeleton variant="rectangular" width="100%" height={18} />
        </div>

        <div className="mt-5 flex justify-between">
          <Skeleton variant="rectangular" width={100} height={25} />
          <Skeleton variant="rectangular" width={100} height={25} />
        </div>
      </div>
    </>
  );
};

export default SkeletonCard;
