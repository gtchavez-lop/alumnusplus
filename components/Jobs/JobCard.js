import { useEffect, useState } from "react";

import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import SkeletonCard from "../../components/Feed/SkeletonCard";
import { __supabase } from "../../supabase";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import rehypeRaw from "rehype-raw";

const JobCard = ({ job }) => {
  return (
    <motion.div
      animate={{
        opacity: [0, 1],
        transition: { duration: 0.2, ease: "circOut" },
      }}
    >
      <Link
        href={`/jobs/${job.id}`}
        className="flex flex-col w-full min-h-[200px] rounded-btn p-5 border-2 border-base-200 hover:bg-base-200 transition-all"
      >
        <h1 className="text-xl font-bold">{job.job_title}</h1>
        <p className="text-primary">{job.uploader.legalName}</p>

        <p className="mt-4 text-sm">
          {job.job_location} |{" "}
          {
            job.job_type.map(
              (type) => type.charAt(0).toUpperCase() + type.slice(1)
            )[0]
          }
        </p>

        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          className="mt-4 h-[50px] overflow-hidden prose prose-sm"
        >
          {job.short_description}
        </ReactMarkdown>

        <p className="text-sm mt-5 opacity-50">
          {dayjs(job.created_at).format("DD MMM YYYY")}
        </p>
      </Link>
    </motion.div>
  );
};

export default JobCard;
