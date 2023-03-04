import { $accountDetails, $accountType, $themeMode } from "@/lib/globalStates";
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

import { AnimPageTransition } from "@/lib/animations";
import { IUserHunter } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { MdFacebook } from "react-icons/md";
import { NextPage } from "next";
import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useQueries } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { useStore } from "@nanostores/react";

const ProfilePage: NextPage = () => {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const _currentUser = useStore($accountDetails) as IUserHunter;
	const router = useRouter();

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
			.limit(2);

		if (error || localConnection.length === 0) {
			return [];
		}

		return data;
	};

	const [userConnections, recommendedUsers, userActivities] = useQueries({
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
						<section className="grid grid-cols-1 lg:grid-cols-5 gap-5">
							<div className="col-span-3 flex flex-col gap-3">
								{/* landing profile */}
								<div className="flex items-center gap-5 flex-col sm:flex-row bg-base-200 rounded-btn p-5">
									<div className="relative">
										<Image
											src={_currentUser.avatar_url}
											alt="avatar"
											className="w-32 h-32 bg-primary mask mask-squircle object-cover object-center "
											width={128}
											height={128}
										/>

										{_currentUser.subscription_type === "junior" && (
											<div className="badge badge-primary absolute bottom-1 -right-5">
												Junior
											</div>
										)}
										{_currentUser.subscription_type === "senior" && (
											<div className="badge badge-primary absolute bottom-1 -right-5">
												Senior
											</div>
										)}
										{_currentUser.subscription_type === "expert" && (
											<div className="badge badge-primary absolute bottom-1 -right-5">
												Expert
											</div>
										)}
									</div>
									<div>
										<p className="text-3xl font-bold">
											{_currentUser.full_name.first}{" "}
											{_currentUser.full_name.last}
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

								{/* bio */}
								<div className="flex flex-col shadow-lg rounded-btn p-5 gap-3">
									<div className="flex justify-between items-start">
										<p className="text-2xl font-bold">Bio</p>
									</div>

									<ReactMarkdown className="prose">
										{_currentUser.bio || "This user has not added a bio yet"}
									</ReactMarkdown>
								</div>
								{/* skills */}
								<div className="flex flex-col shadow-lg rounded-btn p-5 gap-3">
									<p className="text-2xl font-bold">Skillsets</p>
									<div className="flex flex-col">
										<h4 className="text-lg font-semibold">Primary Skill</h4>
										<p className="badge badge-primary badge-lg">
											{_currentUser.skill_primary}
										</p>
									</div>
									<div className="flex flex-col">
										<h4 className="text-lg font-semibold">Secondary Skills</h4>
										<p className="flex flex-wrap gap-2">
											{_currentUser.skill_secondary.map((skill, index) => (
												<span
													key={`secondaryskill_${index}`}
													className="badge badge-accent badge-lg"
												>
													{skill}
												</span>
											))}
										</p>
									</div>
								</div>
								{/* residence */}
								<div className="flex flex-col shadow-lg rounded-btn p-5 gap-3">
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
								<div className="flex flex-col shadow-lg rounded-btn p-5 gap-3">
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
								{/* activity */}
								<div className="flex flex-col shadow-lg rounded-btn p-5 gap-3">
									<p className="text-2xl font-bold">Recent Activities</p>
									<div className="flex flex-col gap-2">
										{userActivities.isSuccess &&
											userActivities.data.map((activity, index) => (
												<div
													key={`activity_${index}`}
													className="flex gap-2 items-center justify-between p-3 bg-base-200 rounded-btn"
												>
													<div>
														<ReactMarkdown>
															{activity.content.substring(0, 50)}
														</ReactMarkdown>
													</div>
													<Link
														href={`/h/feed/${activity.id}`}
														className="btn btn-primary btn-sm"
													>
														See more
													</Link>
												</div>
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
								</div>
							</div>

							{/* second column */}
							<div className="col-span-2 flex flex-col gap-5">
								<div className="flex flex-col rounded-btn p-2 gap-3">
									<p className="text-2xl font-bold">Your Connections</p>

									{userConnections.isLoading && (
										<div className="flex flex-col gap-2">
											{Array(5)
												.fill("")
												.map((_, index) => (
													<div
														style={{ animationDelay: `${index * 100}ms` }}
														key={`connectionloading_${index}`}
														className="h-[50px] w-full bg-zinc-500 rounded-btn animate-pulse duration-200"
													/>
												))}
										</div>
									)}

									{userConnections.isSuccess && (
										<div className="flex flex-col gap-2">
											{userConnections.data.length < 1 && (
												<p>
													Looks like you have not connected to other people
													right now. Add people to your connections to see their
													posts and activities.
												</p>
											)}
										</div>
									)}

									{userConnections.isSuccess &&
										userConnections.data.length > 0 &&
										userConnections.data
											.slice(0, 3)
											.map((connection, index) => (
												<Link
													href={`/h/${connection.username}`}
													key={`connection_${index}`}
													className="flex gap-2 items-center justify-between p-3 bg-base-200 hover:bg-base-300 transition-all rounded-btn"
												>
													<div className="flex gap-2 items-center">
														<Image
															src={connection.avatar_url}
															alt="avatar"
															className="w-12 h-12 mask mask-squircle bg-primary "
															width={50}
															height={50}
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

									{userConnections.isSuccess &&
										userConnections.data.length > 0 && (
											<Link
												href="/h/connections"
												className="btn btn-ghost btn-block btn-sm"
											>
												See all Connections
											</Link>
										)}
								</div>
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

									<div className="flex flex-col gap-2">
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
													<div className="flex gap-5 items-center justify-between p-3 bg-base-200 rounded-btn hover:bg-base-300">
														<div className="flex gap-5 items-center">
															<img
																src={thisUser.avatar_url}
																alt="avatar"
																className="w-12 h-12 mask mask-squircle bg-primary "
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
