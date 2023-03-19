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

import { AnimPageTransition } from "@/lib/animations";
import Image from "next/image";
import Link from "next/link";
import { NextPage } from "next";
import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQueries } from "@tanstack/react-query";
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
		name: "About",
		value: "about",
		icon: MdInfo,
	},
	{
		name: "Posts",
		value: "posts",
		icon: MdNote,
	},
	{
		name: "Connections",
		value: "connections",
	},
	{
		name: "Followed Companies",
		value: "followedCompanies",
	},
	{
		name: "Experiences",
		value: "experiences",
		icon: MdWork,
	},
	{
		name: "Education",
		value: "education",
		icon: MdSchool,
	},
	{
		name: "Trainings",
		value: "trainings",
		icon: MdTrain,
	},
	{
		name: "Saved Jobs",
		value: "savedjobs",
		icon: MdCheckCircleOutline,
	},
];

const ProfilePage: NextPage = () => {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const _currentUser = useStore($accountDetails) as IUserHunter;
	const router = useRouter();
	const [tabSelected, setTabSelected] = useState<TTabs>("about");
	const [tabContentRef] = useAutoAnimate();

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

		toast.dismiss();
		router.push("/login");
	};

	const fetchUserActivities = async () => {
		const { data, error } = await supabase
			.from("public_posts")
			.select("*")
			.eq("uploaderID", _currentUser.id);

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
		const localConnection = [_currentUser.connections, _currentUser.id];
		const convertedMapToString = localConnection.map((item) => {
			return item.toString();
		});
		const joined = convertedMapToString.join(",");

		const { data, error } = await supabase
			.from("new_recommended_hunters")
			.select("id,full_name,username,email,avatar_url")
			.not("id", "in", `(${joined})`)
			.limit(5);

		if (error || localConnection.length === 0) {
			return [];
		}

		return data;
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

										{_currentUser.subscription_type === "junior" && (
											<div className="badge badge-primary absolute bottom-1 sm:-right-5">
												Junior Hunter
											</div>
										)}
										{_currentUser.subscription_type === "senior" && (
											<div className="badge badge-primary absolute bottom-1 -right-5">
												Senior Hunter
											</div>
										)}
										{_currentUser.subscription_type === "expert" && (
											<div className="badge badge-primary absolute bottom-1 -right-5">
												Expert Hunter
											</div>
										)}
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
												{tab.name}
											</option>
										))}
									</select>
								</div>
								{/* desktop tabs */}
								<div className="hidden lg:block my-3">
									<ul className="tabs tabs-boxed justify-evenly">
										{PageTabs.map((tab, index) => (
											<li
												key={`tab-${index}`}
												onClick={() => setTabSelected(tab.value as TTabs)}
												className={`tab flex items-center gap-2 transition ${
													tabSelected === tab.value && "tab-active"
												}`}
											>
												{tab.name}
											</li>
										))}
									</ul>
								</div>

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
													<p className="text-center">No activities yet</p>
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
												<p className="text-center">No connections yet</p>
											)}
											{userConnections.data!.map((connection, index) => (
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
												<p className="text-center col-span-full">
													You are not following any companies yet
												</p>
											)}

											{savedCompanies.isSuccess &&
												savedCompanies.data.map((company, i) => (
													<Link
														href={`/h/drift/${company.id}`}
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
												<p className="text-center">No employment history yet</p>
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
												<p className="text-center col-span-full">
													No education history yet
												</p>
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
												<p className="text-center">
													No Seminars/Training history yet
												</p>
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
												<p className="text-center">No saved jobs yet</p>
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
										htmlFor="signoutmodal"
										className="btn btn-error w-full"
									>
										Sign out session
									</label>
								</div>
							</div>
						</section>
					</motion.main>

					{/* sign out modal */}
					<input type="checkbox" id="signoutmodal" className="modal-toggle" />
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
					</div>
				</>
			)}
		</>
	);
};

export default ProfilePage;
