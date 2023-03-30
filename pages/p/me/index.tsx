import { $accountDetails, $accountType, $themeMode } from "@/lib/globalStates";
import { AnimPageTransition, AnimTabTransition } from "@/lib/animations";
import { AnimatePresence, motion } from "framer-motion";
import { IUserProvisioner, TProvJobPost } from "@/lib/types";
import { MdAdd, MdClose } from "react-icons/md";
import { useEffect, useState } from "react";

import Image from "next/image";
import JobCard from "@/components/jobs/JobCard";
import JobCardProv from "@/components/jobs/JobProvCard";
import Link from "next/link";
import Modal from "@/components/Modal";
import { NextPage } from "next";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import Tabs from "@/components/Tabs";
import { supabase } from "@/lib/supabase";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQueries } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";

type TTabs = {
	title: string;
	value: string;
};

const tabs: TTabs[] = [
	{
		title: "About",
		value: "about",
	},
	{
		title: "Job Posts",
		value: "jobs",
	},
	{
		title: "Followers",
		value: "followers",
	},
];

const ProvProfilePage: NextPage = () => {
	const _currentTheme = useStore($themeMode);
	const router = useRouter();
	const _currentUser = useStore($accountDetails) as IUserProvisioner;
	const [tabSelected, setTabSelected] = useState<
		"about" | "jobs" | "followers"
	>("about");
	const [tabContent] = useAutoAnimate();
	const [isSigningOut, setIsSigningOut] = useState(false);

	const getTheme = () => {
		if (typeof window !== "undefined" && window.localStorage) {
			const storedPrefs = window.localStorage.getItem("theme");
			if (typeof storedPrefs === "string") {
				return storedPrefs;
			}

			const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
			if (userMedia.matches) {
				return "dark";
			}
		}

		return "light";
	};

	const handleSignOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;

			$accountDetails.set(null);
			$accountType.set(null);

			router.push("/");
		} catch (error) {
			console.log(error);
		}
	};

	const fetchJobs = async () => {
		const { data, error } = await supabase
			.from("public_jobs")
			.select("*")
			.order("created_at", { ascending: false })
			.limit(5)
			.eq("uploader_id", _currentUser.id);

		if (error) {
			console.log(error);
			return [];
		}

		return data as TProvJobPost[];
	};

	const fetchFollowers = async () => {
		const queryString = _currentUser.followers;

		const { data, error } = await supabase
			.from("user_hunters")
			.select("id,username,full_name,avatar_url")
			.in("id", queryString);

		if (error) {
			return [];
		}

		return data;
	};

	const [latestJobs, followerList] = useQueries({
		queries: [
			{
				queryKey: ["allJobPosts"],
				queryFn: fetchJobs,
				enabled: !!_currentUser,
				refetchOnWindowFocus: false,
				refetchOnMount: false,
			},
			{
				queryKey: ["prov_followers"],
				queryFn: fetchFollowers,
				enabled: !!_currentUser,
				refetchOnWindowFocus: false,
				refetchOnMount: false,
			},
		],
	});

	useEffect(() => {
		const localTheme = getTheme();
		if (localTheme) {
			$themeMode.set(localTheme as "light" | "dark");
			document.body.setAttribute("data-theme", localTheme);
		}
	}, []);

	return (
		<>
			{_currentUser && (
				<>
					<motion.main
						variants={AnimPageTransition}
						initial="initial"
						animate="animate"
						exit="exit"
						className="relative min-h-screen w-full flex flex-col gap-10 pt-24 pb-36 "
					>
						<div className="grid grid-cols-1 lg:grid-cols-5 gap-5 overflow-hidden">
							<div className="col-span-full lg:col-span-3">
								{/* profile */}
								<div className="relative rounded-btn overflow-hidden flex flex-col gap-3">
									<div className="absolute h-[250px] w-full">
										<div className="bg-gradient-to-t from-base-100 to-transparent w-full h-full absolute opacity-75" />
										<Image
											className="object-cover rounded-btn rounded-b-none object-center w-full h-full "
											src={`https://picsum.photos/seed/${_currentUser.legalName}/900/450`}
											alt="background"
											width={900}
											height={450}
											priority
										/>
									</div>
									<div className="z-10 mt-[200px] px-5 flex items-end gap-5">
										<Image
											className="mask mask-squircle bg-primary"
											src={
												_currentUser.avatar_url ||
												`https://api.dicebear.com/5.x/shapes/png?seed=${_currentUser.legalName}`
											}
											alt="profile"
											width={100}
											height={100}
											priority
										/>
										<div>
											<p className="text-xl leading-tight font-bold">
												Wicket Journeys
											</p>
											<p className="text-sm">
												{_currentUser.followers.length} followers
											</p>
										</div>
									</div>
									<div className="z-10 flex justify-end items-center gap-2 mt-5">
										<Link href="/p/me/edit" className="btn btn-primary">
											Edit
										</Link>
										<div className="btn btn-primary">Share Page</div>
										<Link href="/p/me/hunter-view" className="btn">
											View as Hunter
										</Link>
									</div>
								</div>
								<div className="divider bg-base-content h-[5px] rounded-full opacity-20 my-10" />
								{/* mobile select */}
								<select
									className="select select-bordered select-primary w-full lg:hidden"
									onChange={(e) => {
										setTabSelected(
											e.target.value as "about" | "jobs" | "followers",
										);
									}}
								>
									{tabs.map((item, index) => (
										<option key={`tab-${index}`} value={item.value}>
											{item.title}
										</option>
									))}
								</select>
								{/* desktop tabs */}
								<Tabs
									tabs={tabs}
									activeTab={tabSelected}
									onTabChange={(e: string) => {
										setTabSelected(e as "about" | "jobs" | "followers");
									}}
								/>

								{/* <ul className="tabs tabs-boxed">
									{tabs.map((item, index) => (
										<li
											key={`tab-${index}`}
											onClick={() => {
												setTabSelected(
													item.value as "about" | "jobs" | "followers",
												);
											}}
											className={`tab ${tabSelected === item.value && "tab-active"
												}`}
										>
											{item.name}
										</li>
									))}
								</ul> */}

								{/* content */}
								<div className="mt-10 overflow-hidden" ref={tabContent}>
									{tabSelected === "jobs" && (
										<motion.div
											variants={AnimTabTransition}
											initial="initial"
											animate="animate"
											exit="exit"
											className="flex flex-col gap-5"
										>
											{latestJobs.isSuccess && latestJobs.data?.length > 0 && (
												<Link
													href="/p/jobs/new"
													className="btn btn-ghost btn-block gap-2"
												>
													Create New Job Post
													<MdAdd />
												</Link>
											)}
											{latestJobs.isSuccess && latestJobs.data?.length < 1 && (
												<div className="flex justify-center items-center flex-col py-16">
													<Image
														alt=""
														priority
														src="/file-search.png"
														width={200}
														height={200}
													/>
													<div className="text-center flex flex-col items-center">
														<p className="font-bold text-xl">
															You haven&apos;t posted anything
														</p>
														<p className="leading-tight">
															Post your first adventure
														</p>
														<Link
															href="/p/jobs/new"
															className="btn btn-primary mt-5 gap-2"
														>
															Create your first post
															<MdAdd />
														</Link>
													</div>
												</div>
											)}
											{latestJobs.isSuccess && latestJobs.data?.length > 0 && (
												<div className="flex flex-col gap-2">
													{latestJobs.data.map((job) => (
														<JobCardProv
															viewMode="list"
															key={job.id}
															job={job}
														/>
													))}
												</div>
											)}
										</motion.div>
									)}
									{tabSelected === "about" && (
										<motion.div
											key={"about_tab"}
											variants={AnimTabTransition}
											initial="initial"
											animate="animate"
											exit="exit"
										>
											<p className="text-2xl font-bold mb-5">
												About this company
											</p>

											<div className="mt-3 shadow-lg p-5 rounded-btn">
												<p className="text-lg font-bold text-primary">
													Full Description
												</p>
												<ReactMarkdown className="prose">
													{_currentUser.fullDescription}
												</ReactMarkdown>
											</div>
											<div className="mt-3 shadow-lg p-5 rounded-btn">
												<p className="text-lg font-bold text-primary">
													Contact information
												</p>
												<div>
													<p className="flex justify-between">
														<span>Email</span>
														<span>{_currentUser.contactInformation.email}</span>
													</p>
													<p className="flex justify-between">
														<span>Phone</span>
														<span>{_currentUser.contactInformation.phone}</span>
													</p>
												</div>
											</div>
											<div className="mt-3 shadow-lg p-5 rounded-btn">
												<p className="text-lg font-bold text-primary">
													Industry
												</p>
												<p>{_currentUser.industryType}</p>
											</div>
											<div className="mt-3 shadow-lg p-5 rounded-btn">
												<p className="text-lg font-bold text-primary">
													Company Size
												</p>
												<p>{_currentUser.companySize} people</p>
											</div>
											<div className="mt-3 shadow-lg p-5 rounded-btn">
												<p className="text-lg font-bold text-primary">
													Founding Year
												</p>
												<p>{_currentUser.foundingYear}</p>
											</div>
											<div className="mt-3 shadow-lg p-5 rounded-btn">
												<p className="text-lg font-bold text-primary">
													Location
												</p>
												<p>
													{_currentUser.address.address},{" "}
													{_currentUser.address.city}
												</p>
											</div>
										</motion.div>
									)}
									{tabSelected === "followers" && (
										<div>
											<h3 className="text-2xl font-bold">Followers</h3>

											<div className="mt-4">
												{followerList.isSuccess &&
													followerList.data.map((item, index) => (
														<div
															key={`follower_${index}`}
															className="bg-base-200 rounded-btn p-4 flex gap-3 items-center"
														>
															<Image
																width={50}
																height={50}
																className="mask mask-squircle"
																alt={item.username}
																src={item.avatar_url}
															/>
															<div>
																<p className="leading-none text-lg font-bold">
																	{item.full_name?.first} {item.full_name?.last}
																</p>
																<p className="leading-none opacity-75">
																	@{item.username}
																</p>
															</div>
														</div>
													))}
											</div>
										</div>
									)}
								</div>
							</div>
							<div className="col-span-full lg:col-span-2 flex flex-col gap-3">
								{/* <div className="flex flex-col gap-3">
									<p className="text-2xl font-bold">Analytics</p>
									<div>
										<div>
											<p className="text-lg font-bold">
												{_currentUser.totalVisits}
											</p>
											<p>Total Visits</p>
											<div className="divider bg-base-content h-[1px] rounded-full opacity-40 mt-3" />
										</div>
										<div>
											<p className="text-lg font-bold">
												{_currentUser.followers.length ?? 0}
											</p>
											<p>Total Followers</p>
											<div className="divider bg-base-content h-[1px] rounded-full opacity-40 mt-3" />
										</div>
									</div>
								</div> */}
								<div className="bg-base-200 p-4 rounded-btn flex flex-col gap-4">
									<label className="flex items-center justify-between">
										<span>Dark Mode</span>
										<input
											checked={_currentTheme === "dark"}
											onChange={(e) => {
												$themeMode.set(e.target.checked ? "dark" : "light");
												document.body.setAttribute(
													"data-theme",
													e.target.checked ? "dark" : "light",
												);
											}}
											type="checkbox"
											className="toggle toggle-primary"
										/>
									</label>
									<label className="flex items-center justify-between">
										<span>Notifications</span>
										<input
											type="checkbox"
											disabled
											className="toggle toggle-primary"
										/>
									</label>

									<label className="mt-7">
										<span>End your session</span>
										<button
											onClick={() => setIsSigningOut(true)}
											className="btn btn-error btn-block"
										>
											Sign Out
										</button>
									</label>
								</div>
							</div>
						</div>
					</motion.main>

					{isSigningOut && (
						<Modal isVisible={isSigningOut} setIsVisible={setIsSigningOut}>
							<p className="text-lg font-bold">
								Do you want to end your session and sign out?
							</p>

							<div className="flex items-center gap-2 justify-end">
								<button onClick={handleSignOut} className="btn btn-ghost">
									Yes
								</button>
								<button
									onClick={() => setIsSigningOut(false)}
									className="btn btn-primary"
								>
									No
								</button>
							</div>
						</Modal>
					)}

					{/* <>
						<input type='checkbox' id="signOutModal" className="modal-toggle" />
						<label htmlFor="signOutModal" className="modal">
							<label htmlFor="" className="modal-box relative">
								<label
									htmlFor="signOutModal"
									className="btn btn-sm absolute right-4 top-4"
								>
									<MdClose />
								</label>
								<h3 className="text-lg font-bold">Confirm sign out session</h3>
								<p className="py-4">
									Are you sure you want to end your session?
								</p>

								<div className="flex justify-end gap-3 mt-10">
									<label htmlFor="signOutModal" className="btn btn-error">
										No, cancel
									</label>
									<button onClick={handleSignOut} className="btn btn-primary">
										Yes, sign out
									</button>
								</div>
							</label>
						</label>
					</> */}
				</>
			)}
		</>
	);
};

export default ProvProfilePage;
