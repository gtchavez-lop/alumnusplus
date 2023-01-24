import { FiArchive, FiBriefcase, FiUser } from "react-icons/fi";

import JobCard from "../../components/Jobs/JobCard";
import Link from "next/link";
import ProtectedPageContainer from "@/components/ProtectedPageContainer";
import { __PageTransition } from "../../lib/animation";
import { motion } from "framer-motion";

const Prov_Dashboard = () => {
  return (
    <>
      <ProtectedPageContainer>
        <motion.main
          variants={__PageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative min-h-screen w-full flex flex-col gap-10 pt-24 pb-36 "
        >
          <div className="grid grid-cols-5 gap-5">
            <div className="col-span-full lg:hidden">
              <p>Top Bar mobile</p>
            </div>
            <div className="col-span-full lg:col-span-3 flex flex-col gap-5">
              {/* stats */}
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-bold">Summary</h2>
                <div className="stats bg-base-200 w-full">
                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <FiUser className="text-2xl" />
                    </div>
                    <div className="stat-title">Job Applicants</div>
                    <div className="stat-value">240</div>
                    <div className="stat-desc">Since start of profile</div>
                  </div>

                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <FiBriefcase className="text-2xl" />
                    </div>
                    <div className="stat-title">Job Posts</div>
                    <div className="stat-value">10</div>
                    <div className="stat-desc">Current count</div>
                  </div>

                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <FiArchive className="text-2xl" />
                    </div>
                    <div className="stat-title">Archived Applicants</div>
                    <div className="stat-value">150</div>
                    <div className="stat-desc">Since start of profile</div>
                  </div>
                </div>
              </div>

              {/* posted Jobs */}
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-bold">Job Postings</h2>
                <div className="flex flex-col gap-2">
                  {Array(1)
                    .fill()
                    .map((_, i) => (
                      <div
                        key={`loading_${i}`}
                        className="bg-base-200 w-full h-[48px] animate-pulse rounded-btn"
                      />
                    ))}
                  <Link
                    href={"/p/jobs"}
                    className="btn btn-primary btn-ghost btn-block "
                  >
                    See all
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-bold">Recent Activities</h2>
                <div className="flex flex-col gap-2">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <div
                        key={`loading_${i}`}
                        className="bg-base-200 w-full h-[48px] animate-pulse rounded-btn"
                      />
                    ))}
                  <div className="btn btn-primary btn-ghost btn-block ">
                    See all
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2 hidden lg:flex flex-col gap-5">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-base-200 animate-pulse rounded-full" />
                <div className="w-full h-6 bg-base-200 animate-pulse rounded-btn mt-2" />
                <Link href={"/p/me"} className="btn btn-link">
                  Go to my profile
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold">Reminders</h2>
                <div className="flex flex-col gap-2">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <div
                        key={`loading2_${i}`}
                        className="bg-base-200 w-full h-[48px] animate-pulse rounded-btn"
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </motion.main>
      </ProtectedPageContainer>
    </>
  );
};

export default Prov_Dashboard;
