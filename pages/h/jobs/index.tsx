import { AnimPageTransition, AnimTabTransition } from "@/lib/animations";
import { AnimatePresence, motion } from "framer-motion";

import { $accountDetails } from "@/lib/globalStates";
import { IUserHunter } from "@/lib/types";
import JobCard from "@/components/jobs/JobCard";
import { supabase } from "@/lib/supabase";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { useStore } from "@nanostores/react";

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

const JobPage = () => {
	const [tabSelected, setTabSelected] = useState("all");
	const _userDetails = useStore($accountDetails) as IUserHunter;

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
		const tags = [..._userDetails.skill_secondary, _userDetails.skill_primary];

		const { data, error } = await supabase
			.from("public_jobs")
			.select(
				"job_title,uploader:uploader_id(legalName),job_location,short_description,created_at,job_type,job_skills",
			)
			.in("job_skills", tags)
			.limit(10);

		if (error) {
			console.log(error);
			return [] as unknown as Promise<Job[]>;
		}

		return data as unknown as Promise<Job[]>;
	};

	const [allJobs, recommendedJobs] = useQueries({
		queries: [
			{
				queryKey: ["allJobs"],
				queryFn: fetchAllJobs,
				refetchOnMount: false,
				enabled: !!_userDetails,
			},
			{
				queryKey: ["recommendedJobs"],
				queryFn: fetchRecommendedJobs,
				refetchOnMount: false,
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
				{/* tabs */}
				<div className="tabs tabs-boxed">
					<p
						onClick={() => setTabSelected("all")}
						className={`tab ${tabSelected === "all" && "tab-active"}`}
					>
						All Jobs
					</p>
					<p
						onClick={() => setTabSelected("recommended")}
						className={`tab ${tabSelected === "recommended" && "tab-active"}`}
					>
						Recommended Jobs
					</p>
					<p
						onClick={() => setTabSelected("builder")}
						className={`tab ${tabSelected === "builder" && "tab-active"}`}
					>
						Wicket CV Builder
					</p>
				</div>

				{/* content */}
				{/* all jobs */}
				<AnimatePresence mode="wait">
					{tabSelected === "all" && (
						<motion.div
							variants={AnimTabTransition}
							initial="initial"
							animate="animate"
							exit="exit"
							className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mt-10"
							key={"all_jobs"}
						>
							{/* {allJobs.isSuccess &&
              allJobs.data.map((job: AllJob, index: number) => (
                <JobCard job={job} key={`jobcard_${index}`} />
              ))} */}
							{allJobs.isSuccess &&
								allJobs.data.map((thisJob: Job, index: number) => (
									<JobCard job={thisJob} key={`jobcard_${index}`} />
								))}

							{allJobs.isLoading &&
								Array(10)
									.fill(0)
									.map((_, index) => (
										<div
											key={`jobloader_${index}`}
											style={{
												animationDelay: `${index * 50}ms`,
												animationDuration: "1s",
											}}
											className="h-[238px] w-full bg-zinc-500/50 animate-pulse "
										/>
									))}
						</motion.div>
					)}
					{tabSelected === "recommended" && (
						<motion.div
							variants={AnimTabTransition}
							initial="initial"
							animate="animate"
							exit="exit"
							className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mt-10"
							key={"recommended_jobs"}
						>
							<p>Recommended</p>
							{/* {jobs.map((job, index) => (
              <JobCard job={job} key={`jobcard_${index}`} />
            ))} */}
						</motion.div>
					)}
					{tabSelected === "builder" && (
						<motion.div
							variants={AnimTabTransition}
							initial="initial"
							animate="animate"
							exit="exit"
							className=" mt-10"
						>
							{/* <CvBuilder /> */}
						</motion.div>
					)}
				</AnimatePresence>
			</motion.main>
		</>
	);
};

export default JobPage;
