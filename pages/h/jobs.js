import { AnimatePresence, motion } from "framer-motion";
import { __PageTransition, __TabTransition } from "../../lib/animation";
import { useEffect, useState } from "react";

import CvBuilder from "@/components/Jobs/CvBuilder";
import JobCard from "../../components/Jobs/JobCard";
import { __supabase } from "../../supabase";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";

const _fetchAllJobs = async () => {
  const { data, error } = await __supabase
    .from("public_jobs")
    .select(
      "job_title,uploader:uploader_id(legalName),job_location,short_description,created_at,job_type"
    )
    .limit(10);
  // .range(allJobPage * 10, allJobPage * 10 + 10);

  if (error) {
    console.log(error);
  }

  return data;
};

const JobPage = () => {
  const [tabSelected, setTabSelected] = useState("all");
  const session = useSession();

  const {
    data: allJobs,
    isLoading: allJobsLoading,
    error: allJobsError,
    isSuccess: allJobsSuccess,
  } = useQuery({
    queryKey: ["allJobs"],
    queryFn: _fetchAllJobs,
    enabled: !!session,
    onSuccess: () => {
      console.log("allJobs fetched");
    },
    onerror: () => {
      console.log("allJobs error");
    },
  });

  const fetchRecommendedJobs = async () => {
    const user_primarySkill = authState.user_metadata.primarySkill;
    const user_secondarySkills = authState.user_metadata.secondarySkills;

    const { data, error } = await __supabase
      .from("public_jobs")
      .select("*")
      .limit(10);
    // .range(recommendedJobPage * 10, recommendedJobPage * 10 + 10);

    if (error) {
      console.log(error);
    }

    setRecommendedJobs(data);
  };

  return (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative min-h-screen w-full pt-24 pb-36"
      >
        {/* tabs */}
        <div className="tabs tabs-boxed">
          <p
            onClick={() => setTabSelected("all")}
            className={`tab ${tabSelected === "all" && "tab-active"}`}
          >
            All Jobs
          </p>
          <p
            onClick={() => setTabSelected("recommended")}
            className={`tab ${tabSelected === "recommended" && "tab-active"}`}
          >
            Recommended Jobs
          </p>
          <p
            onClick={() => setTabSelected("builder")}
            className={`tab ${tabSelected === "builder" && "tab-active"}`}
          >
            Wicket CV Builder
          </p>
        </div>

        {/* content */}
        {/* all jobs */}
        <AnimatePresence mode="wait">
          {tabSelected === "all" && (
            <motion.div
              variants={__TabTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mt-10"
              key={"all_jobs"}
            >
              {allJobsSuccess &&
                allJobs.map((job, index) => (
                  <JobCard job={job} key={`jobcard_${index}`} />
                ))}

              {allJobsLoading &&
                Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={`jobloader_${index}`}
                      style={{
                        animationDelay: index * 50 + "ms",
                        animationDuration: "500ms",
                      }}
                      className="h-[238px] w-full bg-base-200 animate-pulse "
                    />
                  ))}
            </motion.div>
          )}
          {tabSelected === "recommended" && (
            <motion.div
              variants={__TabTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mt-10"
              key={"recommended_jobs"}
            >
              <p>Recommended</p>
              {/* {jobs.map((job, index) => (
                  <JobCard job={job} key={`jobcard_${index}`} />
                ))} */}
            </motion.div>
          )}
          {tabSelected === "builder" && (
            <motion.div
              variants={__TabTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className=" mt-10"
            >
              <CvBuilder />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </>
  );
};

export default JobPage;
