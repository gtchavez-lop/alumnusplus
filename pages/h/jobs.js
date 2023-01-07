import { useEffect, useState } from "react";

import JobCard from "../../components/Jobs/JobCard";
import { __PageTransition } from "../../lib/animation";
import { __supabase } from "../../supabase";
import { motion } from "framer-motion";
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
    console.log(data);
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
    jobs &&
    recommendedJobs && (
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
          {tabSelected === "all" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mt-10">
              {jobs.map((job) => (
                <JobCard job={job} />
              ))}
            </div>
          )}
        </motion.main>
      </>
    )
  );
};

export default JobPage;
