import { useEffect, useState } from "react";

import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import SkeletonCard from "../../components/Feed/SkeletonCard";
import { __supabase } from "../../supabase";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import rehypeRaw from "rehype-raw";

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

const JobCard = ({ job }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [uploader, setUploader] = useState({});

  const fetchUploader = async () => {
    const { data, error } = await __supabase
      .from("user_provisioners")
      .select("legalName, companySize, companyType, industryType")
      .eq("id", job.uploader_id)
      .single();

    if (error) {
      console.log(error);
    }

    setUploader(data);
    setIsLoaded(true);
  };

  useEffect(() => {
    fetchUploader();
  }, []);

  return !isLoaded ? (
    <>
      <motion.div className="bg-base-200 h-[238px] p-5 rounded-btn flex flex-col">
        <div className="bg-base-100 h-[24px] mb-[4px]" />
        <div className="bg-base-100 h-[20px] mb-[4px]" />
        <div className="bg-base-100 h-[16px] mb-[4px] mt-[16px]" />
        <div className="bg-base-100 h-[46px] mb-[4px] mt-[16px]" />
        <div className="bg-base-100 h-[16px] mb-[4px] mt-[20px]" />
      </motion.div>
    </>
  ) : (
    <>
      <motion.div
        animate={{
          opacity: [0, 1],
          transition: { duration: 0.4, ease: "circOut" },
        }}
      >
        <Link
          href={`/jobs/${job.id}`}
          animate={{ opacity: [0, 1] }}
          className="flex flex-col w-full min-h-[200px] rounded-btn p-5 border-2 border-base-200 hover:bg-base-200 transition-all"
        >
          <h1 className="text-xl font-bold">{job.job_title}</h1>
          <p className="text-primary">{uploader.legalName}</p>

          <p className="mt-4 text-sm">
            {job.job_location} |{" "}
            {
              // make every first letter uppercase in job type array
              job.job_type.map(
                (type) => type.charAt(0).toUpperCase() + type.slice(1)
              )[0]
            }
          </p>

          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            // components={markdownRederers}
            className="mt-4 h-[50px] overflow-hidden prose prose-sm"
          >
            {job.short_description}
          </ReactMarkdown>

          <p className="text-sm mt-5 opacity-50">
            {dayjs(job.created_at).format("DD MMM YYYY")}
          </p>
        </Link>
      </motion.div>
    </>
  );
};

export default JobCard;
