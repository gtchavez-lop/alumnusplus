import {
	Component,
	ElementType,
	EventHandler,
	FC,
	MouseEvent,
	MouseEventHandler,
	SyntheticEvent,
	useEffect,
	useState,
} from "react";
import {
	FiArrowUp,
	FiLoader,
	FiMessageSquare,
	FiMoreHorizontal,
	FiX,
} from "react-icons/fi";
import { IUserHunter, THunterBlogPost } from "@/lib/types";

import { $accountDetails } from "@/lib/globalStates";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import rehypeRaw from "rehype-raw";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useSession } from "@supabase/auth-helpers-react";
import { useStore } from "@nanostores/react";

const FeedCard: FC<{ blogData: THunterBlogPost }> = ({ blogData }) => {
	const [isLiked, setIsLiked] = useState(false);
	const [commentsOpen, setCommentsOpen] = useState(false);
	const [isMoreOpen, setIsMoreOpen] = useState(false);
	const { route } = useRouter();
	const currentUser = useStore($accountDetails) as IUserHunter;

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

	useEffect(() => {
		checkIfLiked();
	});

	return (
		<>
			<motion.div className="flex flex-col p-5 rounded-btn bg-base-200">
				<div className="flex gap-3">
					<Link
						href={
							currentUser.id === blogData.uploader.id
								? "/h/me"
								: `/h/${blogData.uploader.username}`
						}
					>
						<Image
							src={`https://avatars.dicebear.com/api/bottts/${blogData.uploader.username}.svg`}
							alt="avatar"
							className="w-12 h-12 p-1 mask mask-squircle bg-primary"
							width={48}
							height={48}
						/>
					</Link>
					<div className="flex flex-col gap-1 justify-center">
						<p className="leading-none">
							<Link
								href={
									currentUser.id === blogData.uploader.id
										? "/h/me"
										: `/h/${blogData.uploader.username}`
								}
							>
								{blogData.uploader.full_name.first}{" "}
								{blogData.uploader.full_name.last}{" "}
							</Link>
							<span className="text-primary opacity-50">posted</span>
						</p>
						<p className="text-sm flex gap-2 leading-none">
							<span className="opacity-50">@{blogData.uploader.username}</span>
							<span>
								{dayjs(blogData.createdAt).format("MMM DD YYYY h:MM A")}
							</span>
						</p>
					</div>
				</div>

				<div className="mt-5 h-[101px] overflow-hidden">
					<ReactMarkdown
						// components={markdownRenderer}
						rehypePlugins={[rehypeRaw]}
						className="prose-sm prose-headings:text-xl "
					>
						{`${blogData.content.slice(0, 200)}...`}
					</ReactMarkdown>
				</div>

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
								setCommentsOpen(blogData.comments?.length > 0 ? true : false)
							}
							className="btn btn-ghost"
						>
							<FiMessageSquare className="font-bold" />
							<span className="ml-2">{blogData.comments?.length ?? 0}</span>
						</motion.button>
					</div>
					<div className="md:hidden dropdown dropdown-top dropdown-end">
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
					</div>
					<div className="md:flex gap-2 hidden ">
						{!isMoreOpen ? (
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
						)}
						<button
							className="btn btn-ghost"
							onClick={() => {
								const thisLink = `${route}/h/feed/${blogData.id}`;
								navigator.clipboard.writeText(thisLink);
								toast("Link Shared");
							}}
						>
							Share
						</button>
					</div>
				</div>
			</motion.div>

			{/* comments */}
			<AnimatePresence mode="wait">
				{commentsOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{
							opacity: 1,
							transition: { duration: 0.2, ease: "circOut" },
						}}
						exit={{
							opacity: 0,
							transition: { duration: 0.2, ease: "circIn" },
						}}
						onClick={(e) =>
							e.target === e.currentTarget && setCommentsOpen(false)
						}
						className="fixed top-0 left-0 z-50 w-full h-screen px-5 lg:px-0 pt-24 pb-16 bg-base-100 flex justify-center"
					>
						<motion.div
							initial={{ y: 20 }}
							animate={{ y: 0, transition: { duration: 0.2, ease: "circOut" } }}
							exit={{ y: 20, transition: { duration: 0.2, ease: "circIn" } }}
							className="w-full max-w-xl"
						>
							{/* top action buttons */}
							<div className="flex justify-between items-center">
								<motion.h1
									animate={{
										opacity: [0, 1],
										x: [-50, 0],
										transition: { delay: 0.2, duration: 0.2, ease: "circOut" },
									}}
									className="text-2xl font-bold"
								>
									Comments
								</motion.h1>
								<motion.button
									layoutId={`closebutton-${blogData.id}`}
									onClick={() => setCommentsOpen(false)}
									className="btn btn-ghost"
								>
									<FiX />
								</motion.button>
							</div>
							<p>
								You can comment by clicking the &quot;Read More&quot; button
							</p>

							{/* comments */}
							<motion.div
								animate={{
									opacity: [0, 1],
									y: [50, 0],
									transition: { delay: 0.3, duration: 0.2, ease: "circOut" },
								}}
								className="mt-5 flex flex-col gap-2"
							>
								{blogData.comments.map((comment, index) => (
									<div
										className="p-3 bg-base-200 rounded-btn"
										key={`comment_${index}`}
									>
										{/* commenter */}
										<div className="flex gap-3">
											<Image
												src={`https://avatars.dicebear.com/api/bottts/${comment.commenter.username}.svg`}
												alt="avatar"
												className="w-10 h-10"
												width={40}
												height={40}
											/>
											<div className="flex flex-col gap-1 justify-center">
												<p className="leading-none">
													{comment.commenter.full_name.first}{" "}
													{comment.commenter.full_name.last}{" "}
													<span className="text-primary opacity-50">
														commented
													</span>
												</p>
												<p className="opacity-50 leading-none">
													{comment.commenter.username}
												</p>
											</div>
										</div>
										{/* content */}
										<div className="mt-5">
											<ReactMarkdown
												// components={markdownRenderer}
												rehypePlugins={[rehypeRaw]}
												className="prose"
											>
												{comment.content}
											</ReactMarkdown>
										</div>
									</div>
								))}
							</motion.div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default FeedCard;
