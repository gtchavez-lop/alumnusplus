import {
	FiFacebook,
	FiGithub,
	FiInstagram,
	FiLinkedin,
	FiTwitter,
} from "react-icons/fi";
import { GetServerSideProps, NextPage } from "next";
import { MdCheckCircleOutline, MdHelp } from "react-icons/md";
import { useEffect, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { IUserHunter } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Tabs from "@/components/Tabs";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useStore } from "@nanostores/react";

type TTab = {
	title: string;
	value: string;
};

const PageTabs: TTab[] = [
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
];

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { user } = context.query;

	return {
		props: {
			targetQuery: user as string,
		},
	};
};

const DynamicUserPage: NextPage<{ targetQuery: string }> = ({
	targetQuery,
}) => {
	const _currentUser = useStore($accountDetails) as IUserHunter;
	const [isConnected, setIsConnected] = useState(false);
	const [tabSelected, setTabSelected] = useState<TTab["value"]>("about");
	const [tabContentRef] = useAutoAnimate();

	const fetchTargetUserData = async () => {
		const { data, error } = await supabase
			.from("user_hunters")
			.select("*")
			.eq("username", targetQuery)
			.single();

		if (error) {
			console.log(error);
			return null;
		}

		return data as IUserHunter;
	};

	const targetUser = useQuery({
		queryKey: ["targetUser", targetQuery],
		queryFn: fetchTargetUserData,
		enabled: !!targetQuery,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});

	const fetchUserConnections = async () => {
		const { data, error } = await supabase
			.from("user_hunters")
			.select("id,username,full_name,avatar_url,is_verified")
			.in("id", targetUser.data!.connections);

		if (error) {
			console.log(error);
			return [];
		}

		const alphaSorted = data.sort((a, b) => {
			if (a.full_name!.first < b.full_name!.first) {
				return -1;
			}
			if (a.full_name!.first > b.full_name!.first) {
				return 1;
			}
			return 0;
		});

		return alphaSorted;
	};

	const fetchUserActivities = async () => {
		const { data, error } = await supabase
			.from("public_posts")
			.select("*")
			.eq("uploader", targetUser.data!.id);

		if (error) {
			console.log(error);
			return [];
		}

		return data;
	};

	const [targetUserConnections, targetUserActivities] = useQueries({
		queries: [
			{
				queryKey: ["targetUserConnections", targetQuery],
				queryFn: fetchUserConnections,
				enabled: targetUser.isSuccess,
				refetchOnMount: true,
				refetchOnWindowFocus: true,
			},
			{
				queryKey: ["targetUserActivities", targetQuery],
				queryFn: fetchUserActivities,
				enabled: targetUser.isSuccess,
				refetchOnMount: true,
				refetchOnWindowFocus: true,
			},
		],
	});

	const addToConnections = async () => {
		toast.loading("Adding connection...");

		const newConnections = [..._currentUser.connections, targetUser.data!.id];

		// update the user table
		const { error } = await supabase
			.from("user_hunters")
			.update({
				connections: newConnections,
			})
			.eq("id", _currentUser.id)
			.select("*");

		if (error) {
			toast.dismiss();
			toast.error("Something went wrong");
			console.log(error);
			return;
		}

		// update local user global state
		$accountDetails.set({
			..._currentUser,
			connections: newConnections,
		});

		// update the supabase user
		await supabase.auth.updateUser({
			data: {
				connections: newConnections,
			},
		});

		// update the state
		setIsConnected(true);

		toast.dismiss();
		toast.success("Connection added");
	};

	const removeFromConnections = async () => {
		toast.loading("Removing connection...");

		const newConnections = _currentUser.connections.filter(
			(id) => id !== targetUser.data!.id,
		);

		// update the user table
		const { error } = await supabase
			.from("user_hunters")
			.update({
				connections: newConnections,
			})
			.eq("id", _currentUser.id)
			.select("*");

		if (error) {
			toast.dismiss();
			toast.error("Something went wrong");
			console.log(error);
			return;
		}

		// update local user global state
		$accountDetails.set({
			..._currentUser,
			connections: newConnections,
		});

		// update the supabase user
		await supabase.auth.updateUser({
			data: {
				connections: newConnections,
			},
		});

		// update the state
		setIsConnected(false);

		toast.dismiss();
		toast.success("Connection removed");
	};

	useEffect(() => {
		if (_currentUser && targetUser.isSuccess) {
			if (_currentUser.connections.includes(targetUser.data!.id)) {
				setIsConnected(true);
			}
		}
	});

	return (
		// <p>asdjklasdkljasd</p>
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				{targetUser.isSuccess && _currentUser && (
					<section className="flex flex-col gap-5">
						<div className="col-span-3 flex flex-col gap-3">
							{/* landing profile */}
							<div className="flex sm:items-center gap-5 flex-col sm:flex-row bg-base-200 rounded-btn p-5">
								<div className="relative">
									<Image
										src={targetUser.data!.avatar_url}
										alt="avatar"
										className="w-32 h-32 bg-primary mask mask-squircle object-cover object-center "
										width={128}
										height={128}
									/>

									{targetUser.data!.subscription_type === "junior" && (
										<div className="badge badge-primary absolute bottom-1 sm:-right-5">
											Junior Hunter
										</div>
									)}
									{targetUser.data!.subscription_type === "senior" && (
										<div className="badge badge-primary absolute bottom-1 -right-5">
											Senior Hunter
										</div>
									)}
									{targetUser.data!.subscription_type === "expert" && (
										<div className="badge badge-primary absolute bottom-1 -right-5">
											Expert Hunter
										</div>
									)}
								</div>
								<div>
									<p className="text-3xl font-bold flex gap-1 items-center">
										{targetUser.data!.full_name.first}{" "}
										{targetUser.data!.full_name.last}
										{targetUser.data!.is_verified && (
											<MdCheckCircleOutline className="text-blue-500 text-lg" />
										)}
									</p>

									<p className="font-semibold opacity-75">
										@{targetUser.data!.username}
									</p>
									<p>
										Joined at:{" "}
										<span className="opacity-50">
											{dayjs(targetUser.data!.created_at).format(
												"MMMM DD, YYYY",
											)}
										</span>
									</p>
								</div>
							</div>
							<div className="flex justify-end my-3">
								{isConnected ? (
									<button
										disabled={targetUserConnections.isLoading}
										onClick={removeFromConnections}
										className="btn btn-warning"
									>
										Remove from connections
									</button>
								) : (
									<button
										disabled={targetUserConnections.isLoading}
										onClick={addToConnections}
										className="btn btn-primary"
									>
										Add to connections
									</button>
								)}
							</div>

							{/* mobile select */}
							<div className="lg:hidden">
								<select
									value={tabSelected}
									onChange={(e) =>
										setTabSelected(e.currentTarget.value as TTab["value"])
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
								activeTab={tabSelected}
								onTabChange={(tab) => setTabSelected(tab as TTab["value"])}
								tabs={PageTabs}
							/>
							{/* <div className="hidden lg:block mb-5">
								<ul className="tabs tabs-boxed justify-evenly">
									{PageTabs.map((tab, index) => (
										<li
											key={`tab-${index}`}
											onClick={() =>
												setTabSelected(
													tab.value as
														| "about"
														| "posts"
														| "experiences"
														| "education"
														| "savedjobs",
												)
											}
											className={`tab flex items-center gap-2 transition ${
												tabSelected === tab.value && "tab-active"
											}`}
										>
											{tab.name}
										</li>
									))}
								</ul>
							</div> */}

							{/* tab contents */}
							<div className="py-5" ref={tabContentRef}>
								{tabSelected === "about" && (
									<div className="flex flex-col gap-2">
										{/* bio */}
										<div className="flex flex-col shadow-md rounded-btn p-5 gap-3">
											<div className="flex justify-between items-start">
												<p className="text-2xl font-bold">Bio</p>
											</div>

											<ReactMarkdown className="prose">
												{targetUser.data!.bio ||
													"This user has not added a bio yet"}
											</ReactMarkdown>
										</div>
										{/* skills */}
										<div className="flex flex-col shadow-md rounded-btn p-5 gap-3">
											<p className="text-2xl font-bold">Skillsets</p>
											<div className="flex flex-col">
												<h4 className="text-lg font-semibold">Primary Skill</h4>
												<p className="badge badge-primary badge-lg">
													{targetUser.data!.skill_primary}
												</p>
											</div>
											<div className="flex flex-col">
												<h4 className="text-lg font-semibold">
													Secondary Skills
												</h4>
												<p className="flex flex-wrap gap-2">
													{targetUser.data!.skill_secondary.map(
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
													{targetUser.data!.address.address},{" "}
													{targetUser.data!.address.city} -{" "}
													{targetUser.data!.address.postalCode}
												</p>
											</div>
										</div>
										{/* socials */}
										<div className="flex flex-col shadow-md rounded-btn p-5 gap-3">
											<p className="text-2xl font-bold">Social Media Links</p>
											<div className="flex flex-wrap gap-2">
												{targetUser.data!.social_media_links.facebook && (
													<Link
														href={targetUser.data!.social_media_links.facebook}
														target="_blank"
														rel="noopener noreferrer"
														className="btn btn-primary"
													>
														<FiFacebook className="text-xl" />
													</Link>
												)}
												{targetUser.data!.social_media_links.twitter && (
													<Link
														href={targetUser.data!.social_media_links.twitter}
														target="_blank"
														rel="noopener noreferrer"
														className="btn btn-primary"
													>
														<FiTwitter className="text-xl" />
													</Link>
												)}
												{targetUser.data!.social_media_links.instagram && (
													<Link
														href={targetUser.data!.social_media_links.instagram}
														target="_blank"
														rel="noopener noreferrer"
														className="btn btn-primary"
													>
														<FiInstagram className="text-xl" />
													</Link>
												)}
												{targetUser.data!.social_media_links.linkedin && (
													<Link
														href={targetUser.data!.social_media_links.linkedin}
														target="_blank"
														rel="noopener noreferrer"
														className="btn btn-primary"
													>
														<FiLinkedin className="text-xl" />
													</Link>
												)}
												{targetUser.data!.social_media_links.github && (
													<Link
														href={targetUser.data!.social_media_links.github}
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
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
										{targetUserActivities.isSuccess &&
											targetUserActivities.data.map((activity, index) => (
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

										{targetUserActivities.isSuccess &&
											targetUserActivities.data.length === 0 && (
												<div className="flex flex-col items-center col-span-full">
													<MdHelp className="text-5xl text-primary" />
													<p>No activities yet</p>
												</div>
											)}

										{targetUserActivities.isLoading &&
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
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
										{targetUserConnections.isSuccess &&
											targetUserConnections.data.map((connection, index) => (
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

										{targetUserConnections.isSuccess &&
											targetUserConnections.data.length === 0 && (
												<div className="flex flex-col items-center col-span-full">
													<MdHelp className="text-5xl text-primary" />
													<p>No connections yet</p>
												</div>
											)}

										{targetUserConnections.isLoading &&
											Array(5)
												.fill("")
												.map((_, index) => (
													<div
														key={`activityloading_${index}`}
														className="h-[72px] w-full bg-gray-500/25 rounded-btn animate-pulse"
													/>
												))}
									</div>
								)}
								{tabSelected === "experiences" && (
									<div className="flex flex-col gap-2">
										{targetUser.data!.experience.length === 0 && (
											<div className="flex flex-col items-center col-span-full">
												<MdHelp className="text-5xl text-primary" />
												<p>No employment history yet</p>
											</div>
										)}
										{targetUser.data!.experience.map((exp, i) => (
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
									<div className="flex flex-col gap-2">
										{targetUser.data!.education.length === 0 && (
											<div className="flex flex-col items-center col-span-full">
												<MdHelp className="text-5xl text-primary" />
												<p>No education history yet</p>
											</div>
										)}
										{targetUser.data!.education.map((edu, i) => (
											<div
												key={`education_${i}`}
												className="shadow-md rounded-btn p-5"
											>
												<p className="text-lg">
													<span className="capitalize">{edu.degreeType}</span> -{" "}
													{edu.institution}
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
									<div className="flex flex-col gap-2">
										{targetUser.data!.trainings.length === 0 && (
											<div className="flex flex-col items-center col-span-full">
												<MdHelp className="text-5xl text-primary" />
												<p>No Seminars/Training history yet</p>
											</div>
										)}
										{targetUser.data!.trainings.map((training, i) => (
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
							</div>
						</div>

						{/* second column */}
						{/* <div className="col-span-2 flex flex-col gap-5">
							<div className="flex flex-col rounded-btn p-2 gap-3">
								<p className="text-2xl font-bold">Connections</p>

								{targetUserConnections.isLoading && (
									<div className="flex flex-col gap-2">
										{Array(5)
											.fill("")
											.map((_, index) => (
												<div
													style={{
														animationDelay: `${index * 50}ms`,
														animationDuration: "1s",
													}}
													key={`connectionloading_${index}`}
													className="h-[50px] w-full bg-zinc-500/50 rounded-btn animate-pulse "
												/>
											))}
									</div>
								)}

								{targetUserConnections.isSuccess && (
									<div className="flex flex-col gap-2">
										{targetUserConnections.data.length < 1 && (
											<p>
												Looks like you have not connected to other people right
												now. Add people to your connections to see their posts
												and activities.
											</p>
										)}
									</div>
								)}

								{targetUserConnections.isSuccess &&
									targetUserConnections.data.length > 0 &&
									targetUserConnections.data.slice(0, 3).map((connection, index) => (
										<Link
											href={
												connection.username === _currentUser.username
													? "/h/me"
													: `/h?user=${connection.username}`
											}
											key={`connection_${index}`}
											className="flex gap-2 items-center justify-between p-3 bg-base-200 hover:bg-base-300 transition-all rounded-btn"
										>
											<div className="flex gap-2 items-center">
												<Image
													src={connection.avatar_url}
													alt="avatar"
													className="w-12 h-12 mask mask-squircle bg-primary object-center object-cover"
													width={48}
													height={48}
												/>
												<div>
													<p className="font-bold leading-none flex items-center">
														{connection.full_name.first}{" "}
														{connection.full_name.last}

														{connection.is_verified && (
															<MdCheckCircle className="text-primary ml-1" />
														)}
													</p>
													<p className="opacity-50 leading-none">
														@{connection.username}
													</p>
												</div>
											</div>
										</Link>
									))}
							</div>

							<div className="p-5">
								<p className="text-2xl font-bold">Actions</p>

								<div className="flex gap-2 mt-4">

								</div>
							</div>
						</div> */}
					</section>
				)}
			</motion.main>
		</>
	);
};

export default DynamicUserPage;
