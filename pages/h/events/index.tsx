import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import Footer from "@/components/Footer";
import { IUserHunter } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { MdShare } from "react-icons/md";
import { NextPage } from "next";
import ProvFeedCardGrid from "@/components/feed/ProvFeedCardGrid";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import relativeTime from "dayjs/plugin/relativeTime";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useQueries } from "@tanstack/react-query";
import { useStore } from "@nanostores/react";

dayjs.extend(relativeTime);

const HunterEventPage: NextPage = () => {
	const _currentUser = useStore($accountDetails) as IUserHunter;

	const fetchEvents = async () => {
		const { data, error } = await supabase
			.from("public_provposts")
			.select("*,uploader(*)")
			.eq("type", "event")
			.order("createdAt", { ascending: false })
			.limit(10);

		if (error) {
			console.log(error);
			return [];
		}

		return data;
	};

	const [publicEvents] = useQueries({
		queries: [
			{
				queryKey: ["publicEvents"],
				queryFn: fetchEvents,
				refetchOnWindowFocus: false,
				refetchOnReconnect: true,
				enabled: !!_currentUser,
			},
		],
	});

	console.log(publicEvents);

	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				<p className="text-3xl mb-2">Public Event Announcements</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
					{publicEvents.isLoading &&
						Array(4)
							.fill("")
							.map((_, i) => (
								<div
									key={`eventcardloader_${i}`}
									style={{
										animationDelay: `${i * 0.15}s`,
									}}
									className="h-[200px] bg-slate-500/50 animate-pulse rounded-btn"
								/>
							))}

					{publicEvents.data && publicEvents.data.length > 0 ? (
						publicEvents.data.map((item, index) => (
							<div
								key={`publicevent_${index}`}
								className="flex flex-col p-5 rounded-btn bg-base-200 border-2 border-transparent hover:border-primary transition-all"
							>
								<div className="flex items-center gap-2">
									<Link
										className="relative w-8 h-8 lg:w-10 lg:h-10 mask mask-squircle bg-primary "
										href={`/drift/company?id=${item.uploader.id}`}
									>
										<Image
											src={
												item.uploader.avatar_url ??
												`https://api.dicebear.com/5.x/shapes/png?seed=${item.uploader.legalName}`
											}
											alt="avatar"
											className="object-center object-cover"
											fill
										/>
									</Link>
									<div className="flex flex-col gap-1 justify-center">
										<p className="leading-none flex w-full">
											<Link
												href={`/drift/company?id=${item.uploader.id}`}
												className="flex"
											>
												{item.uploader.legalName}
											</Link>
											<span className=" opacity-50 ml-1">
												posted {item.type === "event" ? "an event" : "a blog"}
											</span>
										</p>
										<p className="text-sm flex gap-2 leading-none">
											{/* <span className="opacity-50">@{item.uploader}</span> */}
											<span>{dayjs(item.createdAt).fromNow()}</span>
										</p>
									</div>
								</div>

								<Link
									href={`/h/events/post?id=${item.id}`}
									className="mt-5 h-[101px] overflow-hidden relative"
								>
									<div className="absolute w-full h-full bg-gradient-to-b from-transparent to-base-200" />
									<ReactMarkdown className="prose-sm prose-headings:text-xl -z-10">
										{`${item.content.slice(0, 500)}...`}
									</ReactMarkdown>
								</Link>
								<Link
									href={`/p/blog/post?id=${item.id}`}
									className="text-center pt-2 opacity-50 z-10"
								>
									Read more
								</Link>

								<div className="mt-5 flex justify-between items-center">
									<div className="flex gap-2">
										<p>
											Upvotes:{" "}
											<span className="text-primary font-bold">
												{item.upvoters.length}
											</span>
										</p>
									</div>
									<div className="flex gap-2">
										<button
											className="btn btn-ghost gap-2"
											onClick={() => {
												const baseURL = window.location.origin;
												const thisLink = `${baseURL}/h/feed/post?id=${item.id}`;
												navigator.clipboard.writeText(thisLink);
												toast("Link Shared");
											}}
										>
											<MdShare className="text-lg" />
										</button>
									</div>
								</div>
							</div>
						))
					) : (
						<p className="text-xl text-slate-500">No events found</p>
					)}
				</div>
			</motion.main>
		</>
	);
};

export default HunterEventPage;
