import { FiArchive, FiBriefcase, FiUser } from "react-icons/fi";

import JobCard from "../../components/Jobs/JobCard";
import JobCardProv from "@/components/Jobs/JobCardProv";
import Link from "next/link";
import ProtectedPageContainer from "@/components/ProtectedPageContainer";
import { __PageTransition } from "../../lib/animation";
import { __supabase } from "@/supabase";
import { motion } from "framer-motion";
import { useQueries } from "@tanstack/react-query";
import { useUser } from "@supabase/auth-helpers-react";

const Prov_Dashboard = () => {
	const thisUser = useUser();

	const fetchJobs = async () => {
		const { data, error } = await __supabase
			.from("public_jobs")
			.select("*")
			.order("created_at", { ascending: false })
			.limit(5)
			.eq("uploader_id", thisUser.id);

		if (error) {
			console.log(error);
			return [];
		}

		return data;
	};

	const [jobs] = useQueries({
		queries: [
			{
				queryKey: ["jobs"],
				queryFn: fetchJobs,
				enabled: !!thisUser,
				refetchOnWindowFocus: false,
			},
		],
	});

	return (
		<>
			<ProtectedPageContainer>
				<motion.main
					variants={__PageTransition}
					initial="initial"
					animate="animate"
					exit="exit"
					className="relative min-h-screen w-full flex flex-col gap-10 pt-24 pb-36 "
				>
					<div className="grid grid-cols-5 gap-5">
						<div className="col-span-full lg:hidden">
							<div className="flex flex-col items-center">
								{!thisUser && (
									<>
										<div className="w-24 h-24 mask mask-squircle bg-zinc-500 bg-opacity-30 animate-pulse " />
										<p className="bg-zinc-500 bg-opacity-30 rounded-btn animate-pulse text-transparent">placeholder</p>
									</>
								)}
								{!!thisUser && (
									<>
										<img
											alt="avatar"
											src={`https://avatars.dicebear.com/api/bottts/${thisUser.user_metadata.legalName}.svg`}
											className="w-24 h-24 mask mask-squircle"
										/>
										<p>{thisUser.user_metadata.legalName}</p>
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
												jobs.isLoading && "bg-zinc-500 bg-opacity-30 rounded-btn animate-pulse text-transparent"
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
												.fill()
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

											<Link href={"/p/jobs"} className="btn btn-ghost btn-block">
												See all Jobs
											</Link>
										</>
									)}
								</div>
							</div>

							<div className="flex flex-col gap-3">
								<h2 className="text-2xl font-bold">Recent Activities</h2>
								<div className="flex flex-col gap-2">
									{Array(5)
										.fill()
										.map((_, i) => (
											<div
												key={`loading_${i}`}
												className="w-full h-[48px] bg-zinc-500 bg-opacity-30 rounded-btn animate-pulse"
											/>
										))}
									<div className="btn btn-primary btn-ghost btn-block ">See all</div>
								</div>
							</div>
						</div>

						{/* right side */}
						<div className="col-span-2 hidden lg:flex flex-col gap-5">
							<div className="flex flex-col items-center">
								{!thisUser && (
									<>
										<div className="w-24 h-24 mask mask-squircle bg-zinc-500 bg-opacity-30 animate-pulse " />
										<p className="bg-zinc-500 bg-opacity-30 rounded-btn animate-pulse text-transparent">placeholder</p>
									</>
								)}
								{!!thisUser && (
									<>
										<img
											alt="avatar"
											src={`https://avatars.dicebear.com/api/bottts/${thisUser.user_metadata.legalName}.svg`}
											className="w-24 h-24 mask mask-squircle"
										/>
										<p>{thisUser.user_metadata.legalName}</p>
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
										.fill()
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
			</ProtectedPageContainer>
		</>
	);
};

export default Prov_Dashboard;
