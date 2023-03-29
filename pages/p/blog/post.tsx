import { FiArrowUp, FiMessageSquare } from "react-icons/fi";
import { FormEvent, useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import {
	IUserHunter,
	IUserProvisioner,
	THunterBlogPost,
	TProvBlogPost,
} from "@/lib/types";
import {
	MdCheckCircle,
	MdComment,
	MdDelete,
	MdEdit,
	MdFavorite,
	MdFavoriteBorder,
	MdMoreHoriz,
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
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";
import { uuid } from "uuidv4";

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

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { id } = context.query;

	const { data: blogData, error } = await supabase
		.from("public_provposts")
		.select("*,uploader(*)")
		.eq("id", id)
		.single();

	if (error) {
		console.log(error);
	}

	if (error) {
		return {
			props: {
				blogData: null,
			},
		};
	}

	return {
		props: {
			blogData,
		},
	};
};

const ProvBlogPostPage: NextPage<{ blogData: BlogEventPostProps }> = ({
	blogData,
}) => {
	const [isLiked, setIsLiked] = useState(false);
	const [isCommenting, setIsCommenting] = useState(false);
	const currentUser = useStore($accountDetails) as IUserHunter;
	const [isEditing, setIsEditing] = useState(false);
	const [isCommentingRef] = useAutoAnimate();
	const [isEditingRef] = useAutoAnimate();
	const router = useRouter();
	const [tempData, setTempData] = useState(blogData);

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
				content: tempData.content,
			})
			.eq("id", targetBlogId);

		if (error) {
			toast.error("Something went wrong");
			return;
		}

		toast.dismiss();
		router.reload();
	};

	return (
		<>
			{!!blogData && !!currentUser && (
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
								src={blogData.uploader.avatar_url}
								alt="avatar"
								width={40}
								height={40}
								className="mask mask-squircle"
							/>
							<div className="flex flex-col">
								<Link
									href={
										currentUser.id === blogData.uploader.id
											? "/p/me"
											: `/drift/company?id=${blogData.uploader.id}`
									}
									className="font-semibold hover:underline underline-offset-2 leading-tight flex items-center"
								>
									{blogData.uploader.legalName}
								</Link>
								<p className="leading-none">
									{dayjs(blogData.createdAt).fromNow()}
								</p>
							</div>
							{currentUser.id === blogData.uploader.id && (
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
									<p>
										Upvotes:{" "}
										<span className="text-primary font-bold">
											{blogData.upvoters.length}
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

			{/* {!!blogData && !!currentUser && (
				<>
					<motion.main
						variants={AnimPageTransition}
						initial="initial"
						animate="animate"
						exit="exit"
						className="relative min-h-screen w-full flex justify-center pt-24 pb-36"
					>
						<div className="w-full max-w-2xl h-max max-h-max">
							<div className="flex items-center gap-3 lg:bg-base-200 lg:p-5 lg:rounded-btn">
								<Link
									href={
										currentUser.id === blogData.uploader.id
											? "/me"
											: `/h/${blogData.uploader.username}`
									}
								>
									<Image
										src={blogData.uploader.avatar_url}
										alt="avatar"
										className="w-10 h-10 mask mask-squircle"
										width={40}
										height={40}
									/>
								</Link>
								<div className="flex flex-col gap-1">
									<Link
										href={
											currentUser.id === blogData.uploader.id
												? "/me"
												: `/h/${blogData.uploader.username}`
										}
									>
										<p className=" font-semibold leading-none hover:underline underline-offset-4">
											{blogData.uploader.full_name.first}{" "}
											{blogData.uploader.full_name.last}
										</p>
									</Link>
									<p className="text-gray-500 text-sm leading-none">
										{dayjs(blogData.createdAt).format("MMMM D, YYYY")}
									</p>
								</div>
								{currentUser.id === blogData.uploader.id && (
									<div className="flex items-center gap-2 ml-auto">
										<button
											onClick={() => setIsEditing(!isEditing)}
											className="btn btn-ghost"
										>
											<MdEdit />
										</button>
										<label
											htmlFor="modal-delete-post"
											className="btn btn-ghost"
										>
											<MdDelete />
										</label>
									</div>
								)}
							</div>

							<div className="mt-5 lg:p-5" ref={isEditingRef}>
								{!isEditing ? (
									<ReactMarkdown
										rehypePlugins={[rehypeRaw]}
										className="prose prose-a:text-primary prose-lead:underline underline-offset-4"
									>
										{tempData.content}
									</ReactMarkdown>
								) : (
									<textarea
										value={tempData.content}
										onChange={(e) =>
											setTempData({ ...tempData, content: e.target.value })
										}
										className="w-full prose textarea textarea-primary textarea-bordered h-[500px]"
									/>
								)}
							</div>

							<div className="flex items-center justify-between mt-10 lg:p-5">
								<div className="flex items-center gap-3">
									<button
										onClick={upvoteHandler}
										className={`btn gap-2 items-center ${
											isLiked ? "btn-primary" : "btn-ghost"
										}`}
									>
										<FiArrowUp />
										<span>{blogData.upvoters.length ?? 0}</span>
									</button>
									<button
										onClick={() => setIsCommenting(!isCommenting)}
										className="btn btn-ghost gap-2 items-center"
									>
										<FiMessageSquare />
										<span>{blogData.comments.length ?? 0}</span>
									</button>
								</div>
								<div className="flex items-center gap-3">
									<button className="btn btn-ghost">Share</button>
								</div>
							</div>

							<div ref={isCommentingRef} className="pt-5">
								{isCommenting && (
									<>
										<div className="flex items-center gap-3">
											<Image
												src={currentUser.avatar_url}
												alt="avatar"
												className="w-10 h-10 mask mask-squircle"
												width={40}
												height={40}
											/>

											<div className="flex flex-col gap-1">
												<p className=" font-semibold leading-none">
													{currentUser.full_name.first}{" "}
													{currentUser.full_name.last}
												</p>
												<p className="opacity-50 text-sm leading-none">
													{dayjs().format("MMMM D, YYYY")}
												</p>
											</div>
										</div>
										<form
											onSubmit={async (e: FormEvent<HTMLFormElement>) => {
												e.preventDefault();
												let commentContent = document.getElementById(
													"commentContent",
												) as HTMLTextAreaElement;

												// disable the form
												e.currentTarget.disabled = true;

												if (commentContent.value.length === 0) {
													toast.error("Comment cannot be empty!");
													return;
												}

												// fetch latest data
												const { data: latestData, error: latestDataError } =
													await supabase
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
													},
													visible: true,
												};

												const newComments = [
													...latestData.comments,
													newComment,
												];

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
												setIsCommenting(false);
											}}
											className="mt-5"
										>
											<textarea
												name="commentContent"
												id="commentContent"
												className="w-full h-32 p-3 bg-base-200 rounded-btn"
												placeholder="Write a comment..."
											/>

											<div className="flex justify-between mt-3 gap-2">
												<p>Markdown</p>
												<div>
													<button
														onClick={() => {
															setIsCommenting(false);
														}}
														type="reset"
														className="btn btn-ghost ml-3"
													>
														Clear and Cancel
													</button>
													<button type="submit" className="btn btn-primary">
														Post
													</button>
												</div>
											</div>
										</form>
									</>
								)}
							</div>

							<div className="divider" />

							{blogData.comments.length > 0 ? (
								<div className="mt-10 flex flex-col gap-5">
									{blogData.comments.map((comment, index: number) => (
										<div
											className="p-5 rounded-btn flex gap-2"
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
													className="w-12 h-12 mask mask-squircle bg-primary"
													width={48}
													height={48}
												/>
											</Link>
											<div className="flex flex-col w-full rounded-btn p-3 bg-base-300">
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
												</>
											)}
										</div>
									))}
								</div>
							) : (
								<div className="mt-10 lg:p-5 flex flex-col gap-5">
									<p className="opacity-50 text-center">No comments yet!</p>
								</div>
							)}
						</div>
					</motion.main>

					<AnimatePresence mode="wait">
						{JSON.stringify(tempData) !== JSON.stringify(blogData) && (
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
										onClick={() => handleUpdateBlog(tempData.id)}
										className="btn btn-primary"
									>
										Save Changes
									</button>
									<button
										onClick={() => {
											setTempData(blogData);
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
				</>
			)} */}

			<AnimatePresence mode="wait">
				{JSON.stringify(tempData) !== JSON.stringify(blogData) && (
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
								onClick={() => handleUpdateBlog(tempData.id)}
								className="btn btn-primary"
							>
								Save Changes
							</button>
							<button
								onClick={() => {
									setTempData(blogData);
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
							onClick={() => handleDeleteBlog(blogData.id)}
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

export default ProvBlogPostPage;
