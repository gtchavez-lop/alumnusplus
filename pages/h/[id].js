import { __PageTransition } from "../../lib/animation";
import dayjs from "dayjs";
import { motion } from "framer-motion";

const UserPage = () => {
  return (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="pt-24 pb-32 grid grid-cols-1 lg:grid-cols-5 gap-5"
      >
        <div className="col-span-full lg:col-span-3 flex flex-col gap-5">
          {/* profile landing */}
          <div className="p-5 bg-base-300 rounded-btn">
            <img
              src={`https://avatars.dicebear.com/api/bottts/${"johndoe"}.svg`}
              alt="avatar"
              className="w-32 h-32 rounded-full bg-primary border-white border-2"
            />
            <p className="text-3xl font-bold">John Doe</p>

            <p className="font-semibold opacity-75">@johndoe</p>
            <p>
              Joined at:{" "}
              <span className="opacity-50">
                {dayjs().format("MMMM DD, YYYY")}
              </span>
            </p>
          </div>
          <div className="p-5 border-2 border-base-content rounded-btn border-opacity-50 flex flex-col gap-2">
            <p className="text-2xl font-bold mb-4">Skillsets</p>
            <div>
              <p className="font-semibold">Primary Skill</p>
              <p className="flex gap-2 gap-y-1 flex-wrap">
                <span className="badge badge-primary">Web Development</span>
              </p>
            </div>
            <div>
              <p className="font-semibold">Secondary Skillsets</p>
              <p className="flex gap-2 gap-y-1 flex-wrap">
                {Array(5)
                  .fill()
                  .map((_, i) => (
                    <span
                      key={`secondaryskill_${i}`}
                      className="badge badge-accent"
                    >
                      Skill {i + 1}
                    </span>
                  ))}
              </p>
            </div>
          </div>
          <div className="p-5 border-2 border-base-content rounded-btn border-opacity-50 flex flex-col gap-2">
            <p className="text-2xl font-bold mb-5">About</p>
            <div>
              <p className="font-semibold">Birthday</p>
              <p className="opacity-50">January 1, 2000</p>
            </div>
            <div>
              <p className="font-semibold">Location</p>
              <p className="opacity-50">Philippines</p>
            </div>
          </div>
          <div className="p-5 border-2 border-base-content rounded-btn border-opacity-50 flex flex-col gap-2">
            <p className="text-2xl font-bold">Activities</p>
          </div>
        </div>
        <div className="col-span-full lg:col-span-2 flex flex-col gap-5">
          <div className="p-5">
            <p className="text-2xl font-bold">Connections</p>
          </div>
          <div className="p-5">
            <p className="text-2xl font-bold">Actions</p>
          </div>
        </div>
      </motion.main>
    </>
  );
};
export default UserPage;
