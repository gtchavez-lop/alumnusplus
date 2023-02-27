import { FiArchive, FiBriefcase, FiUser } from "react-icons/fi";
import { IUserProvisioner, TProvJobPost } from "@/lib/types";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import Image from "next/image";
import Link from "next/link";
import { MdWarning } from "react-icons/md";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useQueries } from "@tanstack/react-query";
import { useStore } from "@nanostores/react";

const JobCardProv = dynamic(() => import("@/components/jobs/JobProvCard"), {
	ssr: false,
});

const Prov_Dashboard = () => {
	const _currentUser = useStore($accountDetails) as IUserProvisioner;

	const fetchJobs = async () => {
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

	const [jobs] = useQueries({
		queries: [
			{
				queryKey: ["allJobPosts"],
				queryFn: fetchJobs,
				enabled: !!_currentUser,
				refetchOnWindowFocus: false,
				refetchOnMount: false,
			},
		],
	});

	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full flex flex-col gap-10 pt-24 pb-36 "
			>
				<div className="grid grid-cols-5 gap-5">
					<div className="col-span-full lg:hidden">
						<div className="flex flex-col items-center">
							{!_currentUser && (
								<>
									<div className="w-24 h-24 mask mask-squircle bg-zinc-500 bg-opacity-30 animate-pulse " />
									<p className="bg-zinc-500 bg-opacity-30 rounded-btn animate-pulse text-transparent">
										placeholder
									</p>
								</>
							)}
							{!!_currentUser && (
								<>
									<Image
										alt="avatar"
										src={`https://avatars.dicebear.com/api/bottts/${_currentUser.legalName}.svg`}
										className="w-24 h-24 mask mask-squircle"
										width={96}
										height={96}
									/>
									<p>{_currentUser.legalName}</p>
								</>
							)}
							<Link href={"/p/me"} className="btn btn-link">
								Go to my profile
							</Link>
						</div>
					</div>
					<div className="col-span-full lg:col-span-3 flex flex-col gap-5">
						{/* stats */}
						<div className="flex flex-col gap-3">
							<h2 className="text-2xl font-bold">Summary</h2>
							<div className="stats stats-vertical md:stats-horizontal bg-base-200 w-full">
								<div className="stat">
									<div className="stat-figure text-secondary">
										<FiUser className="text-2xl" />
									</div>
									<div className="stat-title">Job Applicants</div>
									<div className="stat-value bg-zinc-500 bg-opacity-30 rounded-btn animate-pulse text-transparent">
										240
									</div>
									<div className="stat-desc">Since start of profile</div>
								</div>

								<div className="stat">
									<div className="stat-figure text-secondary">
										<FiBriefcase className="text-2xl" />
									</div>
									<div className="stat-title">Job Posts</div>
									<div
										className={`stat-value ${
											jobs.isLoading &&
											"bg-zinc-500 bg-opacity-30 rounded-btn animate-pulse text-transparent"
										}`}
									>
										{jobs.isSuccess ? jobs.data.length : "0"}
									</div>
									<div className="stat-desc">Current count</div>
								</div>

								<div className="stat">
									<div className="stat-figure text-secondary">
										<FiArchive className="text-2xl" />
									</div>
									<div className="stat-title">Archived Applicants</div>
									<div className="stat-value bg-zinc-500 bg-opacity-30 rounded-btn animate-pulse text-transparent">
										150
									</div>
									<div className="stat-desc">Since start of profile</div>
								</div>
							</div>
						</div>

						{/* posted Jobs */}
						<div className="flex flex-col gap-3">
							<h2 className="text-2xl font-bold">Job Postings</h2>
							<div className="flex flex-col gap-2">
								{jobs.isLoading && (
									<>
										{Array(2)
											.fill("")
											.map((_, i) => (
												<div
													style={{ transitionDelay: `${i * 100}ms` }}
													key={`loading_${i}`}
													className="bg-zinc-500 bg-opacity-30 rounded-btn animate-pulse text-transparent"
												>
													<h1 className="text-xl font-bold">placeholder</h1>
													<p className="text-sm">placeholder</p>
													<div className="mt-4 h-[50px]">placeholder</div>
													<p className="text-sm mt-5 opacity-50">placeholder</p>
												</div>
											))}
									</>
								)}

								{jobs.isSuccess && (
									<>
										{jobs.data.map((job) => (
											<JobCardProv key={job.id} job={job} />
										))}

										{jobs.data.length === 0 && (
											<div className="flex flex-col items-center gap-2">
												<MdWarning className="text-4xl text-warning" />
												<p className="text-center">
													You have not posted any jobs yet. <br />
													<Link href="/p/jobs/new" className="btn btn-link">
														Post a job
													</Link>
												</p>
											</div>
										)}

										{jobs.data.length > 0 && (
											<Link
												href={"/p/jobs"}
												className="btn btn-ghost btn-block"
											>
												See all Jobs
											</Link>
										)}
									</>
								)}
							</div>
						</div>

						<div className="flex flex-col gap-3">
							<h2 className="text-2xl font-bold">Recent Activities</h2>
							<div className="flex flex-col gap-2">
								{Array(5)
									.fill("")
									.map((_, i) => (
										<div
											key={`loading_${i}`}
											className="w-full h-[48px] bg-zinc-500 bg-opacity-30 rounded-btn animate-pulse"
										/>
									))}
								<div className="btn btn-primary btn-ghost btn-block ">
									See all
								</div>
							</div>
						</div>
					</div>

					{/* right side */}
					<div className="col-span-2 hidden lg:flex flex-col gap-5">
						<div className="flex flex-col items-center">
							{!_currentUser && (
								<>
									<div className="w-24 h-24 mask mask-squircle bg-zinc-500 bg-opacity-30 animate-pulse " />
									<p className="bg-zinc-500 bg-opacity-30 rounded-btn animate-pulse text-transparent">
										placeholder
									</p>
								</>
							)}
							{!!_currentUser && (
								<>
									<Image
										alt="avatar"
										src={`https://avatars.dicebear.com/api/bottts/${_currentUser.legalName}.svg`}
										className="w-24 h-24 mask mask-squircle"
										width={96}
										height={96}
									/>
									<p>{_currentUser.legalName}</p>
								</>
							)}
							<Link href={"/p/me"} className="btn btn-link">
								Go to my profile
							</Link>
						</div>

						<div className="flex flex-col gap-4">
							<h2 className="text-2xl font-bold">Reminders</h2>
							<div className="flex flex-col gap-2">
								{Array(5)
									.fill("")
									.map((_, i) => (
										<div
											key={`loading2_${i}`}
											className="w-full h-[48px] bg-zinc-500 bg-opacity-30 rounded-btn animate-pulse"
										/>
									))}
							</div>
						</div>
					</div>
				</div>
			</motion.main>
		</>
	);
};

export default Prov_Dashboard;
