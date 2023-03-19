import { FiLoader, FiPlus } from "react-icons/fi";
import { IUserProvisioner, TProvJobPost } from "@/lib/types";
import { MdGrid3X3, MdList } from "react-icons/md";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import JobCardProv from "@/components/jobs/JobProvCard";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useStore } from "@nanostores/react";

// import { useSupabaseClient } from "@supabase/auth-helpers-react";

const JobPostings = () => {
	const _currentUser = useStore($accountDetails) as IUserProvisioner;
	const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
	const [contentView] = useAutoAnimate();

	const fetchProvJobs = async (): Promise<TProvJobPost[]> => {
		const { data, error } = await supabase
			.from("public_jobs")
			.select("*")
			.eq("uploader_id", _currentUser.id);

		if (error) {
			console.log(error);
			return [] as unknown as TProvJobPost[];
		}

		return data as unknown as TProvJobPost[];
	};

	const provJobs = useQuery({
		queryKey: ["allJobPosts"],
		queryFn: fetchProvJobs,
		enabled: !!_currentUser,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	return (
		<>
			{!provJobs.isLoading ? (
				<>
					<motion.main
						variants={AnimPageTransition}
						initial="initial"
						animate="animate"
						exit="exit"
						className="relative min-h-screen w-full flex flex-col gap-10 pt-24 pb-36"
					>
						<div>
							<p className="text-3xl mb-2">Active Job Posts</p>
						</div>

						<div className="flex justify-between items-center ">
							<Link
								href="/p/jobs/new"
								className="btn btn-primary items-center gap-2"
							>
								<span>Add new job</span>
								<FiPlus />
							</Link>
							<button
								onClick={() => {
									setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
								}}
								className="btn btn-ghost"
							>
								{viewMode === "grid" ? (
									<MdList className="text-lg" />
								) : (
									<MdGrid3X3 className="text-lg" />
								)}
							</button>
						</div>

						<div ref={contentView}>
							{viewMode === "grid" && (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
									{provJobs.isSuccess &&
										provJobs.data?.map((job, index) => (
											<JobCardProv
												job={job}
												viewMode="grid"
												key={`jobcard_${index}`}
											/>
										))}
								</div>
							)}
							{viewMode === "list" && (
								<div className="flex flex-col gap-2">
									{provJobs.isSuccess &&
										provJobs.data?.map((job, index) => (
											<JobCardProv
												job={job}
												viewMode="list"
												key={`jobcard_${index}`}
											/>
										))}
								</div>
							)}
						</div>
					</motion.main>
				</>
			) : (
				<motion.main
					variants={AnimPageTransition}
					initial="initial"
					animate="animate"
					exit="exit"
					className="relative min-h-screen w-full flex flex-col justify-center items-center"
				>
					<FiLoader className="animate-spin text-4xl text-primary" />
				</motion.main>
			)}
		</>
	);
};

export default JobPostings;
