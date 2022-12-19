import { AnimatePresence, motion, useScroll } from "framer-motion";
import { FiArrowDown, FiLoader } from "react-icons/fi";
import { useEffect, useState } from "react";

import { __PageTransition } from "../../lib/animation";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const JobPage = () => {
  const router = useRouter();
  const __supabase = useSupabaseClient();

  const { jobID } = router.query;
  const [jobData, setJobData] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollYValue, setScrollYValue] = useState(0);
  const { scrollY } = useScroll();

  const getJobData = async () => {
    const { data } = await __supabase
      .from("job_postings")
      .select()
      .eq("id", jobID)
      .single();

    if (data) {
      setJobData(data);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    getJobData();
  }, [jobID]);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setScrollYValue(latest);
      console.log(latest);
    });
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
    jobData && (
      <>
        <motion.img
          animate={{
            opacity: 0.2 - scrollYValue / 1000,
            y: scrollYValue / 2,
          }}
          transition={{ duration: 0, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
          src={`https://picsum.photos/seed/${jobData.id}/3000`}
        />

        <AnimatePresence>
          <motion.main
            key={jobData.id}
            variants={__PageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative min-h-screen w-full flex flex-col gap-10 pb-24"
          >
            <div className="relative flex flex-col gap-4 min-h-screen justify-center items-center">
              <p className="">{jobData.job_mode}</p>
              <p className="text-5xl font-bold">{jobData.job_title}</p>
              <p className="">{jobData.job_location}</p>

              <button className="btn btn-primary mt-10 w-full max-w-md">
                Apply for this job
              </button>

              <FiArrowDown className="absolute bottom-10 animate-bounce text-4xl" />
            </div>
            <div className="flex flex-col gap-10 max-w-md mx-auto w-full">
              <div className="flex flex-col gap-2">
                <p className="flex justify-between">
                  <span>Job Title</span>
                  <span className="font-bold text-primary">
                    {jobData.job_title}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Working Hours</span>
                  <span className="font-bold text-primary">
                    {jobData.job_workingHours}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Expected Salary</span>
                  <span className="font-bold text-primary">
                    {jobData.job_expectedSalary}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Job Type</span>
                  <span className="font-bold text-primary">
                    {jobData.job_type}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Job Mode</span>
                  <span className="font-bold text-primary">
                    {jobData.job_mode}
                  </span>
                </p>
              </div>

              {/* job description */}
              <div>
                <p className="text-2xl font-bold">Job Description</p>
                <p className="">{jobData.job_description}</p>
              </div>

              {/* job requirements */}
              <div>
                <p className="text-2xl font-bold">Job Requirements</p>
                <ul className="list-disc ml-5">
                  {jobData.job_requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>

              {/* contact details */}
              <div>
                <p className="text-2xl font-bold">Contact Details</p>

                <p className="flex justify-between">
                  <span>Email of the company</span>
                  <span className="font-bold text-primary">
                    {jobData.uploader_email}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Company Legal Name</span>
                  <span className="font-bold text-primary">
                    {jobData.uploader_legal_name}
                  </span>
                </p>
              </div>

              {/* apply button */}
              <button className="btn btn-primary mt-10 w-full max-w-md">
                Apply for this job
              </button>
            </div>
          </motion.main>
        </AnimatePresence>
      </>
    )
  );
};

export default JobPage;
