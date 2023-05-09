import { Fragment, useEffect, useState } from "react";
import { IUserHunter, THunterBlogPost } from "@/lib/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import FeedCard from "@/components/feed/FeedCard";
import { FiLoader } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { MdSearch } from "react-icons/md";
import { NextPage } from "next";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

type RecommendedHunter = {
	id: string;
	full_name: {
		first: string;
		last: string;
		middle?: string;
	};
	username: string;
	email: string;
	avatar_url: string;
};

const HunterFeedPage: NextPage = () => {
	const [isAddingPost, setIsAddingPost] = useState(false);
	const _currentHunter = useStore($accountDetails) as IUserHunter;
	const [feedAreaAutoTransition] = useAutoAnimate({
		easing: "ease-out",
		duration: 200,
	});
	const supabase = useSupabaseClient();
	const router = useRouter();

	const fetchHunterPosts = async ({ pageParam = 0 }) => {
		const connections = [..._currentHunter.connections, _currentHunter.id];

		const { data, error } = await supabase
			.from("public_posts")
			.select("*,uploader: user_hunters(id,avatar_url,username,full_name)")
			.in("uploader", connections)
			.order("createdAt", { ascending: false })
			.range(pageParam * 5, (pageParam + 1) * 5 - 1);

		if (error) {
			console.log(error);
			return [] as THunterBlogPost[];
		}

		return data as THunterBlogPost[];
	};
	const fetchRecommendedHunters = async () => {
		const connections = [..._currentHunter.connections, _currentHunter.id];

		const { data, error } = await supabase
			.from("new_recommended_hunters")
			.select("*");

		if (error) {
			console.log(error);
			return [] as RecommendedHunter[];
		}

		// filter out already connected hunters
		const filteredData = data.filter((hunter) => {
			return !connections.includes(hunter.id);
		});

		return filteredData as RecommendedHunter[];
	};

	const hunterPosts = useInfiniteQuery({
		queryKey: ["h.feed.posts"],
		queryFn: fetchHunterPosts,
		enabled: !!_currentHunter,
		refetchOnWindowFocus: false,
		keepPreviousData: true,
		getNextPageParam: (lastPage, pages) => {
			if (lastPage.length < 5) return false;
			return pages.length;
		},
	});
	const recommendedHunters = useQuery({
		queryKey: ["h.feed.recommended"],
		queryFn: fetchRecommendedHunters,
		enabled: !!_currentHunter,
		refetchOnWindowFocus: false,
	});

	return (
		_currentHunter && (
			<>
				<motion.main
					variants={AnimPageTransition}
					initial="initial"
					animate="animate"
					exit="exit"
					className="relative w-full min-h-screen grid grid-cols-1 lg:grid-cols-5 gap-4 pt-24 pb-36"
				>
					{/* feed area */}
					<div className="col-span-full lg:col-span-3">
						{/* add feed area */}
						<div
							ref={feedAreaAutoTransition}
							className="flex gap-2 items-start"
						>
							<Image
								className="avatar mask mask-squircle hover:-translate-y-1 transition-all"
								width={50}
								height={50}
								alt="avatar"
								src={
									_currentHunter
										? _currentHunter.avatar_url
										: "https://via.placeholder.com/100"
								}
							/>
							{!isAddingPost ? (
								<div className="flex-1">
									<input
										className="input input-primary w-full"
										placeholder="What's on your mind?"
										readOnly
										onClick={() => setIsAddingPost(true)}
									/>
								</div>
							) : (
								<form className="flex-1 flex flex-col gap-4">
									<textarea className="textarea textarea-primary" rows={7} />
									<div className="flex gap-2">
										<button
											onClick={() => setIsAddingPost(false)}
											type="reset"
											className="btn btn-ghost btn-sm flex-1"
										>
											Cancel
										</button>
										<button
											type="submit"
											className="btn btn-primary btn-sm flex-1"
										>
											Post to your feed
										</button>
									</div>
								</form>
							)}
						</div>
						<div className="divider" />
						{/* show hunter posts area */}
						<div className="flex flex-col gap-5" ref={feedAreaAutoTransition}>
							{hunterPosts.isFetched &&
								hunterPosts.data?.pages.map((page, i) => (
									<Fragment key={`page_${i + 1}`}>
										{page.map((post) => (
											<FeedCard
												blogData={post}
												key={post.id}
												refetchData={hunterPosts.refetch}
											/>
										))}
									</Fragment>
								))}

							{hunterPosts.isFetching && (
								<div className="flex justify-center py-10">
									<FiLoader className="text-xl animate-spin" />
								</div>
							)}

							{hunterPosts.isError && (
								<p className="alert-error">
									Something went wrong. Please try again later.
								</p>
							)}

							{hunterPosts.hasNextPage && (
								<button
									onClick={() => hunterPosts.fetchNextPage()}
									className="btn btn-primary"
									disabled={
										hunterPosts.isFetchingNextPage || hunterPosts.isFetching
									}
								>
									{hunterPosts.isFetchingNextPage
										? "Loading more posts"
										: hunterPosts.hasNextPage
										? "Load more posts"
										: "Nothing more to load"}
								</button>
							)}
						</div>
					</div>
					{/* side area */}
					<div className="col-span-full lg:col-span-2">
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
							className="input-group"
						>
							<input
								type="text"
								name="searchQuery"
								placeholder="Search for people"
								className="input input-primary flex-1"
							/>
							<button type="submit" className="btn btn-primary">
								<MdSearch className="text-lg" />
							</button>
						</form>
						<div className="mt-7">
							<h2 className="text-xl font-semibold mb-2">
								You might know these hunters
							</h2>
							<div className="flex flex-col gap-2">
								{recommendedHunters.isFetching && (
									<div className="flex justify-center py-10">
										<FiLoader className="text-xl animate-spin" />
									</div>
								)}
								{!recommendedHunters.isFetching &&
									recommendedHunters.isFetched && (
										<>
											{recommendedHunters.data?.map((hunter, index) => (
												<Link
													href={`/h?user=${hunter.username}`}
													key={`connection_${index}`}
													className="flex gap-2 items-center justify-between p-2 hover:bg-base-200 rounded-btn"
												>
													<div className="flex gap-2 items-center">
														<Image
															src={hunter.avatar_url}
															alt="avatar"
															className="w-12 h-12 mask mask-squircle bg-primary object-center object-cover"
															width={48}
															height={48}
														/>
														<div>
															<p className="font-bold leading-none">
																{hunter.full_name.first} {hunter.full_name.last}
															</p>
															<p className="opacity-50 leading-none">
																@{hunter.username}
															</p>
														</div>
													</div>
												</Link>
											))}
										</>
									)}
							</div>
						</div>
					</div>
				</motion.main>
			</>
		)
	);
};

export default HunterFeedPage;