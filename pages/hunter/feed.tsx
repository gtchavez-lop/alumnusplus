import { EditorContent, useEditor } from "@tiptap/react";
import { FC, useEffect, useRef, useState } from "react";
import { FiMessageSquare, FiPlus, FiShare, FiShare2 } from "react-icons/fi";
import { H_FetchHunterFeed, H_FetchRecommendedHunters } from "@/lib/helpers";
import { IUserHunter, THunterBlogPost } from "@/lib/types";

import { $SolidHunterAccountData } from "@/lib/globalstore";
import $supabase from "@/lib/supabase";
import FeedCard from "@/components/hunter/FeedCard";
import Image from "next/image";
import Link from "next/link";
import { NextPage } from "next";
import RecommendedHunterCard from "@/components/hunter/RecommendedHunterCard";
import autoAnimate from "@formkit/auto-animate";
import { useQueries } from "@tanstack/react-query";

type PageProps = {}

const HunterFeedPage: NextPage<PageProps> = () => {
	const [globalHunterUser, setGlobalHunterUser] = useState<IUserHunter>({
		activeJob: "",
		address: {
			address: "",
			city: "",
			postalCode: "",
		},
		email: "",
		applied_jobs: [],
		avatar_url: "",
		banner_url: "",
		bio: "",
		birthdate: "",
		birthplace: "",
		citizenship: "",
		civil_status: "" as
			| "single"
			| "married"
			| "divorced"
			| "widowed"
			| "separated",
		connections: [],
		cover_letter: "",
		created_at: "",
		education: [],
		experience: [],
		followedCompanies: [],
		full_name: {
			first: "",
			last: "",
			middle: "",
		},
		gender: "" as
			| "male"
			| "female"
			| "non-binary"
			| "other"
			| "prefer not to say",
		id: "",
		id_number: "",
		id_type: "" as "national id" | "passport" | "driver's license" | "other",
		is_verified: false,
		phone: "",
		saved_jobs: [],
		skill_primary: "",
		skill_secondary: [],
		social_media_links: {
			facebook: "",
			github: "",
			instagram: "",
			linkedin: "",
			twitter: "",
			youtube: "",
		},
		subscription_type: "" as "junior" | "senior" | "expert",
		trainings: [],
		type: "hunter",
		updated_at: "",
		username: "",
	});
	const [isEditing, setIsEditing] = useState(false);
	const [feedTabActive, setFeedTabActive] = useState<"hunter" | "provisioner">(
		"hunter",
	);
	const feedRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		feedRef.current && autoAnimate(feedRef.current);
	}, [feedRef]);

	useEffect(() => {
		setGlobalHunterUser($SolidHunterAccountData.get());
	}, [$SolidHunterAccountData]);

	// queries
	const [hunterFeed, recommendedHunters] = useQueries({
		queries: [
			{
				queryKey: ["h.hunterFeed"],
				enabled: globalHunterUser.username !== "",
				queryFn: () => H_FetchHunterFeed({ target: globalHunterUser }),
				refetchOnWindowFocus: false,
			},
			{
				queryKey: ["h.recommendedHunters"],
				enabled: globalHunterUser.username !== "",
				queryFn: () => H_FetchRecommendedHunters({ connections: [...globalHunterUser.connections, globalHunterUser.id] }),
				refetchOnWindowFocus: false,
			}
		]
	})

	return globalHunterUser.username ? (
		<div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
			{/* feed */}
			<div className="col-span-full lg:col-span-3">
				{/* add feed */}
				<div className="flex items-start gap-3">
					<img
						src={globalHunterUser.avatar_url}
						className="avatar rounded-full w-12 h-12"
						alt=""
						width={48}
						height={48}
					/>
					<form className="flex flex-col gap-3 w-full">
						{!isEditing ? (
							<input
								placeholder="What's on your mind?"
								className="w-full input input-primary input-bordered"
								onClick={() => setIsEditing(true)}
							/>
						) : (
							<>
								<textarea
									className="w-full textarea textarea-primary textarea-bordered min-h-[100px] overflow-y-hidden"
									placeholder="What's on your mind? You can use markdown here too!"
									onInput={(e) => {
										e.currentTarget.style.height = "auto";
										e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
									}}
									// rome-ignore lint/a11y/noAutofocus: <explanation>
									autoFocus
								/>
								<div className="flex items-center justify-end gap-2">
									<p className="opacity-50 text-sm flex-1 link">
										Markdown cheatsheet here
									</p>
									<button type="button" className="btn btn-primary">
										Post
									</button>
									<button
										type="button"
										className="btn btn-ghost"
										onClick={() => setIsEditing(false)}
									>
										Cancel
									</button>
								</div>
							</>
						)}
					</form>
				</div>

				{/* feed */}
				<div className="flex flex-col gap-5 mt-10" ref={feedRef}>
					{/* tab selector */}
					<div className="btn-group flex-1">
						<button
							type="button"
							className={`btn flex-1 btn-sm ${feedTabActive === "hunter" ? "btn-primary" : "btn-ghost"
								}`}
							onClick={() => setFeedTabActive("hunter")}
						>
							Hunter
						</button>
						<button
							type="button"
							className={`btn flex-1 btn-sm ${feedTabActive === "provisioner" ? "btn-primary" : "btn-ghost"
								}`}
							onClick={() => setFeedTabActive("provisioner")}
						>
							Provisioner
						</button>
					</div>
					{feedTabActive === "hunter" && (
						<main className="flex flex-col gap-3">
							{
								!hunterFeed.isFetched ? (
									<div className="flex justify-center py-24">
										<div className="loading loading-spinner" />
									</div>
								) : (
									<div className="flex flex-col gap-3">
										{hunterFeed.data?.map((post) => (
											<FeedCard key={post.id} data={post} />
										))}
									</div>
								)
							}
						</main>
					)}
					{feedTabActive === "provisioner" && (
						<main className="flex flex-col gap-3">
							{/* {Array(5)
								.fill(0)
								.map((_, i) => (
									<FeedCard key={`itemprov${i + 1}`} />
								))} */}
						</main>
					)}
				</div>
			</div>
			{/* side panel */}
			<div className="col-span-full lg:col-span-2 flex flex-col gap-5 sticky top-24 h-max">
				{/* view profile */}
				<div className="flex gap-3">
					<img
						src={globalHunterUser.avatar_url}
						className="avatar rounded-full w-12 h-12"
						alt=""
						width={48}
						height={48}
					/>
					<div className="flex flex-col">
						<p className="text-xl font-bold">
							{globalHunterUser.full_name.first}{" "}
							{globalHunterUser.full_name.last}
						</p>
						<p className="text-sm opacity-50">@{globalHunterUser.username}</p>
					</div>
					<Link href="/hunter/me" className="btn btn-ghost ml-auto">
						View Profile
					</Link>
				</div>

				<p>Suggested for you</p>
				<div className="flex flex-col gap-1">
					{!recommendedHunters.isFetched ? (
						<div className="loading loading-spinner mx-auto my-10" />
					) : (
						<>
							{recommendedHunters.data?.map(hunter => <RecommendedHunterCard data={hunter} key={hunter.id} />)}
						</>
					)}
				</div>
			</div>
		</div>
	) : (
		<div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center">
			<div className="text-lg ">
				You need to <Link href="/auth/login" className="link link-primary underline-offset-4">login</Link> first.
			</div>
		</div>
	);
};

export default HunterFeedPage;
