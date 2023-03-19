import { GetServerSideProps, NextPage } from "next";
import { useQueries, useQuery } from "@tanstack/react-query";

import { AnimPageTransition } from "@/lib/animations";
import { FiLoader } from "react-icons/fi";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { TProvJobPost } from "@/lib/types";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { id } = context.query;

	const { data, error } = await supabase
		.from("public_jobs")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		console.error(error);
		return {
			props: {
				jobData: {
					isLoading: false,
					isFetched: true,
					data: {} as unknown as TProvJobPost,
				},
			},
		};
	}

	return {
		props: {
			jobData: {
				isLoading: false,
				isFetched: true,
				data: data as TProvJobPost,
			},
		},
	};
};

const JobPostingPage: NextPage<{
	jobData: {
		isLoading: boolean;
		isFetched: boolean;
		data: TProvJobPost;
	};
}> = ({ jobData }) => {
	return (
		<>
			{!jobData && (
				<motion.main
					variants={AnimPageTransition}
					initial="initial"
					animate="animate"
					exit="exit"
					className="relative min-h-screen w-full flex justify-center items-center"
				>
					<FiLoader className="animate-spin text-xl" />
				</motion.main>
			)}

			{jobData && (
				<motion.main
					variants={AnimPageTransition}
					initial="initial"
					animate="animate"
					exit="exit"
					className="relative min-h-screen w-full grid grid-cols-5 gap-10 py-24"
				>
					{/* overview */}
					<div className="col-span-full lg:col-span-2">
						<h3 className="text-2xl font-bold">Overview</h3>

						<div className="mt-10 flex flex-col gap-5">
							<p className="flex flex-col ">
								<span className="text-lg font-bold opacity-75 text-primary">
									Job Title
								</span>
								<span>{jobData.data!.job_title}</span>
							</p>
							<p className="flex flex-col">
								<span className="text-lg font-bold opacity-75 text-primary">
									Job Type
								</span>
								<span>{jobData.data!.job_type}</span>
							</p>
							<p className="flex flex-col">
								<span className="text-lg font-bold opacity-75 text-primary">
									Job Location
								</span>
								<span>{jobData.data!.job_location}</span>
							</p>
							<p className="flex flex-col">
								<span className="text-lg font-bold opacity-75 text-primary">
									Short Description
								</span>
								<span>{jobData.data!.short_description}</span>
							</p>
							<div className="flex flex-col">
								<span className="text-lg font-bold opacity-75 text-primary">
									Skill Requirements
								</span>
								<ul className="list-disc pl-5">
									{jobData.data!.job_skills.map((skill, index) => (
										<li key={`qualification_${index}`}>{skill}</li>
									))}
								</ul>
							</div>
							<div className="flex flex-col">
								<span className="text-lg font-bold opacity-75 text-primary">
									Qualifications
								</span>
								<ul className="list-disc pl-5">
									{jobData.data!.job_qualifications.map(
										(qualification, index) => (
											<li key={`qualification_${index}`}>{qualification}</li>
										),
									)}
								</ul>
							</div>
						</div>
					</div>
					{/* full description */}
					<div className="col-span-full lg:col-span-3">
						<h3 className="text-2xl font-bold">Full Description</h3>

						<ReactMarkdown className="prose mt-10">
							{jobData.data!.full_description}
						</ReactMarkdown>
					</div>
				</motion.main>
			)}
		</>
	);
};

export default JobPostingPage;
