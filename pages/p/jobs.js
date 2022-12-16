import { AnimatePresence, motion } from "framer-motion";
import { FiLoader, FiPlus } from "react-icons/fi";
import { useEffect, useState } from "react";

import IndustryTypes from "../../schemas/industryTypes.json";
import JobCard from "../../components/Jobs/JobCard";
import { __PageTransition } from "../../lib/animation";
import { __supabase } from "../../supabase";

const JobPostings = () => {
  const [provJobs, setProvJobs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [addPostModalShown, setAddPostModalShown] = useState(false);

  const fetchProvJobs = async () => {
    const {
      data: { user },
    } = await __supabase.auth.getUser();

    const { data: provJobs, error: provJobsError } = await __supabase
      .from("job_postings")
      .select("*")
      .eq("uploader_email", user.email);

    if (provJobs) {
      setProvJobs(provJobs);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchProvJobs();
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
    isLoaded && (
      <>
        <motion.main
          variants={__PageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative min-h-screen w-full flex flex-col gap-10 pt-24 pb-36"
        >
          <button
            onClick={() => setAddPostModalShown(true)}
            className="btn btn-primary items-center gap-2"
          >
            <span>Add new job</span>
            <FiPlus />
          </button>

          <div>
            <p className="text-3xl mb-2">Active Job Posts</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {provJobs.map((job, index) => (
                <JobCard job={job} key={`jobcard_${index}`} />
              ))}
            </div>
          </div>
        </motion.main>

        <AnimatePresence mode="wait">
          {addPostModalShown && (
            <AddJobPostModal
              setModalShown={setAddPostModalShown}
              key={`modalShown_${addPostModalShown}`}
            />
          )}
        </AnimatePresence>
      </>
    )
  );
};

const AddJobPostModal = ({ setModalShown }) => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { ease: "circOut", duration: 0.2 } }}
      exit={{ opacity: 0, transition: { ease: "circIn", duration: 0.2 } }}
      onClick={(e) => {
        e.currentTarget === e.target && setModalShown(false);
      }}
      className="fixed top-0 left-0 w-full h-screen bg-base-300 bg-opacity-50"
    >
      <motion.section
        initial={{ opacity: 0, x: 100 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: { ease: "circOut", duration: 0.2 },
        }}
        exit={{
          opacity: 0,
          x: 100,
          transition: { ease: "circIn", duration: 0.2 },
        }}
        className="absolute w-full max-w-lg right-0 max-h-screen px-5 py-24 top-0 bg-base-100 overflow-y-auto"
      >
        <p className="text-2xl font-bold">Add new Post</p>

        <form className="mt-5" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col">
            <label htmlFor="job_title">Job Title</label>
            <input
              type="text"
              name="job_title"
              id="job_title"
              placeholder="A very cool job"
              className="input input-bordered"
            />
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="job_description">Job Description</label>
            <textarea
              name="job_description"
              id="job_description"
              placeholder="The description of the job that you are posting"
              className="textarea textarea-bordered"
              rows={5}
            />
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="job_location">Job Location</label>
            <input
              type="text"
              name="job_location"
              id="job_location"
              placeholder="Where is the job located?"
              className="input input-bordered"
            />
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="job_expectedSalary">Expected Salary</label>
            <input
              type="text"
              name="job_expectedSalary"
              id="job_expectedSalary"
              placeholder="How much are you willing to pay?"
              className="input input-bordered"
            />
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="job_requirements">Job Requirements</label>
            <textarea
              name="job_requirements"
              id="job_requirements"
              placeholder="What are the requirements for the job?"
              className="textarea textarea-bordered"
              rows={5}
            />
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="job_benefits">Job Benefits</label>
            <textarea
              name="job_benefits"
              id="job_benefits"
              placeholder="What are the benefits of the job?"
              className="textarea textarea-bordered"
              rows={5}
            />
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="career_level">Job Level</label>
            <select
              name="career_level"
              id="career_level"
              className="select select-bordered w-full"
            >
              <option value="" disabled selected>
                Select Job Level
              </option>
              <option value="Entry">Entry</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="job_type">Job Type</label>
            <select
              name="job_type"
              id="job_type"
              className="select select-bordered w-full"
            >
              <option value="" disabled selected>
                Select Job Type
              </option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="job_category">Job Category</label>
            <select
              name="job_category"
              id="job_category"
              className="select select-bordered w-full"
            >
              <option value="" disabled selected>
                Select Job Category
              </option>
              {IndustryTypes.map((industry, index) => (
                <option value={industry} key={`industrytype_${index}`}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="job_mode">Job Mode</label>
            <select
              name="job_mode"
              id="job_mode"
              className="select select-bordered w-full"
            >
              <option value="" disabled selected>
                Select Job Mode
              </option>
              <option value="Remote">Remote</option>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="job_workingHours">Working Hours</label>
            <input
              type="text"
              name="job_workingHours"
              id="job_workingHours"
              placeholder="What are the working hours?"
              className="input input-bordered"
            />
          </div>

          <button type="submit" className="btn btn-primary mt-16 btn-block">
            Add Job
          </button>
        </form>
      </motion.section>
    </motion.main>
  );
};

export default JobPostings;
