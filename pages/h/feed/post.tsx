import { FiArrowUp, FiMessageSquare } from "react-icons/fi";
import { FormEvent, useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { IUserHunter, THunterBlogPost } from "@/lib/types";
import {
	MdCheckCircle,
	MdComment,
	MdDelete,
	MdDrafts,
	MdEdit,
	MdFavorite,
	MdFavoriteBorder,
	MdMoreHoriz,
	MdPublish,
	MdSave,
	MdShare,
	MdVisibility,
	MdVisibilityOff,
} from "react-icons/md";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import rehypeRaw from "rehype-raw";
import relative from "dayjs/plugin/relativeTime";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";
import { uuid } from "uuidv4";

dayjs.extend(relative);

type IComment = {
	id: string;
	content: string;
	createdAt: string;
	commenter: {
		id: string;
		username: string;
		full_name: string;
	};
	visible: boolean;
};

const BlogPage: NextPage = () => {
	const [isLiked, setIsLiked] = useState(false);
	const [isCommenting, setIsCommenting] = useState(false);
	const currentUser = useStore($accountDetails) as IUserHunter;
	const [isEditing, setIsEditing] = useState(false);
	const [isCommentingRef] = useAutoAnimate();
	const [isEditingRef] = useAutoAnimate();
	const router = useRouter();
	const [tempData, setTempData] = useState({} as THunterBlogPost);

	const fetchBlogData = async () => {
		const { id } = router.query;
		const { data, error } = await supabase
			.from("public_posts")
			.select("*,uploader(id,full_name,username,avatar_url,is_verified)")
			.eq("id", id)
			.single();

		if (error) {
			console.log(error);
			return {} as THunterBlogPost;
		}

		return data as THunterBlogPost;
	};

	const _blogData = useQuery({
		queryFn: fetchBlogData,
		queryKey: ["h_blogData"],
		enabled: !!router.query.id,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		onSuccess: (data) => {
			setTempData(data);
		},
	});

	// methods
	const checkIfLiked = async (upvoterArrays: string[]) => {
		const localIsLiked = upvoterArrays.includes(currentUser.id);
		setIsLiked(localIsLiked);
	};

	const upvoteHandler = async () => {
		toast.loading("Processing...");

		// fetch current upvoters
		const { data: currentData, error: currentDataError } = await supabase
			.from("public_posts")
			.select("upvoters")
			.eq("id", router.query.id)
			.single();

		if (currentDataError) {
			console.log(currentDataError);
			return;
		}

		const localIsLiked = currentData.upvoters.includes(currentUser.id);

		// if user already liked the post, remove the upvote
		if (localIsLiked) {
			const newUpvoters = currentData.upvoters.filter(
				(id: string) => id !== currentUser.id,
			);

			const { error: removeUpvoteError } = await supabase
				.from("public_posts")
				.update({
					upvoters: newUpvoters,
				})
				.eq("id", router.query.id);

			if (removeUpvoteError) {
				console.log(removeUpvoteError);
				return;
			}

			setIsLiked(false);
			_blogData.refetch();
			toast.dismiss();
			return;
		}

		// if user hasn't liked the post, add the upvote
		const newUpvoters = [...currentData.upvoters, currentUser.id];

		const { error: addUpvoteError } = await supabase
			.from("public_posts")
			.update({
				upvoters: newUpvoters,
			})
			.eq("id", router.query.id);

		if (addUpvoteError) {
			console.log(addUpvoteError);
			return;
		}

		setIsLiked(true);
		toast.dismiss();
		_blogData.refetch();
	};

	const handleDeleteComment = async (commentId: string) => {
		toast.loading("Processing...");

		const newComments = _blogData.data?.comments.filter(
			(comment) => comment.id !== commentId,
		);

		const { error } = await supabase
			.from("public_posts")
			.update({
				comments: newComments,
			})
			.eq("id", router.query.id);

		if (error) {
			toast.error("Something went wrong");
			return;
		}

		toast.dismiss();
		_blogData.refetch();
	};

	const handleDeleteBlog = async () => {
		toast.loading("Processing...");

		const { error } = await supabase
			.from("public_posts")
			.delete()
			.eq("id", router.query.id);

		if (error) {
			toast.error("Something went wrong");
			return;
		}

		toast.dismiss();
		router.back();
	};

	const handleUpdateBlog = async () => {
		toast.loading("Processing...");

		const { error } = await supabase
			.from("public_posts")
			.update({
				content: tempData.content,
				draft: tempData.draft,
				updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			})
			.eq("id", router.query.id);

		if (error) {
			toast.error("Something went wrong");
			return;
		}

		toast.dismiss();
		_blogData.refetch();
	};

	const changeCommentVisibility = async (targetCommentID: string) => {
		const { data: latestData, error: latestDataError } = await supabase
			.from("public_posts")
			.select("comments")
			.eq("id", router.query.id)
			.single();

		if (latestDataError || !latestData) {
			console.log(latestDataError);
			toast.error("Something went wrong!");
			return;
		}

		const newComments = latestData.comments.map((comment: IComment) => {
			if (comment.id === targetCommentID) {
				comment.visible = !comment.visible;
			}

			return comment;
		});

		const { error } = await supabase
			.from("public_posts")
			.update({
				comments: newComments,
			})
			.eq("id", router.query.id);

		if (error) {
			console.log(error);
			toast.error("Something went wrong!");
			return;
		}

		toast.success("Comment visibility changed!");
		_blogData.refetch();
	};

	const handleComment = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const commentContent = document.getElementById(
			"commentContent",
		) as HTMLTextAreaElement;

		// disable the form
		e.currentTarget.disabled = true;

		if (commentContent.value.length === 0) {
			toast.error("Comment cannot be empty!");
			return;
		}

		// fetch latest data
		const { data: latestData, error: latestDataError } = await supabase
			.from("public_posts")
			.select("comments")
			.eq("id", router.query.id)
			.single();

		if (latestDataError || !latestData) {
			console.log(latestDataError);
			toast.error("Something went wrong!");
			return;
		}

		const newComment = {
			id: uuid(),
			content: commentContent.value,
			createdAt: dayjs().format(),
			commenter: {
				id: currentUser.id,
				username: currentUser.username,
				full_name: currentUser.full_name,
				avatar_url: currentUser.avatar_url,
				is_verified: currentUser.is_verified,
			},
			visible: true,
		};

		const newComments = [...latestData.comments, newComment];

		const { error } = await supabase
			.from("public_posts")
			.update({
				comments: newComments,
			})
			.eq("id", router.query.id);

		if (error) {
			console.log(error);
			toast.error("Something went wrong!");
			return;
		}

		commentContent.value = "";
		toast.success("Comment posted!");
		_blogData.refetch();
		setIsCommenting(false);
	};

	useEffect(() => {
		if (_blogData.isSuccess && currentUser) {
			checkIfLiked(_blogData.data.upvoters);
		}
	});

	return (
		<>
			{_blogData.isSuccess && !!currentUser && !!tempData && (
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
								src={_blogData.data.uploader.avatar_url}
								alt="avatar"
								width={40}
								height={40}
								className="mask mask-squircle"
							/>
							<div className="flex flex-col">
								<Link
									href={
										currentUser.id === _blogData.data.uploader.id
											? "/me"
											: `/h?user=${_blogData.data.uploader.username}`
									}
									className="font-semibold hover:underline underline-offset-2 leading-tight flex items-center"
								>
									{_blogData.data.uploader.full_name.first}{" "}
									{_blogData.data.uploader.full_name.last}
									{_blogData.data.uploader.is_verified && (
										<MdCheckCircle className="text-primary ml-1" />
									)}
								</Link>
								<p className="leading-none">
									{dayjs(_blogData.data.createdAt).fromNow()}
								</p>
							</div>
							{currentUser.id === _blogData.data.uploader.id && (
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
										<label className="flex items-center gap-2">
											<input
												type="checkbox"
												className="checkbox checkbox-primary"
												checked={tempData.draft}
												onChange={(e) => {
													setTempData({
														...tempData,
														draft: e.target.checked,
													});
												}}
											/>
											<span className="text-sm">Draft</span>
										</label>
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
												content: e.target.value,
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
									<div className="tooltip" data-tip="Upvote">
										<button
											onClick={upvoteHandler}
											className="btn btn-ghost gap-2 text-xl"
										>
											{isLiked ? (
												<MdFavorite className="text-red-500" />
											) : (
												<MdFavoriteBorder />
											)}
											{_blogData.data.upvoters.length}
										</button>
									</div>

									<div className="tooltip" data-tip="Comment">
										<button
											onClick={() => {
												setIsCommenting(!isCommenting);
											}}
											className="btn btn-ghost gap-2 text-xl"
										>
											<MdComment />
											{_blogData.data.comments.length}
										</button>
									</div>

									<div className="tooltip" data-tip="Share">
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

								{/* comment input */}
								{isCommenting && (
									<form
										onSubmit={(e) => handleComment(e)}
										className="mt-5 flex flex-col gap-2"
									>
										<div className="flex items-center gap-3">
											<Image
												src={currentUser.avatar_url}
												alt="avatar"
												width={40}
												height={40}
												className="mask mask-squircle"
											/>
											<div>
												<p className="font-semibold leading-tight flex items-center">
													{currentUser.full_name.first}{" "}
													{currentUser.full_name.last}
													{currentUser.is_verified && (
														<MdCheckCircle className="text-primary text-sm ml-1" />
													)}
												</p>
												<p className="text-sm leading-tight">
													@{currentUser.username}
												</p>
											</div>
										</div>
										<textarea
											name="commentContent"
											id="commentContent"
											rows={5}
											className="textarea textarea-primary w-full"
										/>
										<button type="submit" className="btn btn-primary btn-block">
											Comment
										</button>
									</form>
								)}
								{/* comment section */}
								{_blogData.data.comments.length > 0 ? (
									<div className="mt-5 flex flex-col gap-1">
										{_blogData.data.comments.map((comment, index: number) => (
											<div
												className=" rounded-btn flex flex-col gap-2"
												key={`comment_${index}`}
											>
												<div className="flex gap-2">
													<Link
														href={
															currentUser.id === comment.commenter.id
																? "/h/me"
																: `/h/${comment.commenter.username}`
														}
													>
														<Image
															src={comment.commenter.avatar_url}
															alt="avatar"
															className="mask mask-squircle bg-primary"
															width={36}
															height={36}
														/>
													</Link>
													<div className="flex flex-col w-full rounded-btn p-3 bg-base-300">
														<Link
															href={
																currentUser.id === comment.commenter.id
																	? "/h/me"
																	: `/h/${comment.commenter.username}`
															}
															className="font-bold text-sm leading-none hover:underline w-full flex items-center"
														>
															{comment.commenter.full_name.first}{" "}
															{comment.commenter.full_name.last}
															{comment.commenter.is_verified && (
																<MdCheckCircle className="text-primary ml-1" />
															)}
														</Link>
														<ReactMarkdown
															// components={markdownRenderer}
															rehypePlugins={[rehypeRaw]}
															className="prose pb-0 break-all"
														>
															{comment.content}
														</ReactMarkdown>
													</div>
												</div>
												<div className="flex items-center">
													{!comment.visible ? <MdVisibilityOff /> : null}
													<div className="flex gap-3 ml-auto">
														{_blogData.data.uploader.id === currentUser.id && (
															<>
																<label
																	htmlFor="deleteCommentModal"
																	className="hover:underline hover:text-error cursor-pointer"
																>
																	Delete
																</label>
																<div
																	onClick={() => {
																		changeCommentVisibility(comment.id);
																	}}
																	className="hover:underline cursor-pointer"
																>
																	{comment.visible ? (
																		<>Hide Comment</>
																	) : (
																		<>Show Comment</>
																	)}
																</div>
															</>
														)}
													</div>

													{/* delete comment modal */}
													<input
														type="checkbox"
														id="deleteCommentModal"
														className="modal-toggle"
													/>
													<div className="modal">
														<div className="modal-box">
															<h2 className="text-lg font-bold">
																Confirm Delete Comment
															</h2>
															<p>
																Are you sure you want to delete this comment?
																This action can&apos;t be undone.
															</p>

															<div className="flex gap-2 mt-5 justify-end">
																<label
																	htmlFor="deleteCommentModal"
																	className="btn btn-ghost"
																>
																	Cancel
																</label>
																<label
																	htmlFor="deleteCommentModal"
																	className="btn btn-error"
																	onClick={() => {
																		handleDeleteComment(comment.id);
																	}}
																>
																	Delete
																</label>
															</div>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="mt-5 lg:p-5 flex flex-col gap-5">
										<p className="opacity-50 text-center">No comments yet!</p>
									</div>
								)}
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
							<button onClick={handleUpdateBlog} className="btn btn-primary">
								Save Changes
							</button>
							<button
								onClick={() => {
									setTempData(_blogData.data as THunterBlogPost);
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
						<button onClick={handleDeleteBlog} className="btn btn-error">
							Delete
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default BlogPage;
