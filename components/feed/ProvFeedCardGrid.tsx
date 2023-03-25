import { IUserProvisioner, TProvBlogPost } from "@/lib/types";

import { $accountDetails } from "@/lib/globalStates";
import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdShare } from "react-icons/md";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { useStore } from "@nanostores/react";

const ProvFeedCardGrid: FC<{ item: TProvBlogPost }> = ({ item }) => {
	const _currentUser = useStore($accountDetails) as IUserProvisioner;

	return (
		<div className="flex flex-col p-5 rounded-btn bg-base-200 border-2 border-transparent hover:border-primary transition-all">
			<div className="flex items-center gap-2">
				<Link
					className="relative w-8 h-8 lg:w-10 lg:h-10 mask mask-squircle bg-primary "
					href={
						_currentUser.id === item.uploader.id
							? "/p/me"
							: `/drift/company?id=${item.uploader.id}`
					}
				>
					<Image
						src={item.uploader.avatar_url}
						alt="avatar"
						className="object-center object-cover"
						fill
					/>
				</Link>
				<div className="flex flex-col gap-1 justify-center">
					<p className="leading-none flex w-full">
						<Link
							href={
								_currentUser.id === item.uploader.id
									? "/p/me"
									: `/drift/company?id=${item.uploader.id}`
							}
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
				href={`/p/blog/post?id=${item.id}`}
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
						<MdShare />
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProvFeedCardGrid;
