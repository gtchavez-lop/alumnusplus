import { AnimatePresence, motion } from "framer-motion";
import { FiHeart, FiLoader, FiMessageSquare, FiMoreHorizontal, FiSend, FiTrash2, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";

import { $schema_blogComment } from "../../schemas/blog";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import __supabase from "../../lib/supabase";
import dayjs from "dayjs";
import rehypeRaw from "rehype-raw";
import toast from "react-hot-toast";
import { useClient } from "react-supabase";
import { useRouter } from "next/router";
import uuidv4 from "../../lib/uuidv4";

const markdownRederers = {
	ul: ({ children }) => <ul className="list-disc">{children}</ul>,
	ol: ({ children }) => <ol className="list-decimal">{children}</ol>,
	li: ({ children }) => <li className="ml-4">{children}</li>,
	h2: ({ children }) => <h2 className="text-2xl">{children}</h2>,
};

const FeedCard = ({ feedData, index }) => {
	const [commentOpen, setCommentOpen] = useState(false);
	const [contentOpen, setContentOpen] = useState(false);
	const [commentInput, setCommentInput] = useState("");
	const [isSelfPost, setIsSelfPost] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const [likeProcessing, setLikeProcessing] = useState(false);
	const supabase = useClient();
	const router = useRouter();

	const addComment = async () => {
		if (commentInput.length < 1) {
			toast.error("Please enter some content");
			return;
		}

		const newComment = $schema_blogComment;

		newComment.blogId = feedData.id;
		newComment.content = commentInput;
		newComment.createdAt = dayjs().format("YYYY-MM-DD HH:mm:ss");
		newComment.id = uuidv4();
		newComment.type = "comment";
		newComment.updatedAt = dayjs().format("YYYY-MM-DD HH:mm:ss");
		newComment.uploaderDetails = {
			firstName: supabase.auth.user().user_metadata.fullname.first,
			lastName: supabase.auth.user().user_metadata.fullname.last,
			middleName: supabase.auth.user().user_metadata.fullname.middle,
			username: supabase.auth.user().user_metadata.username,
		};
		newComment.userId = __supabase.auth.user().id;

		// add comment
		const { data, error } = await supabase
			.from("hunt_blog")
			.update({
				comments: [...feedData.comments, newComment],
			})
			.eq("id", feedData.id);

		if (error) {
			toast.error(error.message);
			return;
		} else {
			feedData.comments = [...feedData.comments, newComment];
			toast.success("Comment added");
			setCommentInput("");
		}
	};

	const likePost = async () => {
		setLikeProcessing(true);
		// fetch likes
		const { data: prevData, error: prevDataError } = await __supabase
			.from("hunt_blog")
			.select("upvoters")
			.single()
			.eq("id", feedData.id);

		const upvoters = [...prevData.upvoters];

		const isLiked = upvoters.findIndex((e) => e.userId === supabase.auth.user().id) !== -1;

		const newUpvoter = {
			blogId: feedData.id,
			createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			id: uuidv4(),
			type: "upvote",
			updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			userId: supabase.auth.user().id,
			upvoterDetails: {
				firstName: supabase.auth.user().user_metadata.fullname.first,
				lastName: supabase.auth.user().user_metadata.fullname.last,
				middleName: supabase.auth.user().user_metadata.fullname.middle,
				username: supabase.auth.user().user_metadata.username,
			},
		};

		if (isLiked) {
			const newList = prevData.upvoters.filter((item) => item.userId !== supabase.auth.user().id);

			// remove upvote
			const { error: newDataError } = await __supabase
				.from("hunt_blog")
				.update({
					upvoters: [...prevData.upvoters.filter((item) => item.userId !== supabase.auth.user().id)],
				})
				.eq("id", feedData.id);

			if (newDataError) {
				toast.error(error.message);
			} else {
				feedData.upvoters = prevData.upvoters.filter((item) => item.userId !== supabase.auth.user().id);

				toast.success("Upvote removed");
				setIsLiked(false);
			}
		} else {
			// add upvote
			const { error: newDataError } = await __supabase
				.from("hunt_blog")
				.update({
					upvoters: [...prevData.upvoters, newUpvoter],
				})
				.eq("id", feedData.id);

			if (newDataError) {
				toast.error(error.message);
			} else {
				feedData.upvoters = [...prevData.upvoters, newUpvoter];

				toast.success("Upvote added");
				setIsLiked(true);
			}
		}

		setLikeProcessing(false);
	};

	const handleDelete = async () => {
		const { error } = await __supabase.from("hunt_blog").delete().eq("id", feedData.id);

		if (error) {
			toast.error(error.message);
		} else {
			router.reload();
			toast.success("Post deleted");
		}
	};

	useEffect(() => {
		// check if the post is from the user
		if (supabase.auth.user().id === feedData.uploader.userId) {
			setIsSelfPost(true);
		}

		// check if user already liked the post
		const isLiked = feedData.upvoters.findIndex((e) => e.userId === supabase.auth.user().id) !== -1;
		setIsLiked(isLiked);
	}, []);

	return (
		feedData && (
			<>
				{/* comment section */}
				<AnimatePresence>
					{commentOpen && (
						<motion.main
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							onClick={(e) => {
								if (e.currentTarget === e.target) {
									setCommentOpen(false);
								}
							}}
							className="fixed w-full h-screen top-0 left-0 bg-base-300 bg-opacity-70 flex justify-end z-50"
						>
							<motion.div
								initial={{ x: 100 }}
								animate={{ x: 0, transition: { ease: "easeOut" } }}
								exit={{ x: 100, transition: { ease: "easeIn" } }}
								transition={{ duration: 0.2 }}
								className="bg-base-100 rounded-box w-full max-w-xl h-screen flex flex-col gap-2 p-4 lg:pt-24 pt-36 overflow-y-auto"
							>
								<div className="flex justify-between items-center">
									<p className="text-xl">Comments</p>
									<button onClick={() => setCommentOpen(false)} className="btn btn-circle btn-ghost">
										<FiX className="text-xl" />
									</button>
								</div>

								<div className="flex flex-col gap-2 pb-10">
									<div className="flex flex-col gap-2 my-10">
										<div className="flex items-center gap-2">
											<Image
												src={`https://avatars.dicebear.com/api/bottts/${
													supabase.auth.user().user_metadata.username
												}.svg`}
												width={45}
												height={45}
												className="rounded-full"
												alt="avatar"
											/>
											<div>
												<p className="leading-none">{supabase.auth.user().user_metadata.username}</p>
												<p className="text-xs opacity-50">{dayjs(feedData.createdAt).format("DD MMM YYYY H:mm a")}</p>
											</div>
										</div>
										<div className="flex gap-2 items-center mt-2">
											<input
												type="text"
												className="input input-bordered w-full"
												placeholder="Add a comment..."
												value={commentInput}
												onChange={(e) => setCommentInput(e.target.value)}
												onKeyUp={(e) => {
													if (e.key === "Enter") {
														addComment();
													}
												}}
											/>
											<button onClick={addComment} className="btn btn-square btn-primary">
												<FiSend />
											</button>
										</div>
									</div>
									{feedData.comments?.map((comment, index) => {
										return (
											<div key={comment.id} className="border-2 rounded-box">
												<div className="flex flex-col p-2">
													<div className="flex gap-2 items-center">
														<Image
															src={`https://avatars.dicebear.com/api/bottts/${comment.uploaderDetails.username}.svg`}
															width={45}
															height={45}
															className="rounded-full"
															alt="avatar"
														/>
														<div>
															<p className="leading-none">{comment.uploaderDetails.username}</p>
															<p className="text-xs opacity-50">
																{dayjs(comment.createdAt).format("DD MMM YYYY hh:mm a")}
															</p>
														</div>
													</div>

													<p className="mt-2 p-2">{comment.content}</p>
												</div>
											</div>
										);
									})}

									{feedData.comments.length === 0 && <p className="mt-10">No comments yet</p>}
								</div>
							</motion.div>
						</motion.main>
					)}
				</AnimatePresence>

				{/* content section */}
				<AnimatePresence>
					{contentOpen && (
						<motion.main
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							onClick={(e) => {
								if (e.currentTarget === e.target) {
									setContentOpen(false);
								}
							}}
							className="fixed w-full h-screen top-0 left-0 bg-base-300 bg-opacity-70 flex justify-end z-[40]"
						>
							<motion.div
								initial={{ x: 100 }}
								animate={{ x: 0, transition: { ease: "easeOut" } }}
								exit={{ x: 100, transition: { ease: "easeIn" } }}
								transition={{ duration: 0.2 }}
								className="bg-base-100 rounded-box w-full max-w-xl h-screen flex flex-col gap-2 p-4 lg:pt-24 pt-36"
							>
								<div className="flex justify-between items-center">
									<p className="text-xl">Content</p>
									<button onClick={() => setContentOpen(false)} className="btn btn-circle btn-ghost">
										<FiX className="text-xl" />
									</button>
								</div>
								<div className="flex items-center">
									<Image
										src={`https://avatars.dicebear.com/api/bottts/${feedData.uploader.username}.svg`}
										width={45}
										height={45}
										className="rounded-full"
										alt="avatar"
									/>
									<div className="flex flex-col ml-2">
										<p className="leading-none">{feedData.uploader.username}</p>
										<p className="text-xs opacity-50">{dayjs(feedData.created_at).format("DD MMM YYYY hh:mm a")}</p>
									</div>
								</div>
								<div className="p-4 ">
									<ReactMarkdown
										className="flex flex-col "
										components={markdownRederers}
										skipHtml={false}
										rehypePlugins={[rehypeRaw]}
									>
										{feedData.content}
									</ReactMarkdown>
								</div>
								<div className="divider mb-0 pb-0" />
								{/* action buttons */}
								<div className="flex gap-2 items-center">
									{likeProcessing ? (
										<button className="btn btn-ghost gap-2" disabled={true}>
											<FiLoader className="animate-spin" />
										</button>
									) : (
										<button className="btn btn-ghost gap-2" onClick={likePost}>
											<FiHeart className={isLiked && "fill-red-500 stroke-red-500"} />
											{feedData.upvoters.length > 0 ? feedData.upvoters.length : null}
										</button>
									)}
									{/* comment button */}
									<button className="btn btn-ghost gap-2" onClick={() => setCommentOpen(true)}>
										<FiMessageSquare />
										{feedData.comments.length > 0 ? feedData.comments.length : null}
									</button>
									{feedData.uploader.email === supabase.auth.user().email && (
										<label htmlFor="deletePostModal" className="btn btn-error btn-sm ml-auto">
											<FiTrash2 />
											<span className="ml-2">Delete Post</span>
										</label>
									)}
								</div>
								<p className="text-right text-sm opacity-50 max-w-lg self-end">
									Some actions like share and report are not yet implemented. <br />
									Please come back later.
								</p>

								{/* user only action buttons */}
							</motion.div>
						</motion.main>
					)}
				</AnimatePresence>

				{/* cards */}
				<motion.div
					key={`post_${index + 1}`}
					animate={{ opacity: [0, 1], y: [10, 0] }}
					transition={{
						duration: 0.5,
						ease: "circOut",
						delay: (index + 1) * 0.1,
					}}
					className={"rounded-box min-h-[250px] py-3 px-4 flex flex-col gap-2 opacity-0 border-primary border-2"}
				>
					<div className="flex items-center gap-2">
						<div className="relative">
							<Image
								width={40}
								height={40}
								priority={true}
								className="rounded-full bg-base-100"
								alt="profile"
								src={`https://avatars.dicebear.com/api/bottts/${feedData.uploader.username}.svg`}
							/>
						</div>
						<div className="flex flex-col">
							<Link href={isSelfPost ? "/me" : `/hunter/${feedData.uploader.username}`}>
								<p className="text-sm leading-none">
									{feedData.uploader.firstName}{" "}
									{feedData.uploader.lastName}
								</p>
							</Link>
							<p className="text-xs opacity-60 leading-none">@{feedData.uploader.username}</p>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<p className="text-xs opacity-70 ml-2 mt-2">{dayjs(feedData.created_at).format("MMM D YYYY | HH:MM A")}</p>
						<div
							className="px-2 max-h-full overflow-ellipsis cursor-pointer relative"
							onClick={() => setContentOpen(true)}
						>
							<div className="absolute top-0 left-0 w-full h-full bg-base-100 opacity-0 hover:opacity-80 transition-all flex justify-center items-center">
								<p>See More</p>
							</div>
							<ReactMarkdown
								className="flex flex-col min-h-[100px] max-h-[100px] truncate"
								components={markdownRederers}
								skipHtml={false}
								rehypePlugins={[rehypeRaw]}
							>
								{feedData.content}
							</ReactMarkdown>
						</div>
					</div>
					<div className="flex gap-2 items-center mt-auto">
						{likeProcessing ? (
							<button className="btn btn-ghost gap-3" disabled={true}>
								{/* <FiHeart className={isLiked && "fill-red-500 stroke-red-500"} /> */}
								<FiLoader className="animate-spin" />
							</button>
						) : (
							<button onClick={likePost} className="btn btn-ghost gap-3">
								<FiHeart className={isLiked && "fill-red-500 stroke-red-500"} />
								{feedData.upvoters.length > 0 ? feedData.upvoters.length : null}
							</button>
						)}
						<button onClick={(e) => setCommentOpen(!commentOpen)} className="btn btn-ghost gap-3">
							<FiMessageSquare />
							{feedData.comments.length > 0 ? feedData.comments.length : null}
						</button>
						<button onClick={() => setContentOpen(true)} className="btn btn-ghost btn-square ml-auto">
							<FiMoreHorizontal />
						</button>
					</div>
				</motion.div>

				{/* delete modal */}
				<input type="checkbox" id="deletePostModal" className="modal-toggle" />
				<div className="modal">
					<div className="modal-box">
						<div className="flex justify-between items-center mb-5">
							<h5 className="text-2xl">Delete Post</h5>
							<label htmlFor="deletePostModal" className="btn btn-ghost">
								<FiX />
							</label>
						</div>
						<div className="modal-body mb-10">
							<div className="text-lg">Are you sure?</div>
							<p>This action cannot be undone. This will permanently delete this post.</p>
						</div>
						<div className="flex justify-end items-center">
							<div className="flex gap-2">
								<button className="btn btn-error" onClick={handleDelete}>
									Delete
								</button>
								<label htmlFor="deletePostModal" className="btn btn-ghost">
									Cancel
								</label>
							</div>
						</div>
					</div>
				</div>
			</>
		)
	);
};

export default FeedCard;
