import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

import { FiArrowDown } from "react-icons/fi";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { __PageTransition } from "../../lib/animation";
import { __supabase } from "../../supabase";
import { useRouter } from "next/router";

const markdownRederers = {
  ul: ({ children }) => <ul className="list-disc my-5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal my-5">{children}</ol>,
  li: ({ children }) => <li className="ml-4">{children}</li>,
  h1: ({ children }) => <h1 className="text-3xl font-bold">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-bold">{children}</h2>,
  h3: ({ children }) => <h3 className="text-xl font-bold">{children}</h3>,
  h4: ({ children }) => <h4 className="text-lg font-bold">{children}</h4>,
  h5: ({ children }) => <h5 className="text-base font-bold">{children}</h5>,
  h6: ({ children }) => <h6 className="text-sm font-bold">{children}</h6>,
  p: ({ children }) => <p>{children}</p>,
};

export const getServerSideProps = async (context) => {
  const { id } = context.params;

  const { data: jobData, error: jobError } = await __supabase
    .from("public_jobs")
    .select("*")
    .eq("id", id)
    .single();

  const { data: uploaderData, error: uploaderError } = await __supabase
    .from("user_provisioners")
    .select("*")
    .eq("id", jobData.uploader_id)
    .single();

  return {
    props: {
      jobData,
      uploaderData,
    },
  };
};

const JobPage = ({ jobData, uploaderData }) => {
  // const router = useRouter();
  // const [jobData, setJobData] = useState({});
  // const [uploaderData, setUploaderData] = useState({});
  // const [isLoaded, setIsLoaded] = useState(false);
  const [scrollYValue, setScrollYValue] = useState(0);
  // const { scrollY } = useScroll();
  // const { id: job_id } = router.query;
  // const fetchUploaderData = async () => {
  //   const { data, error } = await __supabase
  //     .from("user_provisioners")
  //     .select("*")
  //     .eq("id", jobData.uploader_id)
  //     .single();
  //   if (error) {
  //     console.log(error);
  //   } else if (data) {
  //     setUploaderData(data);
  //     setIsLoaded(true);
  //   }
  // };
  // const fetchJobData = async () => {
  //   const { data, error } = await __supabase
  //     .from("public_jobs")
  //     .select("*")
  //     .eq("id", job_id)
  //     .single();
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     setJobData(data);
  //     fetchUploaderData();
  //   }
  // };
  // useEffect(() => {
  //   if (job_id !== undefined || job_id !== null) {
  //     fetchJobData();
  //   }
  // }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollYValue(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.img
        animate={{
          opacity: 0.4 - scrollYValue / 500,
          scale: 1 + scrollYValue / 2000,
        }}
        transition={{ duration: 0, ease: "linear" }}
        className="fixed top-0 left-0 w-full h-full object-cover opacity-40"
        src={`https://picsum.photos/seed/${jobData.id}/3000`}
      />
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative min-h-screen w-full flex flex-col gap-10 pb-24"
      >
        <div className="relative flex flex-col gap-4 min-h-screen justify-center items-center">
          <p className="text-5xl font-bold">{jobData.job_title}</p>
          <p className="">{jobData.job_location}</p>
          <button className="btn btn-primary mt-10 w-full max-w-md">
            Apply for this job
          </button>
          <p className="text-sm opacity-20 lg:hidden">Swipe up to see more</p>
          <FiArrowDown className="absolute bottom-[70px] opacity-0 lg:opacity-100 lg:bottom-10 lg:animate-bounce text-4xl" />
        </div>
        <div className="flex flex-col gap-4 px-4 max-w-xl mx-auto">
          <ReactMarkdown components={markdownRederers}>
            {jobData.full_description}
          </ReactMarkdown>
          <button className="btn btn-primary mt-10 w-full">
            Apply for this job
          </button>
        </div>
      </motion.main>
    </>
  );
};

export default JobPage;
