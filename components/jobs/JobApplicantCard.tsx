import { FC, useState } from "react";
import { IUserHunter, TProvJobPost } from "@/lib/types";

import { FiLoader } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import rehypeRaw from "rehype-raw";

const JobApplicantCard: FC<{ applicant: IUserHunter }> = ({ applicant }) => {
	const [isClicked, setIsClicked] = useState(false);

	return (
		applicant && (
			<>
				{isClicked && (
					<div className="fixed z-40 inset-0 w-full h-screen flex justify-center items-center bg-base-100/80">
						<FiLoader className="text-xl animate-spin" />
					</div>
				)}

				<Link
					href={`/p/jobs/applicant-profile/${applicant.username}`}
					className="flex flex-col gap-2 p-4 bg-base-200 hover:bg-base-300 transition-all rounded-btn"
				>
					<div className="flex gap-2 items-center">
						<Image
							src={applicant.avatar_url}
							alt="avatar"
							className="w-12 h-12 mask mask-squircle bg-primary object-center object-cover"
							width={48}
							height={48}
						/>
						<div>
							<p className="font-bold leading-none">
								{applicant.full_name.first} {applicant.full_name.last}
							</p>
							<p className="opacity-50 leading-none">@{applicant.username}</p>
						</div>
					</div>

					<div className="flex flex-col gap-2 mt-5">
						<p className="text-sm opacity-50">Skills</p>
						<div className="flex flex-wrap gap-2">
							<span className="text-sm bg-base-200 rounded-btn px-2 py-1">
								{applicant.skill_primary}
							</span>
							{applicant.skill_secondary.map((skill, index) => (
								<span
									key={`skill_${index}`}
									className="text-sm bg-base-200 rounded-btn px-2 py-1"
								>
									{skill}
								</span>
							))}
						</div>
					</div>
				</Link>
			</>
		)
	);
};

export default JobApplicantCard;
