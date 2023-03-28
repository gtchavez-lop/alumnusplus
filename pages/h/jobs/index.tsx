import {
	AnimLoading,
	AnimPageTransition,
	AnimTabTransition,
} from "@/lib/animations";
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineSignalCellularNoSim, MdWarning } from "react-icons/md";

import { $accountDetails } from "@/lib/globalStates";
import CvBuilder from "@/components/jobs/CvBuilder";
import { IUserHunter } from "@/lib/types";
import Tabs from "@/components/Tabs";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { useStore } from "@nanostores/react";

const JobCard = dynamic(() => import("@/components/jobs/JobCard"), {
	ssr: false,
});

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

type TTab = {
	title: string;
	value: string;
};

const tabs: TTab[] = [
	{
		title: "All Jobs",
		value: "all",
	},
	{
		title: "Jobs for you",
		value: "recommended",
	},
	{
		title: "Saved Jobs",
		value: "saved",
	},
	{
		title: "Applied Jobs",
		value: "applied",
	},
	{
		title: "CV/Resume Builder",
		value: "cv",
	},
];

const JobPage = () => {
	const [tabSelected, setTabSelected] = useState("all");
	const _userDetails = useStore($accountDetails) as IUserHunter;
	const [tabContentRef] = useAutoAnimate();

	const fetchAllJobs = async () => {
		const { data, error } = await supabase
			.from("public_jobs")
			.select("*,uploader:uploader_id(legalName)");

		if (error) {
			console.log(error);
			return [] as unknown as Promise<Job[]>;
		}

		return data as unknown as Promise<Job[]>;
	};

	const fetchRecommendedJobs = async () => {
		const tags = [_userDetails.skill_primary, ..._userDetails.skill_secondary];

		const { data, error } = await supabase
			.from("public_jobs")
			.select(
				"job_title,uploader:uploader_id(legalName),job_location,short_description,created_at,job_type,job_skills",
			)
			.contains("job_skills:text[]", [_userDetails.skill_primary]);

		if (error) {
			console.log(error);
			return [] as unknown as Promise<Job[]>;
		}

		return data as unknown as Promise<Job[]>;
	};

	const fetchSavedJobs = async () => {
		const savedjobs = _userDetails.saved_jobs;

		const { data, error } = await supabase
			.from("public_jobs")
			.select(
				"id,job_title,uploader:uploader_id(legalName),job_location,short_description,created_at,job_type,job_skills",
			)
			.in("id", savedjobs);

		if (error) {
			console.log(error);
			return [] as unknown as Promise<Job[]>;
		}

		return data as unknown as Promise<Job[]>;
	};

	const [allJobs, recommendedJobs, savedJobs] = useQueries({
		queries: [
			{
				queryKey: ["allJobs"],
				queryFn: fetchAllJobs,
				refetchOnWindowFocus: false,
				enabled: !!_userDetails,
			},
			{
				queryKey: ["recommendedJobs"],
				queryFn: fetchRecommendedJobs,
				refetchOnWindowFocus: false,
				enabled: !!_userDetails,
			},
			{
				queryKey: ["savedJobs"],
				queryFn: fetchSavedJobs,
				refetchOnWindowFocus: false,
				enabled: !!_userDetails,
			},
		],
	});
	//   const user_secondarySkills = authState.user_metadata.secondarySkills;

	//   const { data, error } = await __supabase
	//     .from("public_jobs")
	//     .select("*")
	//     .limit(10);
	//   // .range(recommendedJobPage * 10, recommendedJobPage * 10 + 10);

	//   if (error) {
	//     console.log(error);
	//   }

	//   setRecommendedJobs(data);
	// };

	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				<p className="text-3xl mb-2">Job Portal</p>
				{/* desktop tabs */}
				<Tabs
					tabs={tabs}
					activeTab={tabSelected}
					onTabChange={(e) => {
						setTabSelected(e as TTab["value"]);
					}}
				/>
				{/* mobile select */}
				<select
					className="select select-primary w-full mb-5 lg:hidden"
					onChange={(e) => {
						setTabSelected(e.target.value as TTab["value"]);
					}}
				>
					{tabs.map((tab, index) => (
						<option key={`tab_${index}`} value={tab.value}>
							{tab.title}
						</option>
					))}
				</select>

				{/* content */}
				<div ref={tabContentRef} className="overflow-hidden">
					{/* all jobs */}
					{tabSelected === "all" && (
						<motion.div
							className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full"
							key={"all_jobs"}
						>
							{/* {allJobs.isSuccess &&
              allJobs.data.map((job: AllJob, index: number) => (
                <JobCard job={job} key={`jobcard_${index}`} />
              ))} */}
							{allJobs.isSuccess &&
								allJobs.data.map((thisJob: Job, index: number) => (
									<JobCard
										isSaved={_userDetails.saved_jobs.includes(thisJob.id)}
										job={thisJob}
										key={`jobcard_${index}`}
									/>
								))}

							{allJobs.isLoading &&
								Array(2)
									.fill(0)
									.map((_, index) => (
										<motion.div
											key={`jobloader_${index}`}
											variants={AnimLoading}
											animate="animate"
											className="h-[238px] w-full bg-slate-500/50 animate-pulse rounded-btn"
										/>
									))}
						</motion.div>
					)}
					{tabSelected === "recommended" && (
						<motion.div
							className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full"
							key={"recommended_jobs"}
						>
							<div className="col-span-full">
								<div className="alert alert-warning">
									This feature is still in development. We only show you jobs
									based on your primary skill.
								</div>
							</div>
							{recommendedJobs.isSuccess &&
								recommendedJobs.data.map((job, index) => (
									<JobCard
										isSaved={_userDetails.saved_jobs.includes(job.id)}
										job={job}
										key={`recommendedjob_${index}`}
									/>
								))}
							{recommendedJobs.isLoading &&
								Array(2)
									.fill(0)
									.map((_, index) => (
										<motion.div
											key={`jobloader_${index}`}
											variants={AnimLoading}
											animate="animate"
											className="h-[238px] w-full bg-slate-500/50 animate-pulse rounded-btn"
										/>
									))}
						</motion.div>
					)}
					{tabSelected === "saved" && (
						<motion.div className="grid grid-cols-1 lg:grid-cols-2 mt-10">
							{savedJobs.isSuccess &&
								savedJobs.data.map((job, index) => (
									<JobCard job={job} key={`savedjob_${index}`} />
								))}
							{savedJobs.isLoading &&
								Array(2)
									.fill(0)
									.map((_, index) => (
										<motion.div
											key={`jobloader_${index}`}
											variants={AnimLoading}
											animate="animate"
											className="h-[238px] w-full bg-slate-500/50 animate-pulse rounded-btn"
										/>
									))}
						</motion.div>
					)}
					{tabSelected === "applied" && (
						<motion.div>
							<p className="alert alert-warning">
								This feature is still in development. We are working on it.
							</p>
						</motion.div>
					)}
					{tabSelected === "cv" && (
						<motion.div className=" mt-10">
							<CvBuilder />
						</motion.div>
					)}
				</div>
			</motion.main>
		</>
	);
};

export default JobPage;
