import { IUserHunter, IUserProvisioner } from "@/lib/types";
import { MdDelete, MdEdit, MdMoreHoriz, MdShare } from "react-icons/md";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { NextPage } from "next";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import relative from "dayjs/plugin/relativeTime";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { useStore } from "@nanostores/react";

dayjs.extend(relative);

interface BlogEventPostProps {
	content: string;
	createdAt: string | null;
	id: string;
	updatedAt: string | null;
	uploader: IUserProvisioner;
	upvoters: string[];
	type: "provblog" | "event";
}

const ProvPostPage: NextPage = () => {
	const currentUser = useStore($accountDetails) as IUserHunter;
	const [isEditing, setIsEditing] = useState(false);
	const [isCommentingRef] = useAutoAnimate();
	const [isEditingRef] = useAutoAnimate();
	const router = useRouter();
	const { id: selectedID } = router.query;
	const [tempData, setTempData] = useState<BlogEventPostProps>();

	const fetchBlogData = async () => {
		if (!router.query.id) return;

		const { data, error } = await supabase
			.from("public_provposts")
			.select("*,uploader(*)")
			.eq("id", router.query.id)
			.single();

		if (error) {
			console.log(error);
			return {} as BlogEventPostProps;
		}

		return data as BlogEventPostProps;
	};

	const handleDeleteBlog = async (targetBlogId: string) => {
		toast.loading("Processing...");

		const { error } = await supabase
			.from("public_posts")
			.delete()
			.eq("id", targetBlogId);

		if (error) {
			toast.error("Something went wrong");
			return;
		}

		toast.dismiss();
		router.push("/h/feed");
	};

	const handleUpdateBlog = async (targetBlogId: string) => {
		toast.loading("Processing...");

		const { error } = await supabase
			.from("public_provposts")
			.update({
				content: tempData?.content,
			})
			.eq("id", targetBlogId);

		if (error) {
			toast.error("Something went wrong");
			return;
		}

		toast.dismiss();
		router.reload();
	};

	const _blogData = useQuery({
		queryKey: ["h_provblogData"],
		queryFn: fetchBlogData,
		enabled: !!selectedID,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		onSuccess: (data) => {
			console.log(data);
			setTempData(data);
		},
	});

	return (
		<>
			{_blogData.isSuccess && !!tempData && !!currentUser && (
				<>
					<motion.main
						variants={AnimPageTransition}
						initial="initial"
						animate="animate"
						exit="exit"
						className="relative min-h-screen w-full pt-24 pb-36 overflow-y-hidden"
					>
						{/* header */}
						<div className="flex items-center gap-4 0">
							<Image
								src={
									_blogData.data?.uploader?.avatar_url ||
									`https://api.dicebear.com/6.x/shapes/png?seed=${_blogData.data?.uploader.id}`
								}
								alt="avatar"
								width={40}
								height={40}
								className="mask mask-squircle"
							/>
							<div className="flex flex-col">
								<Link
									href={`/h/drift/company?id=${_blogData.data?.uploader.id}`}
									className="font-semibold hover:underline underline-offset-2 leading-tight flex items-center"
								>
									{_blogData.data?.uploader.legalName}
								</Link>
								<p className="leading-none">
									{dayjs(_blogData.data?.createdAt).fromNow()}
								</p>
							</div>
							{currentUser.id === _blogData.data?.uploader.id && (
								<div className="ml-auto">
									{/* mobile dropdown */}
									<div className="dropdown dropdown-end dropdown-bottom lg:hidden">
										<div tabIndex={0} className="btn btn-ghost">
											<MdMoreHoriz className="text-xl" />
										</div>
										<div className="dropdown-content">
											<ul className="menu bg-base-200 p-3 rounded-btn w-max">
												<li>
													<p
														onClick={() => {
															setIsEditing(!isEditing);
														}}
													>
														<MdEdit />
														Edit Blog
													</p>
												</li>
												<li>
													<label htmlFor="modal-delete-post">
														<MdDelete />
														Delete Blog
													</label>
												</li>
											</ul>
										</div>
									</div>
									{/* desktop buttons */}
									<div className="hidden lg:flex items-center gap-3">
										<button
											onClick={() => {
												setIsEditing(!isEditing);
											}}
											className="btn btn-ghost gap-2"
										>
											<MdEdit />
											Edit Blog
										</button>
										<label
											htmlFor="modal-delete-post"
											className="btn btn-error gap-2"
										>
											<MdDelete />
											Delete Blog
										</label>
									</div>
								</div>
							)}
						</div>
						{/* content grid */}
						<div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-10">
							{/* content */}
							<div className="col-span-3" ref={isEditingRef}>
								{!isEditing ? (
									<ReactMarkdown className="prose">
										{tempData.content}
									</ReactMarkdown>
								) : (
									<textarea
										value={tempData.content}
										onChange={(e) =>
											setTempData({
												...tempData,
												content: e.target.value as string,
											})
										}
										rows={30}
										className="textarea textarea-primary w-full"
									/>
								)}
							</div>
							{/* sidebar */}
							<div className="col-span-2" ref={isCommentingRef}>
								{/* upvote and comment toggler */}
								<div className="flex items-center gap-1">
									<p>
										Upvotes:{" "}
										<span className="text-primary font-bold">
											{_blogData.data?.upvoters.length}
										</span>
									</p>
									<button
										onClick={() => {
											navigator.clipboard.writeText(window.location.href);
											toast.success("Link copied to clipboard!");
										}}
										className="btn btn-ghost gap-2 text-xl ml-auto"
									>
										<MdShare />
									</button>
								</div>
							</div>
						</div>
					</motion.main>
				</>
			)}

			<AnimatePresence mode="wait">
				{JSON.stringify(tempData) !== JSON.stringify(_blogData.data) && (
					<motion.div
						initial={{ y: 100, opacity: 0 }}
						animate={{
							y: 0,
							opacity: 1,
							transition: { easings: "circOut" },
						}}
						exit={{ y: 100, opacity: 0, transition: { easings: "circIn" } }}
						className="fixed bottom-0 left-0 right-0 flex justify-center bg-base-100 p-5"
					>
						<div className="flex justify-end gap-2 w-full max-w-5xl">
							<button
								onClick={() => handleUpdateBlog(tempData?.id || "")}
								className="btn btn-primary"
							>
								Save Changes
							</button>
							<button
								onClick={() => {
									setTempData(_blogData.data);
									setIsEditing(false);
								}}
								className="btn btn-ghost"
							>
								Clear Changes
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* confirm delete post modal */}
			<input type="checkbox" id="modal-delete-post" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Confirm Delete</h3>
					<p className="py-4">
						Are you sure you want to delete this post? This action cannot be
						undone. All comments will also be deleted.
					</p>
					<div className="modal-action">
						<label htmlFor="modal-delete-post" className="btn">
							Cancel
						</label>
						<button
							onClick={() => handleDeleteBlog(_blogData.data?.id || "")}
							className="btn btn-error"
						>
							Delete
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProvPostPage;
