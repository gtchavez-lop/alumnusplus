import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useRef, useState } from "react";
import { IUserHunter, THunterBlogPost } from "@/lib/types";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import FeedCard from "@/components/feed/FeedCard";
import { FiX } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQueries } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";
import { uuid } from "uuidv4";

// const FeedCard = dynamic(() => import("@/components/feed/FeedCard"), {
// 	ssr: false,
// });

const FeedPage = () => {
	const [isMakingPost, setIsMakingPost] = useState(false);
	const _currentUser = useStore($accountDetails) as IUserHunter;
	const [feedList_ui] = useAutoAnimate<HTMLDivElement>();
	const [mainFeed_ui] = useAutoAnimate<HTMLDivElement>();
	const router = useRouter();

	const fetchFeed = async () => {
		const connections: string[] = _currentUser.connections.concat(
			_currentUser.id,
		);

		const { data, error } = await supabase
			.from("public_posts")
			.select(
				"id,content,comments,createdAt,updatedAt,uploader(id,email,full_name,username,avatar_url),upvoters",
			)
			.order("createdAt", { ascending: false })
			.in("uploader", connections);

		if (error) {
			console.log("error", error);
			return [];
		}

		return data as THunterBlogPost[];
	};

	const fetchRecommendedUsers = async () => {
		const localConnection = [_currentUser.connections, _currentUser.id];
		const convertedMapToString = localConnection.map((item) => {
			return item.toString();
		});
		const joined = convertedMapToString.join(",");

		const { data, error } = await supabase
			.from("new_recommended_hunters")
			.select("*")
			.not("id", "in", `(${joined})`)
			.limit(2);

		if (error || localConnection.length === 0) {
			return [];
		}

		return data;
	};

	const [feedList, recommendedUsers] = useQueries({
		queries: [
			{
				queryKey: ["mainFeedList"],
				queryFn: fetchFeed,
				enabled: !!_currentUser,
				refetchOnWindowFocus: false,
				onSuccess: () => {
					console.log("feedList success");
				},
				onError: () => {
					console.log("feedList error");
					toast.error("Something went wrong fetching your feed");
				},
			},
			{
				queryKey: ["recommendedUsers"],
				queryFn: fetchRecommendedUsers,
				enabled: !!_currentUser,
				onSuccess: () => {
					console.log("recommendedUsers success");
				},
				onError: () => {
					console.log("recommendedUsers error");
					toast.error("Something went wrong fetching recommended users");
				},
				refetchOnWindowFocus: false,
			},
		],
	});

	const handlePost = async (e: FormEvent<HTMLFormElement>) => {
		const formData = new FormData(e.currentTarget);
		const content = formData.get("content");

		if (!content) {
			toast.error("Content is required");
			return;
		}

		toast.loading("Posting...");

		const { error } = await supabase.from("public_posts").insert({
			id: uuid(),
			content,
			comments: [],
			createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			type: "blogpost",
			updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			uploader: _currentUser.id,
			uploaderID: _currentUser.id,
			upvoters: [],
		});

		toast.dismiss();
		if (error) {
			toast.error("Something went wrong");
			return;
		}

		toast.success("Posted!");

		feedList.refetch();
		setIsMakingPost(false);
	};

	return (
		<>
			{_currentUser && feedList.isSuccess && recommendedUsers.isSuccess && (
				<>
					<motion.main
						variants={AnimPageTransition}
						initial="initial"
						animate="animate"
						exit="exit"
						className="relative w-full grid grid-cols-1 lg:grid-cols-5 gap-4 pt-24 pb-36"
					>
						{/* feed */}
						<div
							className="col-span-full lg:col-span-3 w-full"
							ref={mainFeed_ui}
						>
							{/* create post */}
							<div className="flex gap-2 w-full items-center">
								<Image
									src={_currentUser.avatar_url}
									alt="avatar"
									className="hidden md:block bg-primary mask mask-squircle"
									width={48}
									height={48}
								/>
								<div
									onClick={() => setIsMakingPost(true)}
									className="btn btn-primary btn-block max-w-md"
								>
									Create Post
								</div>
							</div>

							{/* create post dropdown */}
							{isMakingPost && (
								<div className="w-full">
									<form
										onSubmit={(e) => {
											e.preventDefault();
											handlePost(e);
										}}
										className="flex flex-col mt-5 gap-5"
									>
										<div className="form-control w-full ">
											<p className="label">
												<span className="label-text">Blog Content</span>
												<span className="label-text">Markdown</span>
											</p>
											<textarea
												name="content"
												placeholder="Type here"
												className="textarea textarea-bordered w-full h-screen max-h-[200px] font-mono"
											/>
										</div>

										<div className="lg:flex lg:justify-end max-lg:grid max-lg:grid-cols-2 gap-2">
											<button
												type="button"
												onClick={(e) => setIsMakingPost(false)}
												className="btn btn-error max-lg:btn-block"
											>
												Cancel
											</button>
											<button
												type="submit"
												className="btn btn-primary max-lg:btn-block"
											>
												Create
											</button>
										</div>
									</form>
								</div>
							)}

							{/* feed list */}
							<div className="mt-10">
								<div className="flex flex-col gap-5" ref={feedList_ui}>
									{feedList.isLoading &&
										Array(10)
											.fill(0)
											.map((_, i) => (
												<div
													key={`feedloading-${i}`}
													style={{
														animationDelay: `${i * 100}ms`,
													}}
													className="h-[200px] bg-zinc-500/50 animate-pulse duration-200"
												/>
											))}

									{feedList.isSuccess &&
										feedList.data.map((item: THunterBlogPost) => (
											<FeedCard
												blogData={item}
												key={item.id}
												refetchData={feedList.refetch}
											/>
										))}
								</div>
							</div>
						</div>

						{/* friend suggest and footer */}
						<div className="col-span-full lg:col-span-2 flex flex-col gap-5">
							{/* search for people */}
							<form
								onSubmit={(e) => {
									e.preventDefault();
									const formData = new FormData(e.currentTarget);

									const searchQuery = formData.get("searchQuery");

									if (!searchQuery) {
										toast.error("Search query is required");
										return;
									}

									router.push(`/h/search?query=${searchQuery}`);
								}}
								className="flex flex-col gap-3"
							>
								<input
									type="text"
									name="searchQuery"
									placeholder="Search for people"
									className="input input-bordered"
								/>
							</form>

							<div className="flex flex-col rounded-btn gap-3">
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
									recommendedUsers.data.length < 1 ? (
										<p>
											Looks like you have not connected to other people right
											now. Add people to your connections to see their posts and
											activities.
										</p>
									) : (
										<div className="flex flex-col gap-2">
											{recommendedUsers.isSuccess &&
												recommendedUsers.data.map((thisUser, index) => (
													<Link
														href={`/h/${thisUser.username}`}
														key={`connection_${index}`}
														className="flex gap-2 items-center justify-between p-2 hover:bg-base-200 rounded-btn"
													>
														<div className="flex gap-2 items-center">
															<Image
																src={thisUser.avatar_url}
																alt="avatar"
																className="w-12 h-12 mask mask-squircle bg-primary "
																width={48}
																height={48}
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
													</Link>
												))}
										</div>
									)}
								</div>
							</div>

							<div className="grid grid-cols-2 font-light text-sm opacity-75">
								<div className="flex flex-col">
									<p className="font-bold text-lg">Features</p>
									<Link
										href="/util/features#blogging"
										className="link link-hover"
									>
										Mini Blogging
									</Link>
									<Link
										href="/util/features#companyhunting"
										className="link link-hover"
									>
										Geo-Company Hunting
									</Link>
									<Link
										href="/util/features#jobposting"
										className="link link-hover"
									>
										Job Posting
									</Link>
									<Link
										href="/util/features#metaverse"
										className="link link-hover"
									>
										Metaverse
									</Link>
								</div>
								<div className="flex flex-col">
									<p className="font-bold text-lg">Wicket Journeys</p>
									<Link href={"/util/about"} className="link link-hover">
										About Us
									</Link>
									<Link href={"/util/about"} className="link link-hover">
										Contact Us
									</Link>
									<p className="link link-hover opacity-50">Terms of use</p>
									<p className="link link-hover opacity-50">Privacy policy</p>
									<p className="link link-hover opacity-50">Cookie policy</p>
								</div>
							</div>
						</div>
					</motion.main>
				</>
			)}
		</>
	);
};

export default FeedPage;
