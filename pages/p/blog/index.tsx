import { AnimLoading, AnimPageTransition } from "@/lib/animations";
import { AnimatePresence, motion } from "framer-motion";
import { FC, FormEvent, FormEventHandler, useState } from "react";
import { IUserProvisioner, THunterBlogPost, TProvBlogPost } from "@/lib/types";
import { MdGridView, MdPostAdd, MdShare, MdTableView } from "react-icons/md";
import dayjs, { extend } from "dayjs";

import { $accountDetails } from "@/lib/globalStates";
import Image from "next/image";
import Link from "next/link";
import { NextPage } from "next";
import ProvFeedCard from "@/components/feed/ProvFeedCard";
import ProvFeedCardGrid from "@/components/feed/ProvFeedCardGrid";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import relativeTime from "dayjs/plugin/relativeTime";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQueries } from "@tanstack/react-query";
import { useStore } from "@nanostores/react";

dayjs.extend(relativeTime);

interface BlogEventPostProps {
	content: string;
	createdAt: string | null;
	id: string;
	updatedAt: string | null;
	uploader: IUserProvisioner;
	upvoters: string[];
	type: "provblog" | "event";
	draft: boolean;
}

const BlogPage: NextPage = () => {
	const _currentUser = useStore($accountDetails) as IUserProvisioner;
	const [contentView] = useAutoAnimate<HTMLDivElement>({
		duration: 100,
	});
	const [layoutViewMode, setLayoutViewMode] = useState<"grid" | "table">(
		"grid",
	);
	const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
	const [postType, setPostType] = useState<"provblog" | "event">("provblog");

	const fetchProvPosts = async () => {
		const { data, error } = await supabase
			.from("public_provposts")
			.select("*,uploader(*)")
			.order("createdAt", { ascending: false })
			.eq("uploader", _currentUser.id);

		if (error) {
			toast.error(error.message);
			return [];
		}

		return data as BlogEventPostProps[];
	};

	const [provPosts] = useQueries({
		queries: [
			{
				queryKey: ["provPosts"],
				queryFn: fetchProvPosts,
				enabled: !!_currentUser,
				refetchOnWindowFocus: false,
			},
		],
	});

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget as HTMLFormElement;
		const content = form.content.value;

		toast.loading("Adding post...");
		const { error } = await supabase.from("public_provposts").insert({
			id: self.crypto.randomUUID(),
			content: content,
			comments: [],
			createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			type: postType,
			updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			upvoters: [],
			uploader: _currentUser.id,
		});

		if (error) {
			toast.dismiss();
			toast.error(error.message);
			return;
		}

		toast.dismiss();
		setIsCreatePostModalOpen(false);
		provPosts.refetch();
		toast.success("Post added successfully");
	};

	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full flex flex-col gap-10 pt-24 pb-36 "
			>
				<p className="text-3xl mb-2">Blog and Event Posts</p>

				<div className="flex justify-between">
					<button
						onClick={() => setIsCreatePostModalOpen(true)}
						className="btn btn-primary items-center gap-2"
					>
						<MdPostAdd className="text-lg" />
						<span className="hidden lg:block">Add Post</span>
					</button>
					{layoutViewMode === "grid" ? (
						<button
							onClick={() => setLayoutViewMode("table")}
							className="btn btn-ghost items-center gap-2 hidden lg:inline-flex"
						>
							<MdTableView className="text-lg" />
							<span className="hidden lg:block">Change to Table View</span>
						</button>
					) : (
						<button
							onClick={() => setLayoutViewMode("grid")}
							className="btn btn-ghost items-center gap-2"
						>
							<MdGridView className="text-lg" />
							<span className="hidden lg:block">Change to Grid View</span>
						</button>
					)}
				</div>

				{/* content */}
				<div className="overflow-hidden" ref={contentView}>
					{/* grid view */}
					{layoutViewMode === "grid" && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{provPosts.isLoading &&
								Array(2)
									.fill("")
									.map((_, index) => (
										<div
											key={`gridcardloader_${index}`}
											className="h-[200px] w-full bg-slate-500/50 rounded-btn animate-pulse"
										/>
									))}
							{provPosts.isSuccess && provPosts.data.length < 1 && (
								<div className="alert alert-info col-span-full">
									No posts found
								</div>
							)}
							{provPosts.isSuccess &&
								provPosts.data.length > 0 &&
								provPosts.data.map((item, index) => (
									<ProvFeedCardGrid item={item} key={item.id} />
								))}
						</div>
					)}
					{/* table view */}
					{layoutViewMode === "table" && (
						<>
							{provPosts.isSuccess && provPosts.data.length > 0 && (
								<div className="hidden lg:flex flex-col gap-2">
									{provPosts.data.map((item, index) => (
										<ProvFeedCard item={item} key={item.id} />
									))}
								</div>
							)}
							{provPosts.isLoading && (
								<div className="hidden lg:flex flex-col gap-2 ">
									{Array(5)
										.fill("")
										.map((_, index) => (
											<div
												key={`provpost_loader_${index}`}
												className="h-[75px] w-full bg-slate-500/50 rounded-btn animate-pulse"
											/>
										))}
								</div>
							)}
							<div className="alert alert-warning lg:hidden">
								Table View not supported in mobile
							</div>
						</>
					)}
				</div>
			</motion.main>

			{/* create post modal */}
			<AnimatePresence mode="wait">
				{isCreatePostModalOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={(e) => {
							if (e.target === e.currentTarget) {
								setIsCreatePostModalOpen(false);
								setPostType("provblog");
							}
						}}
						className="fixed inset-0 bg-base-300/50 z-50 flex items-end lg:items-center justify-center"
					>
						<motion.div
							initial={{ translateY: 50 }}
							animate={{ translateY: 0 }}
							exit={{ translateY: 50, transition: { ease: "circIn" } }}
							className="bg-base-100 rounded-btn rounded-b-none pb-10 lg:pb-5 shadow-lg flex flex-col p-5 w-full max-w-[500px]"
						>
							<h2 className="text-2xl font-semibold mb-4">Create Post</h2>

							<form onSubmit={handleSubmit}>
								<label className="form-control">
									<span>Your Content</span>
									<textarea
										name="content"
										rows={10}
										placeholder="Your meaningful content will be written here"
										className="textarea textarea-primary"
									/>
									<span className="text-right opacity-75">Markdown</span>
								</label>
								<label className="flex gap-2 mt-2">
									<input
										type="checkbox"
										className="toggle toggle-primary"
										onChange={(e) =>
											setPostType(e.target.checked ? "event" : "provblog")
										}
										checked={postType === "event"}
									/>
									<span>
										{postType === "provblog" && "Blog Post"}
										{postType === "event" && "Event Post"}
									</span>
								</label>

								<div className="flex justify-end gap-2 mt-4">
									<button
										type="reset"
										onClick={() => {
											setIsCreatePostModalOpen(false);
											setPostType("provblog");
										}}
										className="btn btn-ghost"
									>
										Cancel
									</button>
									<button type="submit" className="btn btn-primary">
										Create
									</button>
								</div>
							</form>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default BlogPage;
