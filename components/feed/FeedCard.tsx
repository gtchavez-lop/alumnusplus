import { FC, FormEvent, useEffect, useState } from "react";
import {
	FiArrowUp,
	FiLoader,
	FiMessageSquare,
	FiMoreHorizontal,
} from "react-icons/fi";
import { IUserHunter, THunterBlogPost } from "@/lib/types";
import {
	MdCheckCircleOutline,
	MdDelete,
	MdMoreHoriz,
	MdShare,
	MdVisibility,
	MdVisibilityOff,
} from "react-icons/md";

import { $accountDetails } from "@/lib/globalStates";
import Image from "next/image";
import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import rehypeRaw from "rehype-raw";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";
import { uuid } from "uuidv4";

type IComment = {
	id: string;
	content: string;
	createdAt: string;
	commenter: {
		id: string;
		username: string;
		full_name: {
			first: string;
			last: string;
			middle: string;
		};
	};
	visible: boolean;
};

const FeedCard: FC<{ blogData: THunterBlogPost; refetchData: Function }> = ({
	blogData,
	refetchData,
}) => {
	const [isLiked, setIsLiked] = useState(false);
	const [commentsOpen, setCommentsOpen] = useState(false);
	const currentUser = useStore($accountDetails) as IUserHunter;
	const [cardRef] = useAutoAnimate<HTMLDivElement>();

	const checkIfLiked = async () => {
		const upvotersList = blogData.upvoters as string[];
		const localIsLiked: boolean = upvotersList.includes(currentUser?.id);
		setIsLiked(localIsLiked);
	};

	const sendNotification = async () => {
		const notificationData = {
			description: `${currentUser.username} liked your post`,
			link: `/h/blog/${blogData.id}`,
			trigger_from: currentUser.id,
			trigger_to: blogData.uploader,
		};

		const { error: notificationError } = await supabase
			.from("notif_hunters")
			.insert([notificationData]);

		if (notificationError) {
			console.log(notificationError);
			return;
		}
	};

	// post upvote handler
	const upvoteHandler = async () => {
		// fetch current upvoters
		const { data: currentData, error: currentDataError } = await supabase
			.from("public_posts")
			.select("upvoters")
			.eq("id", blogData.id)
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
				.eq("id", blogData.id);

			if (removeUpvoteError) {
				console.log(removeUpvoteError);
				return;
			}

			blogData.upvoters = newUpvoters;
			setIsLiked(false);
			toast.dismiss();
			return;
		} else {
			// if user hasn't liked the post, add the upvote
			const { error: addUpvoteError } = await supabase
				.from("public_posts")
				.update({
					upvoters: [...currentData.upvoters, currentUser.id],
				})
				.eq("id", blogData.id);

			if (addUpvoteError) {
				console.log(addUpvoteError);
				return;
			}

			blogData.upvoters = [...currentData.upvoters, currentUser.id];
			setIsLiked(true);
			sendNotification();
			toast.dismiss();
		}
	};

	const handleComment = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		let commentContent = e.currentTarget[0] as HTMLTextAreaElement;

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
			.eq("id", blogData.id)
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
			},
			visible: true,
		};

		const newComments = [...latestData.comments, newComment];

		const { error } = await supabase
			.from("public_posts")
			.update({
				comments: newComments,
			})
			.eq("id", blogData.id);

		if (error) {
			console.log(error);
			toast.error("Something went wrong!");
			return;
		}

		commentContent.value = "";
		toast.success("Comment posted!");
		blogData.comments = newComments;
		refetchData();
	};

	const removeComment = async (commentId: string) => {
		const { data: latestData, error: latestDataError } = await supabase
			.from("public_posts")
			.select("comments")
			.eq("id", blogData.id)
			.single();

		if (latestDataError || !latestData) {
			console.log(latestDataError);
			toast.error("Something went wrong!");
			return;
		}

		const newComments = latestData.comments.filter(
			(comment: IComment) => comment.id !== commentId,
		);

		const { error } = await supabase
			.from("public_posts")
			.update({
				comments: newComments,
			})
			.eq("id", blogData.id);

		if (error) {
			console.log(error);
			toast.error("Something went wrong!");
			return;
		}

		toast.success("Comment deleted!");
		blogData.comments = newComments;
		refetchData();
	};

	const changeCommentVisibility = async (commentId: string) => {
		const { data: latestData, error: latestDataError } = await supabase
			.from("public_posts")
			.select("comments")
			.eq("id", blogData.id)
			.single();

		if (latestDataError || !latestData) {
			console.log(latestDataError);
			toast.error("Something went wrong!");
			return;
		}

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

		const newComments = latestData.comments.map((comment: IComment) => {
			if (comment.id === commentId) {
				comment.visible = !comment.visible;
			}

			return comment;
		});

		const { error } = await supabase
			.from("public_posts")
			.update({
				comments: newComments,
			})
			.eq("id", blogData.id);

		if (error) {
			console.log(error);
			toast.error("Something went wrong!");
			return;
		}

		toast.success("Comment visibility changed!");
		blogData.comments = newComments;
		refetchData();
	};

	useEffect(() => {
		checkIfLiked();
	});

	return (
		<>
			<div className="flex flex-col p-5 rounded-btn bg-base-200">
				<div className="flex gap-3">
					<Link
						href={
							currentUser.id === blogData.uploader.id
								? "/h/me"
								: `/h/${blogData.uploader.username}`
						}
					>
						<Image
							src={blogData.uploader.avatar_url}
							alt="avatar"
							className="w-12 h-12 mask mask-squircle bg-primary object-center object-cover"
							width={48}
							height={48}
						/>
					</Link>
					<div className="flex flex-col gap-1 justify-center">
						<p className="leading-none flex w-full">
							<Link
								href={
									currentUser.id === blogData.uploader.id
										? "/h/me"
										: `/h/${blogData.uploader.username}`
								}
								className="flex"
							>
								{blogData.uploader.full_name.first}{" "}
								{blogData.uploader.full_name.last}
								{blogData.uploader.is_verified && (
									<MdCheckCircleOutline className="text-primary ml-1" />
								)}
							</Link>
							<span className=" opacity-50 ml-1">posted</span>
						</p>
						<p className="text-sm flex gap-2 leading-none">
							<span className="opacity-50">@{blogData.uploader.username}</span>
							<span>
								{dayjs(blogData.createdAt).format("MMM DD YYYY h:MM A")}
							</span>
						</p>
					</div>
				</div>

				<Link
					href={`/h/feed/${blogData.id}`}
					className="mt-5 h-[101px] overflow-hidden relative"
				>
					<div className="absolute w-full h-full bg-gradient-to-b from-transparent to-base-200" />
					<ReactMarkdown
						rehypePlugins={[rehypeRaw]}
						className="prose-sm prose-headings:text-xl -z-10"
					>
						{`${blogData.content.slice(0, 500)}...`}
					</ReactMarkdown>
				</Link>
				<Link
					href={`/h/feed/${blogData.id}`}
					className="text-center pt-2 opacity-50 z-10"
				>
					Read more
				</Link>

				<div className="mt-5 flex justify-between">
					<div className="flex gap-2">
						<button
							onClick={upvoteHandler}
							className={`btn ${isLiked ? "btn-primary" : "btn-ghost"} gap-2`}
						>
							<FiArrowUp className="font-bold" />
							{blogData.upvoters ? blogData.upvoters.length : 0}
						</button>
						<motion.button
							onClick={() =>
								setCommentsOpen(
									blogData.comments?.length ? !commentsOpen : true,
								)
							}
							className="btn btn-ghost"
						>
							<FiMessageSquare className="font-bold" />
							<span className="ml-2">{blogData.comments?.length ?? 0}</span>
						</motion.button>
					</div>
					{/* <div className="md:hidden dropdown dropdown-top dropdown-end">
						<label tabIndex={0} className="btn btn-ghost">
							<FiMoreHorizontal />
						</label>
						<ul
							tabIndex={0}
							className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
						>
							<li>
								<Link scroll={false} href={`/h/feed/${blogData.id}`}>
									Read More
								</Link>
							</li>
							<li>
								<button
									onClick={() => {
										const thisLink = `${route}/h/feed/${blogData.id}`;
										navigator.clipboard.writeText(thisLink);
										toast("Link Shared");
									}}
								>
									Share
								</button>
							</li>
						</ul>
					</div> */}
					<div className="flex gap-2">
						{/* {!isMoreOpen ? (
							<Link
								scroll={false}
								href={`/h/feed/${blogData.id}`}
								className="btn btn-ghost"
								onClick={() => setIsMoreOpen(true)}
							>
								Read More
							</Link>
						) : (
							<div className="btn btn-ghost btn-disabled items-center gap-2">
								Loading Page
								<FiLoader className="animate-spin" />
							</div>
						)} */}
						<button
							className="btn btn-ghost gap-2"
							onClick={() => {
								const baseURL = window.location.origin;
								const thisLink = `${baseURL}/h/feed/${blogData.id}`;
								navigator.clipboard.writeText(thisLink);
								toast("Link Shared");
							}}
						>
							<MdShare />
						</button>
					</div>
				</div>

				<div ref={cardRef}>
					{commentsOpen && (
						<div className="mt-5 flex flex-col gap-2">
							{blogData.comments?.map((comment, index) =>
								// make all comments visible if the post is from the current user
								comment.visible || currentUser.id === blogData.uploader.id ? (
									<div
										className="bg-base-200 rounded-btn flex gap-2"
										key={`comment_${index}`}
									>
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
												className="w-12 h-12 mask mask-squircle bg-primary object-center object-cover"
												width={48}
												height={48}
											/>
										</Link>
										{/* content */}
										<div className="flex flex-col bg-base-100 w-full rounded-btn p-3">
											<Link
												href={
													currentUser.id === comment.commenter.id
														? "/h/me"
														: `/h/${comment.commenter.username}`
												}
												className="font-bold text-sm leading-none hover:underline"
											>
												{comment.commenter.full_name.first}{" "}
												{comment.commenter.full_name.last}
												{!comment.visible && (
													<span className="text-error opacity-50">
														{" "}
														- Comment Hidden
													</span>
												)}
											</Link>
											<ReactMarkdown
												// components={markdownRenderer}
												rehypePlugins={[rehypeRaw]}
												className="prose pb-0"
											>
												{comment.content}
											</ReactMarkdown>
										</div>
										{/* actions */}
										{currentUser.id === blogData.uploader.id && (
											<>
												<div className="dropdown dropdown-bottom dropdown-end">
													<label tabIndex={0} className="btn btn-ghost">
														<MdMoreHoriz />
													</label>
													<ul
														tabIndex={0}
														className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-max"
													>
														<li>
															<label
																htmlFor="deleteCommentModal"
																className="hover:bg-error hover:text-error-content"
															>
																<MdDelete />
																Delete Comment
															</label>
														</li>
														<li>
															<p
																onClick={() => {
																	changeCommentVisibility(comment.id);
																}}
															>
																{comment.visible ? (
																	<>
																		<MdVisibilityOff />
																		Hide Comment
																	</>
																) : (
																	<>
																		<MdVisibility />
																		Show Comment
																	</>
																)}
															</p>
														</li>
													</ul>
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
															Are you sure you want to delete this comment? This
															action can&apos;t be undone.
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
																onClick={() => removeComment(comment.id)}
																className="btn btn-error"
															>
																Delete
															</label>
														</div>
													</div>
												</div>
											</>
										)}
									</div>
								) : null,
							)}
							<form onSubmit={(e) => handleComment(e)}>
								<div className="flex gap-2 mt-5">
									<Image
										src={currentUser.avatar_url}
										alt="avatar"
										className="w-10 h-10 mask mask-squircle bg-primary object-center object-cover"
										width={40}
										height={40}
									/>
									<div className="flex flex-col bg-base-100 w-full rounded-btn">
										<textarea
											className="w-full bg-base-100 rounded-btn p-3"
											placeholder="Write a comment..."
											rows={1}
											name="commentContent"
										/>
										<button
											className="btn btn-primary ml-auto mt-3"
											type="submit"
										>
											Comment
										</button>
									</div>
								</div>
							</form>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default FeedCard;
