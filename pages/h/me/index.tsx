import { $accountDetails, $accountType, $themeMode } from "@/lib/globalStates";
import { AnimatePresence, motion } from "framer-motion";
import {
	FiEdit,
	FiEdit2,
	FiEdit3,
	FiFacebook,
	FiGithub,
	FiInstagram,
	FiLinkedin,
	FiTwitter,
} from "react-icons/fi";
import { IUserHunter, IUserProvisioner, TProvJobPost } from "@/lib/types";
import {
	MdCheck,
	MdCheckCircle,
	MdCheckCircleOutline,
	MdFacebook,
	MdInfo,
	MdNote,
	MdSchool,
	MdTrain,
	MdWork,
} from "react-icons/md";
import { useQueries, useQueryClient } from "@tanstack/react-query";

import { AnimPageTransition } from "@/lib/animations";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/Modal";
import { NextPage } from "next";
import ReactMarkdown from "react-markdown";
import Tabs from "@/components/Tabs";
import dayjs from "dayjs";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useStore } from "@nanostores/react";

interface LocalProvJobPost extends TProvJobPost {
	uploader_id: IUserProvisioner;
}

type TTabs =
	| "about"
	| "posts"
	| "experiences"
	| "education"
	| "connections"
	| "followedCompanies"
	| "trainings"
	| "savedjobs";

const PageTabs = [
	{
		title: "About",
		value: "about",
	},
	{
		title: "Posts",
		value: "posts",
	},
	{
		title: "Connections",
		value: "connections",
	},
	{
		title: "Followed Companies",
		value: "followedCompanies",
	},
	{
		title: "Experiences",
		value: "experiences",
	},
	{
		title: "Education",
		value: "education",
	},
	{
		title: "Trainings",
		value: "trainings",
	},
	{
		title: "Saved Jobs",
		value: "savedjobs",
	},
];

