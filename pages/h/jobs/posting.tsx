import { FC, useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { IUserHunter, IUserProvisioner, TProvJobPost } from "@/lib/types";
import {
	MdArrowBack,
	MdCheck,
	MdCheckBox,
	MdFavorite,
	MdOutlineFavorite,
} from "react-icons/md";
import { motion, useScroll } from "framer-motion";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { FiArrowDown } from "react-icons/fi";
import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import dayjs from "dayjs";
import { link } from "fs";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { id } = context.query;

	const { data, error } = await supabase
		.from("public_jobs")
		.select("*,uploader:uploader_id(*)")
		.eq("id", id)
		.single();

	if (error) {
		console.log(error);
		return {
			props: {
				jobData: null,
			},
		};
	}

	return {
		props: {
			jobData: data as unknown as TProvJobPost,
		},
	};
};

interface LocalProvJobPost extends TProvJobPost {
	uploader: IUserProvisioner;
}

const JobPage: NextPage<{ jobData: LocalProvJobPost }> = ({ jobData }) => {
	const _currentUser = useStore($accountDetails) as IUserHunter;
	const [isFavorite, setIsFavorite] = useState(false);
	const [isApplied, setIsApplied] = useState(false);
	const router = useRouter();

	const handleFavorite = async () => {
		if (isFavorite) {
			const newFaveList = _currentUser.saved_jobs.filter(
				(job) => job !== jobData.id,
			);
			const { error } = await supabase
				.from("user_hunters")
				.update({ saved_jobs: newFaveList })
				.eq("id", _currentUser.id);
			if (error) {
				console.log(error);
				toast.error(error.message);
				return;
			} else {
				toast.success("Removed to Saved jobs");
				setIsFavorite(false);
				$accountDetails.set({
					..._currentUser,
					saved_jobs: newFaveList,
				});
			}
		} else {
			const newFaveList = [..._currentUser.saved_jobs, jobData.id];
			const { error } = await supabase
				.from("user_hunters")
				.update({ saved_jobs: newFaveList })
				.eq("id", _currentUser.id);
			if (error) {
				console.log(error);
				toast.error(error.message);
				return;
			} else {
				toast.success("Added to Saved jobs");
				setIsFavorite(true);
				$accountDetails.set({
					..._currentUser,
					saved_jobs: newFaveList,
				});
			}
		}
	};

	useEffect(() => {
		if (_currentUser && jobData) {
			const isFav = _currentUser.saved_jobs.includes(jobData.id);
			setIsFavorite(isFav);
			const isApply = _currentUser.applied_jobs?.includes(jobData.id);
			setIsApplied(isApply);
		}
	}, [_currentUser, jobData, isFavorite]);

	return (
		jobData && (
			<>
				<motion.main
					variants={AnimPageTransition}
					initial="initial"
					animate="animate"
					exit="exit"
					className="relative min-h-screen w-full flex flex-col gap-10 py-24"
				>
					<div className="flex items-center gap-2">
						<button
							className="btn btn-square btn-primary btn-ghost"
							onClick={() => router.back()}
						>
							<MdArrowBack className="text-2xl" />
						</button>
						<p>Go Back</p>
					</div>

					<div>
						<h1 className="text-3xl font-bold">{jobData.job_title}</h1>
						<p className="text-lg">
							Posted at {dayjs(jobData.created_at).format("MMMM DD YYYY")}
						</p>
						<p className="opacity-75">{jobData.job_location}</p>
						<p className="opacity-75">{jobData.job_type}</p>

						{/* apply button */}
						<div className="flex gap-2 mt-5 justify-end">
							{isApplied || _currentUser.activeJob ? (
								<button className="btn btn-primary gap-2" disabled>
									<MdCheck className="text-lg" />
									{isApplied && "Applied"}
									{_currentUser.activeJob && "You have an active job"}
								</button>
							) : (
								<Link
									href={`/h/jobs/apply?id=${jobData.id}`}
									className="btn btn-primary"
								>
									Apply Now
								</Link>
							)}

							<button onClick={handleFavorite} className="btn btn-ghost gap-2">
								<MdFavorite
									className={`text-lg ${isFavorite && "text-red-500"}`}
								/>
								{isFavorite ? "Remove from Saved" : "Save Job"}
							</button>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div>
							<div className="flex flex-col gap-5">
								<div className="flex flex-col gap-2">
									<h2 className="text-xl font-bold underline underline-offset-4">
										About the Company
									</h2>
									<ReactMarkdown className="prose">
										{jobData.uploader.shortDescription}
									</ReactMarkdown>
								</div>

								<div className="flex flex-col gap-2">
									<h2 className="text-xl font-bold underline underline-offset-4">
										About the Job
									</h2>
									<ReactMarkdown className="prose">
										{jobData.short_description}
									</ReactMarkdown>
								</div>

								<div className="flex flex-col gap-2">
									<h2 className="text-xl font-bold underline underline-offset-4">
										Skill Profile
									</h2>
									<div className="flex gap-2 flex-wrap">
										{jobData.job_skills.map((skill, index) => (
											<p key={`skill_${index}`} className="badge badge-primary">
												{skill}
											</p>
										))}
									</div>
								</div>

								<div className="flex flex-col gap-2">
									<h2 className="text-xl font-bold underline underline-offset-4">
										Job Qualifications
									</h2>
									<ul className="flex gap-2 flex-wrap list-disc pl-7">
										{jobData.job_qualifications.map((qual, index) => (
											<li key={`qualification_${index}`} className="">
												{qual}
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
						<div>
							<div className="flex flex-col gap-5">
								<div className="flex flex-col gap-2">
									<h2 className="text-xl font-bold underline underline-offset-4">
										Full Description
									</h2>
									<ReactMarkdown className="prose p-3 border-2 border-primary rounded-btn border-opacity-25">
										{jobData.full_description}
									</ReactMarkdown>
								</div>
							</div>
						</div>
					</div>
				</motion.main>
			</>
		)
	);
};

export default JobPage;
