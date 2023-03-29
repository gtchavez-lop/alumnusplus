import { FiLoader, FiPlus } from "react-icons/fi";
import { IUserProvisioner, TProvJobPost } from "@/lib/types";
import { MdGrid3X3, MdGridView, MdList, MdTableView } from "react-icons/md";

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
		refetchOnMount: true,
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
						<p className="text-3xl mb-2">Active Job Posts</p>

						<div className="flex justify-between items-center ">
							<Link
								href="/p/jobs/new"
								className="btn btn-primary items-center gap-2"
							>
								<span>Add new job</span>
								<FiPlus />
							</Link>
							{viewMode === "grid" ? (
								<button
									onClick={() => {
										setViewMode("list");
									}}
									className="hidden md:inline-flex btn btn-ghost"
								>
									<MdTableView className="text-lg" />
									<span>Change to Table View</span>
								</button>
							) : (
								<button
									onClick={() => {
										setViewMode("grid");
									}}
									className="btn btn-ghost"
								>
									<MdGridView className="text-lg" />
									<span>Change to Grid View</span>
								</button>
							)}
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
								<>
									<div className="md:flex flex-col gap-2 hidden">
										{provJobs.isSuccess &&
											provJobs.data?.map((job, index) => (
												<JobCardProv
													job={job}
													viewMode="list"
													key={`jobcard_${index}`}
												/>
											))}
									</div>
									<p className="alert alert-warning md:hidden">
										Table View not supported in mobile
									</p>
								</>
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
