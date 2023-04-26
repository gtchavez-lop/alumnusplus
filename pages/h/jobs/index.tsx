import {
	AnimLoading,
	AnimPageTransition,
	AnimTabTransition,
} from "@/lib/animations";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { IUserHunter, TProvJobPost } from "@/lib/types";
import { MdInfo, MdSearch } from "react-icons/md";
import { useQueries, useQuery } from "@tanstack/react-query";

import { $accountDetails } from "@/lib/globalStates";
import ActiveJobTabPanel from "@/components/jobs/ActiveJobTabPanel";
import CvBuilder from "@/components/jobs/CvBuilder";
import Footer from "@/components/Footer";
import Tabs from "@/components/Tabs";
import dynamic from "next/dynamic";
import { empty } from "uuidv4";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRouter } from "next/router";
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
		title: "Active Job",
		value: "active",
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
	const [jobResult, setJobResult] = useState<Job[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [allJobPage, setAllJobPage] = useState<number>(0);
	const router = useRouter();

	const fetchPaginatedAllJobs = async () => {
		const { data, error } = await supabase
			.from("public_jobs")
			.select("*,uploader:uploader_id(legalName)")
			.eq("draft", false)
			.range(allJobPage * 9, (allJobPage + 1) * 9);

		if (error) {
			console.log(error);
			return [];
		}

		return data;
	}

	const fetchAllJobs = async () => {
		const { data, error } = await supabase
			.from("public_jobs")
			.select("*,uploader:uploader_id(legalName)")
			.eq("draft", false);

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
			.select("*,uploader:uploader_id(legalName)")
			.contains("job_skills:text[]", [_userDetails.skill_primary])
			.eq("draft", false);

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
			.select("*,uploader:uploader_id(legalName)")
			.in("id", savedjobs)
			.eq("draft", false);

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
			.select("*,uploader:uploader_id(legalName)")
			.in("id", appliedjobs)
			.eq("draft", false);

		if (error) {
			console.log(error);
			return [] as unknown as Promise<Job[]>;
		}

		return data as unknown as Promise<Job[]>;
	};

	const allJobs = useQuery({
		queryKey: ["h.jobs.all", allJobPage],
		queryFn: fetchPaginatedAllJobs,
		enabled: !!_userDetails,
		refetchOnWindowFocus: false,
		keepPreviousData: true,
	});

	const [recommendedJobs, savedJobs, appliedJobs] = useQueries({
		queries: [
			// {
			// 	queryKey: ["allJobs"],
			// 	queryFn: fetchAllJobs,
			// 	refetchOnWindowFocus: false,
			// 	enabled: !!_userDetails,
			// },
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

	const searchJob = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget as HTMLFormElement;
		const searchQuery = form.searchQuery as HTMLInputElement;
		const pattern = `%${searchQuery.value}%`;

		setIsSearching(true);

		const { data, error } = await supabase
			.from("public_jobs")
			.select("*,uploader:uploader_id(legalName)")
			.ilike("job_title", pattern);

		if (error) {
			console.log(error);
			setJobResult([]);
		}

		setIsSearching(false);
		setJobResult(data as Job[]);
	};

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
				<div ref={tabContentRef} className="mt-5">
					{/* all jobs */}
					{tabSelected === "all" && (
						<>
							<form
								onSubmit={searchJob}
								className="input-group w-full max-w-md mb-5 mx-auto"
							>
								<input
									name="searchQuery"
									type="text"
									className="input input-primary w-full"
									placeholder="Search for Jobs"
									onInput={(e) => {
										if (e.currentTarget.value.length < 1) {
											setJobResult([]);
										}
									}}
								/>
								<button type="submit" className="btn btn-primary">
									<MdSearch className="text-lg" />
								</button>
							</form>

							<motion.div
								className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full"
								key={"all_jobs"}
							>
								{isSearching && (
									<div className="col-span-full text-center flex justify-center my-5">
										<p>Searching Jobs</p>
									</div>
								)}

								{!isSearching &&
									allJobs.isLoading &&
									jobResult.length < 1 &&
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

								{!isSearching &&
									jobResult.length > 0 &&
									jobResult.map((item, index) => (
										<JobCard
											key={item.id}
											job={item}
											isSaved={_userDetails.saved_jobs.includes(item.id)}
											isApplied={_userDetails.applied_jobs.includes(item.id)}
										/>
									))}

								{!isSearching &&
									jobResult.length < 1 &&
									allJobs.isSuccess &&
									allJobs.data.map((item, index) => (
										<JobCard
											key={item.id}
											job={item}
											isSaved={_userDetails.saved_jobs.includes(item.id)}
											isApplied={_userDetails.applied_jobs.includes(item.id)}
										/>
									))}
							</motion.div>

							{allJobs.isSuccess && (
								// next page button
								<div className="flex justify-between max-w-md mx-auto mt-10">
									<button
										disabled={allJobPage === 0}
										onClick={() => {
											// go to top of the page
											window.scrollTo({
												top: 0,
												behavior: "smooth",
											});
											setAllJobPage((prev) => {
												// do not go less than 0
												if (prev - 1 < 0) {
													return 0;
												}
												return prev - 1;
											});
										}}
										className="btn btn-primary"
									>
										Previous
									</button>
									<button
										onClick={() => {
											// go to top of the page
											window.scrollTo({
												top: 0,
												behavior: "smooth",
											});
											setAllJobPage((prev) => prev + 1);
										}}
										className="btn btn-primary"
									>
										Next
									</button>
								</div>
							)}
						</>
					)}
					{tabSelected === "recommended" && (
						<motion.div
							className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full"
							key={"recommended_jobs"}
						>
							{recommendedJobs.isSuccess &&
								recommendedJobs.data.map((job, index) => (
									<JobCard
										isSaved={_userDetails.saved_jobs.includes(job.id)}
										isApplied={_userDetails.applied_jobs.includes(job.id)}
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
						<motion.div className="grid grid-cols-1 lg:grid-cols-2 mt-10 gap-5 w-full">
							{savedJobs.isSuccess &&
								savedJobs.data.map((job, index) => (
									<JobCard job={job} key={`savedjob_${index}`} />
								))}
							{savedJobs.isSuccess && savedJobs.data.length < 1 && (
								<div className="col-span-full text-center flex flex-col items-center my-5">
									<MdInfo className="text-4xl text-primary" />
									<p>No saved jobs</p>
								</div>
							)}
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

					{tabSelected === "active" && (
						<div className="mt-10">
							<ActiveJobTabPanel />
						</div>
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
