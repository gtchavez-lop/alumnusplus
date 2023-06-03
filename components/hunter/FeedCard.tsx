import { FiMessageSquare, FiPlus, FiShare2 } from "react-icons/fi";

import { FC } from "react";
import ReactMarkdown from 'react-markdown'
import { THunterBlogPost } from "@/lib/types";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const FeedCard: FC<{ data: THunterBlogPost }> = ({ data }) => {
	return (
		<article className="flex flex-col gap-3 p-4 bg-base-200 rounded-btn">
			<div className="flex items-center gap-2">
				<img
					src={data.uploader.avatar_url ?? "https://via.placeholder.com/100"}
					className="avatar rounded-full w-12 h-12"
					alt=""
				/>
				<div className="flex flex-col flex-1">
					<div className="flex gap-1 font-semibold ">
						<p className="cursor-pointer hover:underline underline-offset-4">
							@{data.uploader.username}
						</p>
						<p className="opacity-50">{data.uploader.full_name.first} {data.uploader.full_name.last}</p>
					</div>
					<p className="opacity-50 text-sm">{dayjs(data.createdAt).fromNow()}</p>
				</div>
			</div>
			<div className="prose prose-sm p-2 mt-2 max-h-[250px] overflow-hidden relative">
				<ReactMarkdown>{data.content}</ReactMarkdown>
				<div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-base-200 via-transparent to-transparent" />
			</div>

			<div className="divider my-0 mt-5" />
			<div className="flex items-center gap-3">
				<button
					type="button"
					className="btn btn-ghost btn-sm items-center gap-2"
					aria-label="Like"
				>
					<FiPlus />
					Upvote
				</button>
				<button
					type="button"
					className="btn btn-ghost btn-sm items-center gap-2"
					aria-label="Comment"
				>
					<FiMessageSquare />
					Comment
				</button>
				<button
					type="button"
					className="btn btn-ghost btn-sm ml-auto items-center gap-2"
					aria-label="Share"
				>
					<FiShare2 />
					Share
				</button>
			</div>
		</article>
	);
};

export default FeedCard;
