import { FiArrowUp, FiMessageSquare } from "react-icons/fi";
import { FormEvent, useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { IUserHunter, THunterBlogPost } from "@/lib/types";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MdDelete } from "react-icons/md";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import rehypeRaw from "rehype-raw";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";
import { uuid } from "uuidv4";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { id } = query;

	const { data: blogData, error } = await supabase
		.from("public_posts")
		.select(
			"id,content,comments,createdAt,updatedAt,uploader(id,full_name,username),upvoters",
		)
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

const BlogPage: NextPage<{ blogData: THunterBlogPost }> = ({ blogData }) => {
	const [isLiked, setIsLiked] = useState(false);
	const [isCommenting, setIsCommenting] = useState(false);
	const currentUser = useStore($accountDetails) as IUserHunter;
	const router = useRouter()

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
			.eq("id", blogData?.id)
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
				.eq("id", blogData?.id);

			if (removeUpvoteError) {
				console.log(removeUpvoteError);
				return;
			}

			setIsLiked(false);
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
			.eq("id", blogData?.id);

		if (addUpvoteError) {
			console.log(addUpvoteError);
			return;
		}

		setIsLiked(true);
		toast.dismiss();
		blogData.upvoters = newUpvoters;
	};

	const handleDeleteComment = async (commentId: string) => {
		toast.loading("Processing...");

		const newComments = blogData.comments.filter(
			(comment) => comment.id !== commentId,
		);

		const { error } = await supabase
			.from("public_posts")
			.update({
				comments: newComments,
			})
			.eq("id", blogData.id);

		if (error) {
			toast.error("Something went wrong");
			return;
		}

		toast.dismiss();
		router.reload()
	}

	useEffect(() => {
		if (blogData) {
			checkIfLiked(blogData.upvoters);
		}
	});

	return (
		<>
			{!!blogData && !!currentUser && (
				<>
					<motion.main
						variants={AnimPageTransition}
						initial="initial"
						animate="animate"
						exit="exit"
						className="relative min-h-screen w-full flex justify-center pt-24 pb-36"
					>
						<div className="w-full max-w-2xl">
							<div className="flex items-center gap-3 lg:bg-base-200 lg:p-5 lg:rounded-btn">
								<Link
									href={
										currentUser.id === blogData.uploader.id
											? "/me"
											: `/h/${blogData.uploader.username}`
									}
								>
									<Image
										src={`https://avatars.dicebear.com/api/bottts/${blogData.uploader.username}.svg`}
										alt="avatar"
										className="w-10 h-10 rounded-full"
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
							</div>

							<div className="mt-10 lg:p-5">
								<ReactMarkdown
									// components={markdownRenderer}
									rehypePlugins={[rehypeRaw]}
									className="prose prose-a:text-primary prose-lead:underline underline-offset-4"
								>
									{blogData.content}
								</ReactMarkdown>
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

							{/* add comment section */}
							<AnimatePresence mode="wait">
								{isCommenting && (
									<motion.div
										key={`comment-section-${isCommenting}`}
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{
											opacity: 1,
											scale: 1,
											transition: { duration: 0.2, ease: "circOut" },
										}}
										className="mt-10 lg:p-5"
									>
										<div className="flex items-center gap-3">
											<Image
												src={`https://avatars.dicebear.com/api/bottts/${currentUser.username}.svg`}
												alt="avatar"
												className="w-10 h-10 rounded-full"
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
												let commentContent = document.getElementById("commentContent") as HTMLTextAreaElement;

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
													type="reset" className="btn btn-ghost ml-3">
														Clear and Cancel
													</button>
													<button type="submit" className="btn btn-primary">
														Post
													</button>
												</div>
											</div>
										</form>
									</motion.div>
								)}
							</AnimatePresence>

							<div className="divider" />

							{/* comments */}
							{blogData.comments ? (
								<div className="mt-10 lg:p-5 flex flex-col gap-5">
									{blogData.comments.map((comment) => (
										<div
											key={comment.id}
											className="flex flex-col bg-base-200 p-5 rounded-btn gap-3"
										>
											<div className="flex items-center gap-3">
												<Image
													src={`https://avatars.dicebear.com/api/bottts/${comment.commenter.username}.svg`}
													alt="avatar"
													className="w-10 h-10 rounded-full"
													width={40}
													height={40}
												/>

												<div className="flex flex-col gap-1">
													<p className=" font-semibold leading-none">
														{comment.commenter.full_name.first}{" "}
														{comment.commenter.full_name.last}
													</p>
													<p className="text-gray-500 text-sm leading-none">
														{dayjs(comment.createdAt).format(
															"MMMM D, YYYY - HH:mm",
														)}
													</p>
												</div>

												{
													// if the user is the commenter
													comment.commenter.id === currentUser.id && (
														<button
														onClick={() => {
															handleDeleteComment(comment.id)
														}}
														className="ml-auto btn btn-error">
															<MdDelete />
														</button>
													)
												}
											</div>

											<ReactMarkdown
												rehypePlugins={[rehypeRaw]}
												className="prose"
											>
												{comment.content}
											</ReactMarkdown>
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
				</>
			)}
		</>
	);
};

export default BlogPage;
