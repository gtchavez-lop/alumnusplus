import {
	AnimLoading,
	AnimPageTransition,
	AnimTabTransition,
} from "@/lib/animations";
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineSignalCellularNoSim, MdSearch, MdWarning } from "react-icons/md";

import { $accountDetails } from "@/lib/globalStates";
import CvBuilder from "@/components/jobs/CvBuilder";
import { IUserHunter, TProvJobPost } from "@/lib/types";
import Tabs from "@/components/Tabs";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQueries } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { useStore } from "@nanostores/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { empty } from "uuidv4";




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
	uploader:
	{
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

const ApplyPage = () => {
	const [tabSelected, setTabSelected] = useState("all");
	const _userDetails = useStore($accountDetails) as IUserHunter;
	const [tabContentRef] = useAutoAnimate();
	const router = useRouter();

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

	const fetchAppliedJobs = async () => {
		const appliedjobs = _userDetails.applied_jobs;

		const { data, error } = await supabase
			.from("public_jobs")
			.select(
				"id,job_title,uploader:uploader_id(legalName),job_location,short_description,created_at,job_type,job_skills",
			)
			.in("id", appliedjobs);

		if (error) {
			console.log(error);
			return [] as unknown as Promise<Job[]>;
		}
		// if (data) {
		// 	data.filter(
		// 		(applied: TProvJobPost) => a.id !== allJobs?.id,
		// 	);
		// 	return data as unknown as Promise<Job[]>;
		// }

		return data as unknown as Promise<Job[]>;
	};

	const [allJobs, recommendedJobs, savedJobs, appliedJobs] = useQueries({
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

			{
				queryKey: ["appliedJobs"],
				queryFn: fetchAppliedJobs,
				refetchOnWindowFocus: false,
				enabled: !!_userDetails,
			},
		],
	});

	const [jobResult, setJobResult] = useState<Job[]>([]);

	const searchJob = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget as HTMLFormElement;
		const searchQuery = form.searchQuery as HTMLInputElement;
		const pattern = `%${searchQuery.value}%`;

		const { data, error } = await supabase.rpc("search_job", {
			searchquery: pattern,
		});
		if (error) {
			console.log(error);
			setJobResult([]);
		}
		setJobResult(data);
	}

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
				{/* tabs */}
				<Tabs
					tabs={tabs}
					activeTab={tabSelected}
					onTabChange={(e) => {
						setTabSelected(e as TTab["value"]);
					}}
				/>

				{/* content */}
				<div ref={tabContentRef} className="overflow-hidden">

					{/* all jobs */}
					{tabSelected === "all" && (
						<>

							<form
								onSubmit={searchJob}
								className="flex gap-2 w-full max-w-xl mx-auto mt-2">
								{/* search for jobs */}

								<input
									type="text"
									name="searchQuery"
									placeholder="Search for jobs "
									className="flex-1 input input-primary input-bordered"

								/>
								<button type="submit" className="btn btn-primary">
									<MdSearch className="text-lg" />
								</button>

							</form>
							<motion.div
								className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mt-10"
								key={"all_jobs"}
							>

								{/* {allJobs.isSuccess &&
              allJobs.data.map((job: AllJob, index: number) => (
                <JobCard job={job} key={`jobcard_${index}`} />
              ))} */}
								{allJobs.isSuccess && jobResult.length < 1 &&
									allJobs.data.map((thisJob: Job, index: number) => (
										<JobCard
											isSaved={_userDetails.saved_jobs.includes(thisJob.id)}
											job={thisJob}
											key={`jobcard_${index}`}
										/>
									))}

								{allJobs.isLoading && jobResult.length < 1 &&
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
								{jobResult.length > 0 &&
									jobResult.map((thisJob: Job, index: number) => (
										<JobCard
											isSaved={_userDetails.saved_jobs.includes(thisJob.id)}
											job={thisJob}
											key={`jobcard_${index}`}
										/>
									))}
							</motion.div>

						</>
					)}
					{tabSelected === "recommended" && (
						<motion.div
							className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mt-10"
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
						<motion.div className="grid grid-cols-1 lg:grid-cols-2 mt-10 gap-5">
							{/* <p className="alert alert-warning">
								This feature is still in development. We are working on it.
							</p> */}
							{appliedJobs.isSuccess &&
								appliedJobs.data.map((job, index) => (
									<JobCard job={job} key={`appliedjob_${index}`} />
								))}
							{appliedJobs.isLoading &&
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

export default ApplyPage;
