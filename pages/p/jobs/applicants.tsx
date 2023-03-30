import { GetServerSideProps, NextPage } from "next";
import { useQueries, useQuery } from "@tanstack/react-query";

import { AnimPageTransition } from "@/lib/animations";
import { FiLoader } from "react-icons/fi";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { IUserProvisioner, TProvJobPost } from "@/lib/types";
import { $accountDetails } from "@/lib/globalStates";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";
import dayjs from "dayjs";
import JobApplicantCard from "@/components/jobs/JobApplicantCard";
import { MdWarning } from "react-icons/md";
import Link from "next/link";

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
const fetchApplicants = async () => {
	const _currentUser = useStore($accountDetails) as IUserProvisioner;
	const { data, error } = await supabase
		.from("public_jobs")
		.select("*,uploader:uploader_id(legalName)")
		// .order("createdAt", { ascending: false })
		.eq("uploader_id", _currentUser.id);

	if (error) {
		console.log(error);
	}

	return data as TProvJobPost[];
};
const [applicants] = useQueries({
	queries: [
		{
			queryKey: ["allJobApplicants"],
			queryFn: fetchApplicants,
			enabled: !!_u,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
		},

	],
});

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
						<h3 className="text-2xl font-bold">Applicant</h3>

						<div className="mt-5  border-b-2">
							<h1 className="text-xl font-bold text-primary">{jobData.data.job_title}</h1>

							<p className="text-sm">
								{jobData.data.job_location} |{" "}
								{
									jobData.data.job_type.map(
										(type) => type.charAt(0).toUpperCase() + type.slice(1),
									)[0]
								}
							</p>
							<p className="text-sm opacity-50">
								Posted on {dayjs(jobData.data.created_at).format("MMMM D, YYYY")}
							</p>
						</div>
						{/* full description */}
						<div className="col-span-full lg:col-span-3 text-justify">
							<p className="flex flex-col">
								<span className="text-lg font-bold opacity-75 text-primary">
									Short Description
								</span>
								<span className=" mb-5">{jobData.data?.short_description}</span>
							</p>
							<h3 className="text-lg font-bold opacity-75 text-primary">Full Description</h3>
							<p className="flex flex-col mb-3  mb-5">
								{jobData.data?.full_description}
							</p>
							<div className="flex flex-col">
								<span className="text-lg font-bold opacity-75 text-primary">
									Skill Requirements
								</span>
								<ul className="list-disc pl-5  mb-5">
									{jobData.data?.job_skills.map((skill, index) => (
										<li key={`qualification_${index}`}>{skill}</li>
									))}
								</ul>
							</div>
							<div className="flex flex-col">
								<span className="text-lg font-bold opacity-75 text-primary">
									Qualifications
								</span>
								<ul className="list-disc pl-5  mb-5">
									{jobData.data?.job_qualifications.map(
										(qualification, index) => (
											<li key={`qualification_${index}`}>{qualification}</li>
										),
									)}
								</ul>
							</div>
						</div>

					</div>
					{/* right side applicants*/}
					<div className="col-span-full lg:col-span-2">
						<h3 className="text-2xl font-bold">Applicants</h3>
						<div className="flex flex-col gap-2">
							{applicants.isLoading && (
								<>
									{Array(2)
										.fill("")
										.map((_, i) => (
											<div
												style={{ transitionDelay: `${i * 100}ms` }}
												key={`loading_${i}`}
												className="bg-slate-500/50 rounded-btn animate-pulse text-transparent"
											>
												<h1 className="text-xl font-bold">placeholder</h1>
												<p className="text-sm">placeholder</p>
												<div className="mt-4 h-[50px]">placeholder</div>
												<p className="text-sm mt-5 opacity-50">
													placeholder
												</p>
											</div>
										))}
								</>
							)}

							{applicants.isFetched && (
								<>
									{applicants.data?.map(
										(applicants, index) =>
											index < 3 && (

												<JobApplicantCard
													viewMode="list"
													key={applicants.id}
													job={applicants}
												/>
											),
									)}

									{applicants.isSuccess && !applicants.data && (
										<div className="flex flex-col items-center gap-2">
											<MdWarning className="text-4xl text-warning" />
											<p className="text-center">
												There are no applications yet. <br />
												<Link href="/p/jobs/new" className="btn btn-link">
													Subscribe to Wicket to Prioritisation
												</Link>
											</p>
										</div>
									)}

									{applicants.isSuccess && !applicants.data && (
										<Link
											href={"/p/jobs/applicant"}
											className="btn btn-ghost btn-block"
										>
											See all Jobs
										</Link>
									)}
								</>
							)}
						</div>
					</div>

				</motion.main>
			)}
		</>
	);
};

export default JobPostingPage;