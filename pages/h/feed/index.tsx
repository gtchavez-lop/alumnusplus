import { AnimLoading, AnimPageTransition } from "@/lib/animations";
import { FormEvent, useState } from "react";
import { IUserHunter, THunterBlogPost } from "@/lib/types";

import { $accountDetails } from "@/lib/globalStates";
import FeedCard from "@/components/feed/FeedCard";
import { FiLoader } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { MdSearch } from "react-icons/md";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQueries } from "@tanstack/react-query";
import { useRive } from "@rive-app/react-canvas";
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
				"id,content,comments,createdAt,updatedAt,uploader(id,email,full_name,username,avatar_url,is_verified),upvoters",
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
			.limit(5);

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
		e.preventDefault();
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
			{_currentUser && (
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
							<div ref={mainFeed_ui} className="flex gap-2 w-full relative">
								{!isMakingPost ? (
									<>
										<div className=" relative w-12 h-12">
											<Image
												src={_currentUser.avatar_url}
												alt="avatar"
												className="bg-primary mask mask-squircle"
												fill
											/>
										</div>

										<input
											placeholder="What's on your mind?"
											readOnly
											onClick={() => setIsMakingPost(true)}
											className="input input-primary rounded-full w-full"
										/>
									</>
								) : (
									<form onSubmit={handlePost} className="w-full">
										<textarea
											placeholder="What's on your mind?"
											rows={10}
											name="content"
											className="textarea textarea-primary w-full"
										/>
										<p className="text-xs opacity-75">Markdown</p>
										<div className="flex justify-end gap-2">
											<button
												type="reset"
												onClick={() => setIsMakingPost(false)}
												className="btn btn-ghost"
											>
												Cancel
											</button>
											<button type="submit" className="btn btn-primary">
												Post
											</button>
										</div>
									</form>
								)}
							</div>

							{/* feed list */}
							<div className="mt-10">
								<div className="flex flex-col gap-5" ref={feedList_ui}>
									{feedList.isLoading && (
										<div className="py-10 flex flex-col">
											<FiLoader className="animate-spin duration-500 text-3xl self-center" />
											<p className="text-center w-full self-center max-w-xs">
												Loading feed... This may take a while.
											</p>
										</div>
									)}

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
								className="flex flex-col lg:flex-row lg:items-center gap-3"
							>
								<input
									type="text"
									name="searchQuery"
									placeholder="Search for people"
									className="input input-bordered flex-1"
								/>
								<button type="submit" className="btn btn-primary">
									<MdSearch className="text-lg" />
								</button>
							</form>

							<div className="flex flex-col rounded-btn gap-3">
								<p className="text-2xl font-bold">Suggested Connections</p>

								{recommendedUsers.isLoading && (
									<div className="flex flex-col gap-2">
										{Array(5)
											.fill("")
											.map((_, index) => (
												<motion.div
													variants={AnimLoading}
													animate="animate"
													key={`recommendedloading_${index}`}
													className="h-[72px] w-full bg-slate-500/50 rounded-btn animate-pulse"
												/>
											))}
									</div>
								)}

								<div className="flex flex-col gap-2">
									{recommendedUsers.isSuccess &&
									recommendedUsers.data.length < 1 ? (
										<p>
											We can&apos;t find any recommended connections for you at
											this moment.
										</p>
									) : (
										<div className="flex flex-col gap-2">
											{recommendedUsers.isSuccess &&
												recommendedUsers.data.map((thisUser, index) => (
													<Link
														href={`/h?user=${thisUser.username}`}
														key={`connection_${index}`}
														className="flex gap-2 items-center justify-between p-2 hover:bg-base-200 rounded-btn"
													>
														<div className="flex gap-2 items-center">
															<Image
																src={thisUser.avatar_url}
																alt="avatar"
																className="w-12 h-12 mask mask-squircle bg-primary object-center object-cover"
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
									<Link href={"/util/about-us"} className="link link-hover">
										About Us
									</Link>
									<Link href={"/util/contact"} className="link link-hover">
										Contact Us
									</Link>
									<Link href={"/util/terms-of-use"} className="link link-hover">
										Terms of use
									</Link>
									<Link
										href={"/util/privacy-policy"}
										className="link link-hover"
									>
										Privacy Policy
									</Link>
									<Link href={"/util/cookies"} className="link link-hover">
										Coockie Policy
									</Link>
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
