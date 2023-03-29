import { FC } from "react";
import Link from "next/link";
import { MdFavorite } from "react-icons/md";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import rehypeRaw from "rehype-raw";

interface Job {
	id: string;
	job_title: string;
	job_location: string;
	short_description: string;
	created_at: string;
	job_type: string[];
	uploader: {
		legalName: string;
	};
}

const JobCard: FC<{ job: Job; isSaved?: boolean }> = ({ job, isSaved }) => {
	return (
		job && (
			<motion.div
				animate={{
					opacity: [0, 1],
					transition: { duration: 0.2, ease: "circOut" },
				}}
			>
				<Link
					href={`/h/jobs/posting?id=${job.id}`}
					className="flex flex-col w-full min-h-[200px] rounded-btn p-5 bg-base-200 hover:bg-primary/30 transition-all"
				>
					<div className="flex items-start">
						<div>
							<h1 className="text-xl font-bold">{job.job_title}</h1>
							<p className="text-primary">{job.uploader.legalName}</p>
						</div>
						<div className="ml-auto">
							{isSaved ? <MdFavorite className="text-red-500" /> : null}
						</div>
					</div>

					<p className="mt-4 text-sm">
						{job.job_location} |{" "}
						{
							job.job_type.map(
								(type) => type.charAt(0).toUpperCase() + type.slice(1),
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
		)
	);
};

export default JobCard;