const ProfilePage: NextPage = () => {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const _currentUser = useStore($accountDetails) as IUserHunter;
	const router = useRouter();
	const [tabSelected, setTabSelected] = useState<TTabs>("about");
	const [tabContentRef] = useAutoAnimate();
	const [signOutModalVisible, setSignOutModalVisible] = useState(false);
	const cacheQueryClient = useQueryClient();

	const _globalTheme = useStore($themeMode);

	const toggleTheme = () => {
		if (_globalTheme === "dark") {
			// set to light mode
			$themeMode.set("light");
			document.body.setAttribute("data-theme", "light");
			localStorage.setItem("theme", "light");
		} else {
			// set to dark mode
			$themeMode.set("dark");
			document.body.setAttribute("data-theme", "dark");
			localStorage.setItem("theme", "dark");
		}
	};

	const handleLogout = async () => {
		setIsLoggingOut(true);
		toast.loading("Logging out...");

		const { error } = await supabase.auth.signOut();
		if (error) {
			toast.error(error.message);
			toast.dismiss();
			toast.error("Failed to log out");
			return;
		}

		$accountType.set(null);
		$accountDetails.set(null);
		cacheQueryClient.clear();

		toast.dismiss();
		router.push("/login");
	};

	const fetchUserActivities = async () => {
		const { data, error } = await supabase
			.from("public_posts")
			.select("*")
			.eq("uploader", _currentUser.id);

		if (error) {
			return [];
		}

		return data;
	};

	const fetchUserConnections = async () => {
		const existingConnections = _currentUser.connections as string[];

		const { data, error } = await supabase
			.from("user_hunters")
			.select("id,full_name,username,avatar_url")
			.in("id", existingConnections);

		if (error) {
			return [];
		}

		return data;
	};

	const fetchRecommendedUsers = async () => {
		const connections = _currentUser.connections.concat(_currentUser.id);

		const { data, error } = await supabase
			.from("new_recommended_hunters")
			.select("*")
			.limit(4);

		if (error) {
			console.log("error", error);
			return [] as IUserHunter[];
		}

		const filtered = data.filter(
			(user: { id: string }) => !connections.includes(user.id),
		);

		return filtered as IUserHunter[];
	};

	const fetchUserSavedJobs = async () => {
		const savedJobs = _currentUser.saved_jobs as string[];

		const { data, error } = await supabase
			.from("public_jobs")
			.select("*,uploader_id(*)")
			.in("id", savedJobs);

		if (error) {
			return [];
		}

		return data as LocalProvJobPost[];
	};

	const fetchSavedCompanies = async () => {
		const savedCompanies = _currentUser.followedCompanies as string[];

		const { data, error } = await supabase
			.from("user_provisioners")
			.select("legalName,shortDescription,id")
			.in("id", savedCompanies);

		if (error) {
			return [];
		}

		return data;
	};

	const [
		userConnections,
		recommendedUsers,
		userActivities,
		savedJobs,
		savedCompanies,
	] = useQueries({
		queries: [
			{
				queryKey: ["userConnections"],
				queryFn: fetchUserConnections,
				enabled: !!_currentUser,
				onError: (): void => {
					console.error("failed to fetch user connections");
				},
				onSuccess: (): void => {
					console.info("✅ User Connections Fetched");
				},
			},
			{
				queryKey: ["recommendedUsers"],
				queryFn: fetchRecommendedUsers,
				enabled: !!_currentUser,
				refetchOnMount: false,
				onError: () => {
					console.error("failed to fetch recommended users");
				},
				onSuccess: () => {
					console.info("✅ Recommended Users Fetched");
				},
			},
			{
				queryKey: ["userActivities"],
				queryFn: fetchUserActivities,
				enabled: !!_currentUser,
				onError: () => {
					toast.error("Failed to fetch user activities");
				},
				onSuccess: () => {
					console.info("✅ User Activities Fetched");
				},
			},
			{
				queryKey: ["savedJobs"],
				queryFn: fetchUserSavedJobs,
				enabled: !!_currentUser,
				onError: () => {
					toast.error("Failed to fetch saved jobs");
				},
				onSuccess: () => {
					console.info("✅ User Saved Jobs Fetched");
				},
			},
			{
				queryKey: ["savedCompanies"],
				queryFn: fetchSavedCompanies,
				enabled: !!_currentUser,
				onError: () => {
					toast.error("Failed to fetch saved companies");
				},
			},
		],
	});

	return (
		<>
			{_currentUser && (
				<>
					<motion.main
						variants={AnimPageTransition}
						initial="initial"
						animate="animate"
						exit="exit"
						className="relative min-h-screen w-full pt-24 pb-36"
					>
						<section className="flex flex-col gap-5">
							<div className="flex flex-col gap-3">
								{/* landing profile */}
								<div className="flex sm:items-center gap-5 flex-col sm:flex-row bg-base-200 rounded-btn p-5">
									<div className="relative">
										<Image
											src={_currentUser.avatar_url}
											alt="avatar"
											className="w-32 h-32 bg-primary mask mask-squircle object-cover object-center "
											width={128}
											height={128}
										/>
									</div>
									<div>
										<p className="text-3xl font-bold flex gap-1 items-center">
											{_currentUser.full_name.first}{" "}
											{_currentUser.full_name.last}
											{_currentUser.is_verified && (
												<MdCheckCircleOutline className="text-blue-500 text-lg" />
											)}
										</p>

										<p className="font-semibold opacity-75">
											@{_currentUser.username}
										</p>
										<p>
											Joined at:{" "}
											<span className="opacity-50">
												{dayjs(_currentUser.created_at).format("MMMM DD, YYYY")}
											</span>
										</p>
									</div>
								</div>

								<div className="flex justify-end">
									<Link
										href={"/h/me/edit"}
										className="btn btn-primary items-center gap-3"
									>
										Edit Profile
										<FiEdit3 />
									</Link>
								</div>

								{/* mobile select */}
								<div className="lg:hidden">
									<select
										value={tabSelected}
										onChange={(e) =>
											setTabSelected(e.currentTarget.value as TTabs)
										}
										className="select select-primary w-full"
									>
										{PageTabs.map((tab, index) => (
											<option key={`tab-${index}`} value={tab.value}>
												{tab.title}
											</option>
										))}
									</select>
								</div>
								{/* desktop tabs */}
								<Tabs
									tabs={PageTabs}
									activeTab={tabSelected}
									onTabChange={(e) => {
										setTabSelected(e as TTabs);
									}}
								/>

								<div className="py-5" ref={tabContentRef}>
									{tabSelected === "about" && (
										<div className="flex flex-col gap-2">
											{/* bio */}
											<div className="flex flex-col shadow-md rounded-btn p-5 gap-3">
												<div className="flex justify-between items-start">
													<p className="text-2xl font-bold">Bio</p>
												</div>

												<ReactMarkdown className="prose">
													{_currentUser.bio ||
														"This user has not added a bio yet"}
												</ReactMarkdown>
											</div>
											{/* skills */}
											<div className="flex flex-col shadow-md rounded-btn p-5 gap-3">
												<p className="text-2xl font-bold">Skillsets</p>
												<div className="flex flex-col">
													<h4 className="text-lg font-semibold">
														Primary Skill
													</h4>
													<p className="badge badge-primary badge-lg">
														{_currentUser.skill_primary}
													</p>
												</div>
												<div className="flex flex-col">
													<h4 className="text-lg font-semibold">
														Secondary Skills
													</h4>
													<p className="flex flex-wrap gap-2">
														{_currentUser.skill_secondary.map(
															(skill, index) => (
																<span
																	key={`secondaryskill_${index}`}
																	className="badge badge-accent badge-lg"
																>
																	{skill}
																</span>
															),
														)}
													</p>
												</div>
											</div>
											{/* residence */}
											<div className="flex flex-col shadow-md rounded-btn p-5 gap-3">
												<p className="text-2xl font-bold">Residence</p>
												<div className="flex flex-col ">
													<p>
														{_currentUser.address.address},{" "}
														{_currentUser.address.city} -{" "}
														{_currentUser.address.postalCode}
													</p>
												</div>
											</div>
											{/* socials */}
											<div className="flex flex-col shadow-md rounded-btn p-5 gap-3">
												<p className="text-2xl font-bold">Social Media Links</p>
												<div className="flex flex-wrap gap-2">
													{_currentUser.social_media_links.facebook && (
														<Link
															href={_currentUser.social_media_links.facebook}
															target="_blank"
															rel="noopener noreferrer"
															className="btn btn-primary"
														>
															<FiFacebook className="text-xl" />
														</Link>
													)}
													{_currentUser.social_media_links.twitter && (
														<Link
															href={_currentUser.social_media_links.twitter}
															target="_blank"
															rel="noopener noreferrer"
															className="btn btn-primary"
														>
															<FiTwitter className="text-xl" />
														</Link>
													)}
													{_currentUser.social_media_links.instagram && (
														<Link
															href={_currentUser.social_media_links.instagram}
															target="_blank"
															rel="noopener noreferrer"
															className="btn btn-primary"
														>
															<FiInstagram className="text-xl" />
														</Link>
													)}
													{_currentUser.social_media_links.linkedin && (
														<Link
															href={_currentUser.social_media_links.linkedin}
															target="_blank"
															rel="noopener noreferrer"
															className="btn btn-primary"
														>
															<FiLinkedin className="text-xl" />
														</Link>
													)}
													{_currentUser.social_media_links.github && (
														<Link
															href={_currentUser.social_media_links.github}
															target="_blank"
															rel="noopener noreferrer"
															className="btn btn-primary"
														>
															<FiGithub className="text-xl" />
														</Link>
													)}
												</div>
											</div>
										</div>
									)}
									{tabSelected === "posts" && (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
											{userActivities.isSuccess &&
												userActivities.data.map((activity, index) => (
													<Link
														key={`blogpost_${index}`}
														href={`/h/feed/post?id=${activity.id}`}
													>
														<div
															key={`activity_${index}`}
															className="relative flex gap-2 items-center justify-between overflow-hidden p-5 border-2 border-primary hover:border-transparent hover:bg-primary hover:bg-opacity-30 transition rounded-btn"
														>
															<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-base-100" />
															<ReactMarkdown className="prose prose-sm h-[150px] ">
																{`${activity.content.substring(0, 300)}`}
															</ReactMarkdown>
														</div>
													</Link>
												))}

											{userActivities.isSuccess &&
												userActivities.data.length === 0 && (
													<div className="col-span-full flex flex-col items-center py-5">
														<p className="alert alert-info max-w-xs text-center">
															No Posts yet. Please add posts to your feed and
															they will appear here
														</p>
													</div>
												)}

											{userActivities.isLoading &&
												Array(5)
													.fill("")
													.map((_, index) => (
														<div
															key={`activityloading_${index}`}
															className="h-[72px] w-full bg-base-300 rounded-btn animate-pulse"
														/>
													))}
										</div>
									)}
									{tabSelected === "connections" && (
										<div className="flex flex-col md:grid grid-cols-2 gap-2">
											{_currentUser.connections.length === 0 && (
												<div className="col-span-full flex flex-col items-center py-5">
													<p className="alert alert-info max-w-xs text-center">
														No Connections yet. Please add people to your
														connections
													</p>
												</div>
											)}
											{userConnections.data?.map((connection, index) => (
												<Link
													href={`/h?user=${connection.username}`}
													key={`connection_${index}`}
													className="flex gap-2 items-center justify-between p-3 bg-base-200 hover:bg-primary hover:bg-opacity-30 transition rounded-btn"
												>
													<div className="flex gap-2 items-center">
														<Image
															src={connection.avatar_url}
															alt="avatar"
															className="w-12 h-12 mask mask-squircle bg-primary object-cover object-center"
															width={48}
															height={48}
														/>
														<div>
															<p className="font-bold leading-none">
																{connection.full_name.first}{" "}
																{connection.full_name.last}
															</p>
															<p className="opacity-50 leading-none">
																@{connection.username}
															</p>
														</div>
													</div>
												</Link>
											))}
										</div>
									)}
									{tabSelected === "followedCompanies" && (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
											{_currentUser.followedCompanies.length === 0 && (
												<div className="col-span-full flex flex-col items-center py-5">
													<p className="alert alert-info max-w-xs text-center">
														You do not follow any companies yet. Please follow
														companies to see them here.
													</p>
												</div>
											)}

											{savedCompanies.isSuccess &&
												savedCompanies.data.map((company, i) => (
													<Link
														href={`/h/drift/company?id=${company.id}`}
														key={`company_${i}`}
														className="bg-base-200 shadow-md rounded-btn p-5 hover:bg-primary hover:bg-opacity-30 transition"
													>
														<p className="text-lg">{company.legalName}</p>
														<p className="mt-2 text-sm opacity-75">
															{company.shortDescription}
														</p>
													</Link>
												))}
										</div>
									)}
									{tabSelected === "experiences" && (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
											{_currentUser.experience.length === 0 && (
												<div className="col-span-full flex flex-col items-center py-5">
													<p className="alert alert-info max-w-xs text-center">
														No Experiences yet. Please add experiences to your
														profile and they will appear here
													</p>
												</div>
											)}
											{_currentUser.experience.map((exp, i) => (
												<div
													key={`expereince_${i}`}
													className="shadow-md rounded-btn p-5"
												>
													<p className="text-lg">
														{exp.jobPosition} - {exp.companyName}
													</p>
													<p>{exp.location}</p>
													<p className="mt-2 text-sm opacity-75">
														{exp.startDate} -{" "}
														{exp.isCurrent ? "Present" : exp.endDate}
													</p>
												</div>
											))}
										</div>
									)}
									{tabSelected === "education" && (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
											{_currentUser.experience.length === 0 && (
												<div className="col-span-full flex flex-col items-center py-5">
													<p className="alert alert-info max-w-xs text-center">
														No Education yet. Please add education to your
														profile and they will appear here
													</p>
												</div>
											)}
											{_currentUser.education.map((edu, i) => (
												<div
													key={`education_${i}`}
													className="shadow-md rounded-btn p-5"
												>
													<p className="text-lg">
														<span className="capitalize">{edu.degreeType}</span>{" "}
														- {edu.institution}
													</p>
													<p>{edu.location}</p>
													{edu.degreeName && (
														<p className="mt-2 text-sm opacity-75">
															{edu.degreeName}
														</p>
													)}
													<p className="mt-2 text-sm opacity-75">
														{edu.yearGraduated}
													</p>
												</div>
											))}
										</div>
									)}
									{tabSelected === "trainings" && (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
											{_currentUser.trainings.length === 0 && (
												<div className="col-span-full flex flex-col items-center py-5">
													<p className="alert alert-info max-w-xs text-center">
														No Trainings yet. Please add trainings to your
														profile and they will appear here
													</p>
												</div>
											)}
											{_currentUser.trainings.map((training, i) => (
												<div
													key={`training-${i}`}
													className="shadow-md rounded-btn p-5"
												>
													<p className="text-lg font-bold">{training.title}</p>
													<p className="">
														{dayjs(training.date).format("MMMM D, YYYY")}
													</p>
													<p className="text-sm opacity-75">
														{training.organizer} | {training.location}
													</p>
													<p className="text-sm opacity-75 capitalize">
														{training.type}
													</p>
												</div>
											))}
										</div>
									)}
									{tabSelected === "savedjobs" && (
										<div className="flex flex-col gap-2">
											{savedJobs.isSuccess &&
												savedJobs.data.map((job, index) => (
													<Link
														key={`savedjob_${index}`}
														href={`/h/jobs/posting?id=${job.id}`}
													>
														<div
															key={`savedjob_${index}`}
															className="relative flex flex-col bg-base-200 overflow-hidden p-5 hover:bg-primary/30 transition rounded-btn"
														>
															<p className="text-lg">{job.job_title}</p>
															<p className="text-sm opacity-75">
																{job.uploader_id.legalName}
															</p>
															<p>
																{job.job_location} - {job.job_type}
															</p>
															<div className="mt-5 flex gap-2 flex-wrap">
																{job.job_skills.map((tag, index) => (
																	<span
																		key={`tag_${index}`}
																		className="badge badge-accent"
																	>
																		{tag}
																	</span>
																))}
															</div>
														</div>
													</Link>
												))}

											{savedJobs.isSuccess && savedJobs.data.length === 0 && (
												<div className="col-span-full flex flex-col items-center py-5">
													<p className="alert alert-info max-w-xs text-center">
														No Saved Jobs yet. Please save jobs to your profile
														and they will appear here
													</p>
												</div>
											)}
										</div>
									)}
								</div>
							</div>

							{/* second column */}
							<div className="flex flex-col gap-5">
								<div className="flex flex-col rounded-btn p-2 gap-3">
									<p className="text-2xl font-bold">Suggested Connections</p>

									{recommendedUsers.isLoading && (
										<div className="flex flex-col gap-2">
											{Array(5)
												.fill("")
												.map((_, index) => (
													<div
														key={`recommendedloading_${index}`}
														className="h-[72px] w-full bg-base-300 rounded-btn animate-pulse"
													/>
												))}
										</div>
									)}

									<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
										{recommendedUsers.isSuccess &&
											recommendedUsers.data.length < 1 && (
												<p>
													We do not have any suggestions for you right now. Try
													connecting to more people to get more suggestions.
												</p>
											)}

										{recommendedUsers.isSuccess &&
											recommendedUsers.data.length > 0 &&
											recommendedUsers.data.map((thisUser, index) => (
												<Link
													href={`/h/${thisUser.username}`}
													key={`connection_${index}`}
												>
													<div className="flex gap-5 items-center justify-between p-3 bg-base-200 rounded-btn hover:bg-primary hover:bg-opacity-30 transition">
														<div className="flex gap-5 items-center">
															<Image
																src={thisUser.avatar_url}
																alt="avatar"
																className="w-12 h-12 mask mask-squircle bg-primary object-center object-cover"
																width={50}
																height={50}
															/>
															<div>
																<p className="font-bold leading-none">
																	{thisUser.full_name.first}{" "}
																	{thisUser.full_name.last}
																</p>
																<p className="opacity-50 leading-none">
																	@{thisUser.username}
																</p>
															</div>
														</div>
													</div>
												</Link>
											))}
									</div>
								</div>
								<div className="divider" />
								<div className="flex flex-col rounded-btn p-2 gap-5">
									<label className="flex items-center justify-between">
										<span>Dark Mode</span>
										<input
											type="checkbox"
											className="toggle"
											checked={_globalTheme === "dark"}
											onChange={toggleTheme}
										/>
									</label>
									<label
										onClick={() => setSignOutModalVisible(true)}
										className="btn btn-error w-full"
									>
										Sign out session
									</label>
								</div>
							</div>
						</section>
					</motion.main>

					{signOutModalVisible && (
						<>
							<Modal
								isVisible={signOutModalVisible}
								setIsVisible={setSignOutModalVisible}
							>
								<p>Do you really want to end your session and log out?</p>
								<div className="flex justify-end gap-2">
									<button onClick={handleLogout} className="btn btn-ghost">
										Yes
									</button>
									<button
										className="btn btn-primary"
										onClick={() => setSignOutModalVisible(false)}
									>
										No
									</button>
								</div>
							</Modal>
						</>
					)}
					{/* sign out modal */}
					{/* <input type="checkbox" id="signoutmodal" className="modal-toggle" />
					<div className="modal">
						<div className="modal-box">
							<h3 className="font-bold text-lg">
								Are you sure you want to sign out?
							</h3>
							<p className="py-4">
								You will be signed out of all your devices. You can sign back in
								anytime.
							</p>
							<div className="modal-action">
								<label htmlFor="signoutmodal" className="btn">
									Cancel
								</label>
								<button
									className="btn btn-error"
									onClick={handleLogout}
									disabled={isLoggingOut}
								>
									Sign out
								</button>
							</div>
						</div>
					</div> */}
				</>
			)}
		</>
	);
};

export default ProfilePage;
