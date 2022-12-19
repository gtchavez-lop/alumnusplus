import { AnimatePresence, motion } from "framer-motion";
import { FiBookmark, FiLoader } from "react-icons/fi";
import { useEffect, useState } from "react";

import JobCard from "../../components/Jobs/JobCard";
import { __PageTransition } from "../../lib/animation";
// import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { __supabase } from "../../supabase";
import { useRouter } from "next/router";

const JobPosting = () => {
  const router = useRouter();
  const [tabSelected, setTabSelected] = useState("all");
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const __supabase = useSupabaseClient();

  const getAllJobs = async () => {
    const { data, error } = await __supabase.from("job_postings").select("*");
    if (error) {
      console.log(error);
    }

    setTimeout(() => {
      setJobs(data);
    }, 200);
  };

  const getRecommendedJobs = async () => {
    const {
      data: { user },
      authError,
    } = await __supabase.auth.getUser();

    if (user) {
      const userSkills = user.user_metadata.skillSecondary;
      const { data: recomJobs, error } = await __supabase
        .from("job_postings")
        .select("*")
        .containedBy("job_tags", userSkills);

      if (error) {
        console.log(error);
      }
      setRecommendedJobs(recomJobs);
    }
  };

  useEffect(() => {
    getAllJobs();
    getRecommendedJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 w-full min-h-screen flex flex-col items-center justify-center">
        <FiLoader className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

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

          <AnimatePresence mode="wait">
            {/* all jobs */}
            {tabSelected === "all" && (
              <motion.div
                key={"all"}
                initial={{ opacity: 0, x: 50 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.2, ease: "circOut" },
                }}
                exit={{
                  opacity: 0,
                  x: -50,
                  transition: { duration: 0.2, ease: "circIn" },
                }}
                className="mt-5"
              >
                <p className="text-2xl font-bold">See all jobs</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                  {jobs.map((item, index) => (
                    <JobCard job={item} key={`job_${index + 1}`} />
                  ))}
                </div>
              </motion.div>
            )}
            {tabSelected === "recommended" && (
              <motion.div
                key={"recommended"}
                initial={{ opacity: 0, x: 50 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.2, ease: "circOut" },
                }}
                exit={{
                  opacity: 0,
                  x: -50,
                  transition: { duration: 0.2, ease: "circIn" },
                }}
                className="mt-5"
              >
                <p className="text-2xl font-bold">Jobs for you</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                  {recommendedJobs.map((item, index) => (
                    <JobCard job={item} key={`recommendedjob_${index + 1}`} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </>
    )
  );
};

export default JobPosting;
