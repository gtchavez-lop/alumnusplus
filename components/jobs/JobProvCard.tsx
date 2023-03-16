import { FC, useState } from "react";

import { FiLoader } from "react-icons/fi";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { TProvJobPost } from "@/lib/types";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import rehypeRaw from "rehype-raw";

const JobCardProv: FC<{ job: TProvJobPost; viewMode: "grid" | "list" }> = ({
	job,
	viewMode,
}) => {
	const [isClicked, setIsClicked] = useState(false);

	return (
		<>
			{isClicked && (
				<div className="fixed z-40 inset-0 w-full h-screen flex justify-center items-center bg-base-100/80">
					<FiLoader className="text-xl animate-spin" />
				</div>
			)}

			{viewMode === "grid" && (
				<Link
					href={`/p/jobs/posting?id=${job.id}`}
					onClick={() => setIsClicked(true)}
					className="flex flex-col max-h-fit h-fit w-full rounded-btn p-5 bg-base-200 hover:bg-primary/25 transition-all"
				>
					<h1 className="text-xl font-bold">{job.job_title}</h1>

					<p className="text-sm">
						{job.job_location} |{" "}
						{
							job.job_type.map(
								(type) => type.charAt(0).toUpperCase() + type.slice(1),
							)[0]
						}
					</p>

					<ReactMarkdown
						rehypePlugins={[rehypeRaw]}
						className="mt-4 overflow-hidden prose prose-sm"
					>
						{job.short_description}
					</ReactMarkdown>

					<div className="flex justify-between gap-5">
						<p className="text-sm mt-5 opacity-50">
							{dayjs(job.created_at).format("DD MMM YYYY")}
						</p>
						<p className="text-sm mt-5 opacity-50">
							{
								job.job_skills.map(
									(type) => type.charAt(0).toUpperCase() + type.slice(1),
								)[0]
							}
						</p>
					</div>
				</Link>
			)}
			{viewMode === "list" && (
				<Link
					href={`/p/jobs/posting?id=${job.id}`}
					onClick={() => setIsClicked(true)}
					className="flex items-end w-full rounded-btn py-3 px-4 bg-base-200 hover:bg-primary/25 transition-all justify-between"
				>
					<div>
						<h1 className="text-xl font-bold">{job.job_title}</h1>

						<p className="text-sm">
							{job.job_location} |{" "}
							{
								job.job_type.map(
									(type) => type.charAt(0).toUpperCase() + type.slice(1),
								)[0]
							}
						</p>
					</div>
					<div className="text-right flex flex-col justify-end">
						<p>
							{
								job.job_skills.map(
									(type) => type.charAt(0).toUpperCase() + type.slice(1),
								)[0]
							}
						</p>
						<p className="text-sm opacity-50">
							Posted on {dayjs(job.created_at).format("MMMM D, YYYY")}
						</p>
					</div>
				</Link>
			)}
		</>
	);
};

export default JobCardProv;
