import { IUserHunter, THunterBlogPost } from "@/lib/types";
import { FormEvent, useLayoutEffect, useState } from "react";
import { FiLoader, FiMessageSquare } from "react-icons/fi";
import {
	MdCheckCircleOutline,
	MdFavorite,
	MdFavoriteBorder,
	MdReport,
	MdShare,
} from "react-icons/md";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

import { $accountDetails } from "@/lib/globalStates";
import { supabase } from "@/lib/supabase";
import emailjs from "@emailjs/browser";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useStore } from "@nanostores/react";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { DialogTrigger } from "@radix-ui/react-dialog";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeRaw from "rehype-raw";
import { toast } from "sonner";
import { uuid } from "uuidv4";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

dayjs.extend(relativeTime);

interface Props {
	blogData: THunterBlogPost;
	refetchData: Function;
}

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

const FeedCard = ({ blogData, refetchData }: Props) => {
	const [isLiked, setIsLiked] = useState(false);
	const [commentsOpen, setCommentsOpen] = useState(false);
	const currentUser = useStore($accountDetails) as IUserHunter;
	const [cardRef] = useAutoAnimate<HTMLDivElement>();
	const [isClicked, setIsClicked] = useState(false);

	const [showModal, setShowModal] = useState(false);

	const sendEmail = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		if (!(form.user_name.value && form.user_vio.value && form.user_msg.value)) {
			toast.error("all fields are required");
			return;
		}

		emailjs
			.sendForm(
				"service_4310hrm",
				"template_4j7dmmb",
				form,
				"TJt6Hz9Y176DgEzZZ",
			)
			.then(
				(result) => {
					console.log(result.text);
				},
				(error) => {
					console.log(error.text);
				},
			);
		form.reset();
		setShowModal(false);

		toast.success("Your Report has been Sent");
	};

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
		const commentContent = e.currentTarget[0] as HTMLTextAreaElement;

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

	useLayoutEffect(() => {
		checkIfLiked();
	});

	return (
		<>
			{isClicked && (
				<div className="fixed z-40 bg-base-100/75 inset-0 w-screen h-screen flex justify-center items-center">
					<FiLoader className="text-xl animate-spin" />
				</div>
			)}

			<div className="flex flex-col p-5 rounded-xl bg-secondary w-full">
				<div className="flex items-center gap-2">
					<Link
						className="relative w-8 h-8 lg:w-10 lg:h-10"
						href={
							currentUser.id === blogData.uploader.id
								? "/h/me"
								: `/h?user=${blogData.uploader.username}`
						}
					>
						<Avatar>
							<AvatarFallback>
								{blogData.uploader.full_name.first[0]}
								{blogData.uploader.full_name.last[0]}
							</AvatarFallback>
							<AvatarImage src={blogData.uploader.avatar_url} />
						</Avatar>
					</Link>
					<div className="flex flex-col gap-1 justify-center">
						<p className="leading-none flex w-full">
							<Link
								href={
									currentUser.id === blogData.uploader.id
										? "/h/me"
										: `/h?user=${blogData.uploader.username}`
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
							<span>{dayjs(blogData.createdAt).fromNow()}</span>
						</p>
					</div>
				</div>

				<Link
					href={`/h/feed/post?id=${blogData.id}`}
					className="mt-5 h-[101px] overflow-hidden relative"
					onClick={() => setIsClicked(true)}
				>
					<div className="absolute w-full h-full bg-gradient-to-b from-transparent to-secondary" />
					<ReactMarkdown
						rehypePlugins={[rehypeRaw]}
						className="prose-sm prose-headings:text-xl -z-10"
					>
						{`${blogData.content.slice(0, 500)}...`}
					</ReactMarkdown>
				</Link>
				<Link
					href={`/h/feed/post?id=${blogData.id}`}
					className="text-center pt-2 opacity-50 z-10"
					onClick={() => setIsClicked(true)}
				>
					Read more
				</Link>

				<div className="mt-5 flex justify-between">
					<div className="flex gap-2">
						<Button onClick={upvoteHandler} variant="ghost" className="gap-2">
							{isLiked ? (
								<MdFavorite className="text-lg text-red-500" />
							) : (
								<MdFavoriteBorder className="text-lg " />
							)}
							{blogData.upvoters ? blogData.upvoters.length : 0}
						</Button>

						<Button
							variant="ghost"
							size="icon"
							onClick={() =>
								setCommentsOpen(
									blogData.comments?.length ? !commentsOpen : true,
								)
							}
							className="gap-2"
						>
							<FiMessageSquare className="font-bold" />
							{blogData.comments?.length ?? 0}
						</Button>
					</div>

					{/* report a user */}
					<div className="flex gap-2">
						<Dialog>
							<DialogTrigger>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => setShowModal(!showModal)}
										>
											<MdReport className="text-lg text-yellow-500" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>Report Content</TooltipContent>
								</Tooltip>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Report Content</DialogTitle>
									<DialogDescription>
										Tell us why you want to report this content. This action
										can&apos;t be undone.
									</DialogDescription>
								</DialogHeader>
								<form onSubmit={sendEmail} className="flex flex-col gap-y-4">
									<div className="flex flex-col">
										<label className="text-sm">
											Name of the user you want to report
										</label>
										<Input
											type="text"
											placeholder="John Doe"
											name="user_name"
										/>
									</div>

									<div className="flex flex-col">
										<label className="text-sm">Reason</label>
										<Textarea
											placeholder="Please tell us the problem"
											rows={4}
											className="textarea textarea-primary textarea-bordered"
											name="user_msg"
										/>
									</div>

									<Button variant="destructive" type="submit">
										Submit Report
									</Button>
								</form>
							</DialogContent>
						</Dialog>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => {
										const baseURL = window.location.origin;
										const thisLink = `${baseURL}/h/feed/post?id=${blogData.id}`;
										navigator.clipboard.writeText(thisLink);
										toast("Link Shared");
									}}
								>
									<MdShare />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Share Post</TooltipContent>
						</Tooltip>
					</div>
				</div>

				{/* <div ref={cardRef}>
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
													: `/h?user=${comment.commenter.username}`
											}
										>
											<Avatar>
												<AvatarFallback>
													{comment.commenter.full_name.first[0]}
													{comment.commenter.full_name.last[0]}
												</AvatarFallback>
												<AvatarImage src={comment.commenter.avatar_url} />
											</Avatar>
										</Link>

										<div className="flex flex-col bg-base-100 w-full rounded-btn p-3">
											<Link
												href={
													currentUser.id === comment.commenter.id
														? "/h/me"
														: `/h?user=${comment.commenter.username}`
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
												rehypePlugins={[rehypeRaw]}
												className="prose pb-0 break-words"
											>
												{comment.content}
											</ReactMarkdown>
										</div>
										{currentUser.id === blogData.uploader.id && (
											<>
												<Dialog>
													<DialogTrigger>
														<Button variant="ghost" size="icon">
															<MdDelete className="text-lg text-red-500" />
														</Button>
													</DialogTrigger>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>Confirm Delete Comment</DialogTitle>
															<DialogDescription>
																Are you sure you want to delete this comment?
																This action can&apos;t be undone.
															</DialogDescription>
														</DialogHeader>
														<DialogFooter className="space-x-3">
															<Button variant="ghost">Cancel</Button>
															<Button
																variant="destructive"
																onClick={() => removeComment(comment.id)}
															>
																Delete
															</Button>
														</DialogFooter>
													</DialogContent>
												</Dialog>
											</>
										)}
									</div>
								) : null,
							)}
							<form onSubmit={(e) => handleComment(e)}>
								<div className="flex gap-2 mt-5">
									<Link
										href={
											currentUser.id === blogData.uploader.id
												? "/h/me"
												: `/h?user=${currentUser.username}`
										}
									>
										<Avatar>
											<AvatarFallback>
												{currentUser.full_name.first[0]}
												{currentUser.full_name.last[0]}
											</AvatarFallback>
											<AvatarImage src={currentUser.avatar_url} />
										</Avatar>
									</Link>
									<div className="flex flex-col bg-base-100 w-full rounded-btn">
										<Textarea
											className="w-full"
											placeholder="Write a comment..."
											rows={1}
											name="commentContent"
										/>
										<Button className="ml-auto mt-3" type="submit">
											Comment
										</Button>
									</div>
								</div>
							</form>
						</div>
					)}
				</div> */}
			</div>
		</>
	);
};

export default FeedCard;
