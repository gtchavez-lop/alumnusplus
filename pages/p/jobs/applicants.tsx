import { GetServerSideProps, NextPage } from "next";
import { IUserHunter, IUserProvisioner, TProvJobPost } from "@/lib/types";
import { useEffect, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { FiLoader } from "react-icons/fi";
import JobApplicantCard from "@/components/jobs/JobApplicantCard";
import Link from "next/link";
import { MdWarning } from "react-icons/md";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";

const JobApplicants: NextPage = () => {
	const router = useRouter();

	const fetchJob = async () => {
		const { job_id } = router.query;

		const { data, error } = await supabase
			.from("public_jobs")
			.select("*")
			.eq("id", job_id)
			.single();

		if (error) {
			console.log(error);
			return {} as TProvJobPost;
		}

		return data as TProvJobPost;
	};

	const _targetJob = useQuery({
		queryKey: ["applicant", "job"],
		queryFn: fetchJob,
		enabled: !!router.query.job_id,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	const fetchApplicants = async () => {
		const { data, error } = await supabase
			.from("user_hunters")
			.select("*")
			.in("id", _targetJob.data?.applicants as string[]);

		if (error) {
			console.log(error);
			return [] as IUserHunter[];
		}

		return data as IUserHunter[];
	};

	const _applicantList = useQuery({
		queryKey: ["applicant", "list"],
		queryFn: fetchApplicants,
		enabled: _targetJob.isSuccess,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	return (
		<>
			{(_applicantList.isLoading || _targetJob.isLoading) && (
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

			{_applicantList.isSuccess && _targetJob.isSuccess && (
				<motion.main
					variants={AnimPageTransition}
					initial="initial"
					animate="animate"
					exit="exit"
					className="relative min-h-screen w-full flex flex-col gap-10 py-24"
				>
					<h3 className="text-3xl font-bold">Applicants</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
						{_applicantList.isLoading && (
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
											<p className="text-sm mt-5 opacity-50">placeholder</p>
										</div>
									))}
							</>
						)}

						{_applicantList.isSuccess && (
							<>
								{_applicantList.data?.map((applicants, index) => (
									<JobApplicantCard
										key={`applicant_${index}`}
										applicant={applicants}
									/>
								))}

								{_applicantList.isSuccess && !_applicantList.data && (
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

								{_applicantList.isSuccess && !_applicantList.data && (
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
				</motion.main>
			)}
		</>
	);
};

export default JobApplicants;
