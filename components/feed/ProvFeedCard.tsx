import { FC } from "react";
import { IUserProvisioner } from "@/lib/types";
import Image from "next/image";
import dayjs from "dayjs";

interface BlogEventPostProps {
	content: string;
	createdAt: string | null;
	id: string;
	updatedAt: string | null;
	uploader: IUserProvisioner;
	upvoters: string[];
	type: "provblog" | "event";
}
const ProvFeedCard: FC<{ item: BlogEventPostProps }> = ({ item }) => {
	return (
		<>
			<div className="px-4 py-3 bg-base-300 rounded-btn flex justify-between items-center hover:bg-primary/50 transition-colors cursor-pointer">
				<div className="flex gap-2 items-center">
					<Image
						className="mask mask-squircle"
						src={
							item.uploader.avatar_url ??
							`https://api.dicebear.com/5.x/shapes/png?seed=${item.uploader.legalName}`
						}
						width={35}
						height={35}
						alt="avatar"
					/>
					<div className="flex flex-col">
						<p className="leading-none">
							<span className="text-primary">{item.uploader.legalName}</span>{" "}
							posted a {item.type === "provblog" ? "blog" : "event"} post
						</p>
						<p className="leading-none text-sm opacity-75">
							{dayjs(item.createdAt).format("MMMM DD, YYYY H:MMA")}
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProvFeedCard;
