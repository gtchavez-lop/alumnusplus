import { AnimatePresence, motion } from "framer-motion";
import { __PageTransition, __TabTransition } from "../../lib/animation";
import { useEffect, useState } from "react";

import JobCard from "../../components/Jobs/JobCard";
import { __supabase } from "../../supabase";
import useLocalStorage from "../../lib/localStorageHook";

const JobPage = () => {
  const [tabSelected, setTabSelected] = useState("all");
  const [authState] = useLocalStorage("authState");

  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [allJobPage, setAllJobPage] = useState(1);
  const [recommendedJobPage, setRecommendedJobPage] = useState(1);

  const fetchAllJobs = async () => {
    const { data, error } = await __supabase
      .from("public_jobs")
      .select("*")
      .limit(10);
    // .range(allJobPage * 10, allJobPage * 10 + 10);

    if (error) {
      console.log(error);
    }

    setJobs(data);
  };

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

  // fetch all jobs and recommended jobs on load and when page changes
  useEffect(() => {
    fetchAllJobs();
    fetchRecommendedJobs();
  }, [allJobPage, recommendedJobPage]);

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
              {jobs &&
                jobs.map((job, index) => (
                  <JobCard job={job} key={`jobcard_${index}`} />
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
        </AnimatePresence>
      </motion.main>
    </>
  );
};

export default JobPage;
