import { AnimatePresence, motion } from "framer-motion";
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { IUserHunter } from "@/lib/types";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useQueries } from "@tanstack/react-query";
import { useStore } from "@nanostores/react";

export const config = { runtime: "nodejs" };

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { query } = context;

	const { data, error } = await supabase
		.from("user_hunters")
		.select("*")
		.eq("username", query.username)
		.single();

	if (error) {
		return {
			props: {
				targetUser: null,
			},
		};
	}

	return {
		props: {
			targetUser: data as IUserHunter,
		},
	};
};

const DynamicUserPage: NextPage<{ targetUser: IUserHunter }> = ({
	targetUser,
}) => {
	const _currentUser = useStore($accountDetails) as IUserHunter;
	const [isConnected, setIsConnected] = useState(false);

	const fetchUserConnections = async () => {
		const { data, error } = await supabase
			.from("user_hunters")
			.select("id,username,full_name")
			.in("id", targetUser.connections);

		if (error) {
			console.log(error);
			return [];
		}

		return data;
	};

	const fetchUserActivities = async () => {
		const { data, error } = await supabase
			.from("public_posts")
			.select("*")
			.eq("uploader", targetUser.id);

		if (error) {
			console.log(error);
			return [];
		}

		return data;
	};

	const [userConnections, userActivities] = useQueries({
		queries: [
			{
				queryKey: ["userConnections"],
				queryFn: fetchUserConnections,
				enabled: !!targetUser,
				refetchOnWindowFocus: false,
			},
			{
				queryKey: ["userActivities"],
				queryFn: fetchUserActivities,
				enabled: !!targetUser,
				refetchOnWindowFocus: false,
			},
		],
	});

	const addToConnections = async () => {
		toast.loading("Adding connection...");

		const newConnections = [..._currentUser.connections, targetUser.id];

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
			(id) => id !== targetUser.id,
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
		if (!!_currentUser && _currentUser.connections.includes(targetUser.id)) {
			setIsConnected(true);
		}
	}, [_currentUser]);

	return (
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
						<div className="flex items-center gap-2 flex-col sm:flex-row bg-base-200 rounded-btn p-5">
							<img
								src={`https://avatars.dicebear.com/api/bottts/${targetUser.username}.svg`}
								alt="avatar"
								className="w-32 h-32 bg-primary p-2 mask mask-squircle"
							/>
							<div>
								<p className="text-3xl font-bold">
									{targetUser.full_name.first} {targetUser.full_name.last}
								</p>

								<p className="font-semibold opacity-75">
									@{targetUser.username}
								</p>
								<p>
									Joined at:{" "}
									<span className="opacity-50">
										{dayjs(targetUser.created_at).format("MMMM DD, YYYY")}
									</span>
								</p>
							</div>
						</div>
						{/* bio */}
						<div className="flex flex-col border-2 border-base-content border-opacity-30 rounded-btn p-5 gap-3">
							<div className="flex justify-between items-start">
								<p className="text-2xl font-bold">Bio</p>
							</div>

							<ReactMarkdown className="prose">
								{targetUser.bio ?? "This user has not added a bio yet"}
							</ReactMarkdown>
						</div>
						{/* skills */}
						<div className="flex flex-col border-2 border-base-content border-opacity-30 rounded-btn p-5 gap-3">
							<p className="text-2xl font-bold">Skillsets</p>
							<div className="flex flex-col">
								<h4 className="text-lg font-semibold">Primary Skill</h4>
								<p className="badge badge-primary">
									{targetUser.skill_primary}
								</p>
							</div>
							<div className="flex flex-col">
								<h4 className="text-lg font-semibold">Secondary Skills</h4>
								<p className="flex flex-wrap gap-4">
									{targetUser.skill_secondary.map((skill, index) => (
										<span
											key={`secondaryskill_${index}`}
											className="badge badge-accent"
										>
											{skill}
										</span>
									))}
								</p>
							</div>
						</div>
						{/* residence */}
						<div className="flex flex-col border-2 border-base-content border-opacity-30 rounded-btn p-5 gap-3">
							<p className="text-2xl font-bold">Residence</p>
							<div className="flex flex-col ">
								<h4 className="text-lg font-semibold">Address</h4>
								<p>{targetUser.address.address}</p>
								<h4 className="text-lg font-semibold mt-3">
									City of Residence
								</h4>
								<p className="badge badge-accent">{targetUser.address.city}</p>
							</div>
						</div>
						{/* activity */}
						<div className="flex flex-col border-2 border-base-content border-opacity-30 rounded-btn p-5 gap-3">
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
							<p className="text-2xl font-bold">Connections</p>

							{userConnections.isLoading && (
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

							{userConnections.isSuccess && (
								<div className="flex flex-col gap-2">
									{userConnections.data.length < 1 && (
										<p>
											Looks like you have not connected to other people right
											now. Add people to your connections to see their posts and
											activities.
										</p>
									)}
								</div>
							)}

							{userConnections.isSuccess &&
								userConnections.data.length > 0 &&
								userConnections.data.slice(0, 3).map((connection, index) => (
									<Link
										href={`/h/${connection.username}`}
										key={`connection_${index}`}
										className="flex gap-2 items-center justify-between p-3 bg-base-200 hover:bg-base-300 transition-all rounded-btn"
									>
										<div className="flex gap-2 items-center">
											<img
												src={`https://avatars.dicebear.com/api/bottts/${connection.username}.svg`}
												alt="avatar"
												className="w-12 h-12 mask mask-squircle p-1 bg-primary "
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

						<div className="p-5">
							<p className="text-2xl font-bold">Actions</p>

							<div className="flex gap-2 mt-4">
								{isConnected ? (
									<button
										disabled={userConnections.isLoading}
										onClick={removeFromConnections}
										className="btn btn-warning"
									>
										Remove from connections
									</button>
								) : (
									<button
										disabled={userConnections.isLoading}
										onClick={addToConnections}
										className="btn btn-primary"
									>
										Add @{targetUser.username} to your connections
									</button>
								)}
							</div>
						</div>
					</div>
				</section>
			</motion.main>
		</>
	);
};

export default DynamicUserPage;
