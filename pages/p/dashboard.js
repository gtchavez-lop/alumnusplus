import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { FiLoader } from "react-icons/fi";
import JobCard from "../../components/Jobs/JobCard";
import { __PageTransition } from "../../lib/animation";
// import { useSupabaseClient } from "@supabase/auth-helpers-react";
import __supabase from "../../supabase";

const ProvFeed = () => {
  const [provData, setProvData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [provJobs, setProvJobs] = useState([]);
  // const __supabase = useSupabaseClient();

  const fetchProvJobs = async (uploaderEmail) => {
    const { data: provJobs, error: provJobsError } = await __supabase
      .from("job_postings")
      .select("*")
      .limit(3)
      .eq("uploader_email", uploaderEmail);

    if (provJobs) {
      setProvJobs(provJobs);
      console.log(provJobs);

      setTimeout(() => {
        setIsLoaded(true);
      }, 1000);
    }
  };

  const fetchProvData = async () => {
    const {
      data: { user },
    } = await __supabase.auth.getUser();

    const { data: localProvData, error: localProvDataError } = await __supabase
      .from("user_provisioners")
      .select("*")
      .single()
      .eq("id", user.id);

    if (localProvData) {
      setProvData(localProvData);
      fetchProvJobs(user.email);
    }
  };

  useEffect(() => {
    fetchProvData();
  }, []);

  if (!isLoaded) {
    return (
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative min-h-screen w-full flex flex-col justify-center items-center"
      >
        <FiLoader className="animate-spin text-4xl text-primary" />
      </motion.main>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isLoaded && (
        <motion.main
          key={provData.id}
          variants={__PageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative min-h-screen w-full flex flex-col gap-10 pt-24 pb-36"
        >
          <p className="text-3xl font-bold">
            Welcome back,{" "}
            <span className="text-primary">{provData.legalName}</span>!
          </p>

          {/* active job postings */}
          <div className="flex flex-col gap-2">
            <p>Active Job Posts</p>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {provJobs.map((job, index) => (
                <JobCard job={job} key={index} />
              ))}
            </div>
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
};

export default ProvFeed;
