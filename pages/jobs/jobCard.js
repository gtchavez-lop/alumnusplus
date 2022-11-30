import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useState } from "react";
import { FiBookmark, FiMoreHorizontal, FiX } from "react-icons/fi";

const JobCard = ({ item }) => {
  const [isShowing, setShowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <>
      <div className="flex lg:items-center gap-5 flex-col lg:flex-row bg-base-200 rounded-btn p-5">
        <div className="hidden lg:flex items-center ">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="btn btn-ghost btn-square text-lg"
          >
            <FiBookmark
              className={
                isBookmarked
                  ? "fill-primary stroke-primary"
                  : "fill-transparent stroke-primary"
              }
            />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <img
            src={`https://avatars.dicebear.com/api/bottts/${item?.uploader_legal_name}.svg`}
            width={45}
            height={45}
            className="rounded-full"
            alt="avatar"
          />
          <div>
            <p className="leading-none text-lg">{item?.job_title}</p>
            <p className="leading-none opacity-75">
              {item?.uploader_legal_name}
            </p>
          </div>
        </div>

        <div className="ml-auto flex flex-col items-end gap-2">
          <p>{item?.job_location}</p>
          <p className="badge badge-primary">{item?.job_type}</p>
        </div>

        <div className="flex justify-end gap-3">
          <button className="lg:hidden btn btn-ghost btn-square">
            <FiBookmark />
          </button>

          <button
            className="btn btn-ghost btn-square"
            onClick={() => setShowing(!isShowing)}
          >
            <FiMoreHorizontal />
          </button>

          {/* More Details */}
        </div>
      </div>
      <AnimatePresence mode="wait" key={item?.id}>
        {isShowing && (
          <motion.div
            key={item?.id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.3, ease: "circOut" }
            }}
            exit={{ opacity: 0, transition: { duration: 0.3, ease: "circIn" } }}
            onClick={(e) => {
              if (e.currentTarget === e.target) {
                setShowing(false);
              }
            }}
            className="fixed w-full h-screen flex justify-end top-0 left-0 bg-base-300 bg-opacity-75"
          >
            <motion.div
              initial={{ x: 50 }}
              animate={{ x: 0, transition: { duration: 0.3, ease: "circOut" } }}
              exit={{ x: 50, transition: { duration: 0.3, ease: "circIn" } }}
              className="w-full max-w-xl flex flex-col gap-5 pt-20 lg:pt-24 bg-base-100 px-5"
            >
              <button
                onClick={() => setShowing(!isShowing)}
                className="btn btn-ghost btn-circle self-end"
              >
                <FiX className="text-lg" />
              </button>
              <h1 className="flex justify-center items-center py-16 text-3xl font-bold">
                {item?.uploader_legal_name}
              </h1>

              <p className="flex justify-center items-center text-xl font-semibold">
                {item?.job_title}
              </p>

              <p className="">
                <span className="font-bold">Job Description: </span>{" "}
                {item?.job_description} "Lorem ipsum dolor sit amet, consectetur
                adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat. Duis aute irure dolor in reprehenderit in voluptate
                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum."
              </p>

              <p className="">
                <span className="font-bold">Benefits: </span>
                {item?.job_benefits}
              </p>

              <p className="">
                <span className="font-bold">Level: </span>
                {item?.career_level}
              </p>

              <p className="">
                <span className="font-bold">Location: </span>
                {item?.job_location}
              </p>

              <a
                className="flex font-medium "
                href={`mailto:${item?.uploader_email}`}
                target="_blank"
              >
                <span className="font-bold">Email:</span>
                <span className="underline underline-offset-4 ml-2">
                  {item?.uploader_email}
                </span>
              </a>

              {/* exit button */}
            </motion.div>
            {/* slideover background */}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default JobCard;
