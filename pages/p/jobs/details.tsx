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
import dayjs from "dayjs";

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
					<div className="col-span-full lg:col-span-3">
						<h3 className="text-2xl font-bold">Overview</h3>

						<div className="mt-5">
							<h1 className="text-xl font-bold">{jobData.data.job_title}</h1>

							<p className="text-sm">
								{jobData.data.job_location} |{" "}
								{
									jobData.data.job_type.map(
										(type) => type.charAt(0).toUpperCase() + type.slice(1),
									)[0]
								}
							</p>
						</div>
						<div className="text-right flex flex-col justify-end">
							<p>
								{
									jobData.data.job_skills.map(
										(type) => type.charAt(0).toUpperCase() + type.slice(1),
									)[0]
								}
							</p>
							<p className="text-sm opacity-50">
								Posted on {dayjs(jobData.data.created_at).format("MMMM D, YYYY")}
							</p>
						</div>
					</div>
					{/* full description */}
					<div className="col-span-full lg:col-span-">
						<h3 className="text-2xl font-bold">Full Description</h3>

						<ReactMarkdown className="prose mt-10">
							{jobData.data?.full_description}
						</ReactMarkdown>
					</div>
				</motion.main>
			)}
		</>
	);
};

export default JobPostingPage;
