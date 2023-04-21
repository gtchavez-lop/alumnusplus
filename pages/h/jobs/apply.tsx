import { FC, useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { IUserHunter, IUserProvisioner, TProvJobPost } from "@/lib/types";
import {
	MdCheck,
	MdCheckBox,
	MdFavorite,
	MdOutlineFavorite,
	MdSend,
} from "react-icons/md";
import { motion, useScroll } from "framer-motion";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { FiArrowDown } from "react-icons/fi";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import dayjs from "dayjs";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";

interface LocalProvJobPost extends TProvJobPost {
	uploader: IUserProvisioner;
}

const ApplyPage = () => {
	const _currentUser = useStore($accountDetails) as IUserHunter;
	const [isApplied, setIsApplied] = useState(false);
	const router = useRouter();

	const fetchJobData = async () => {
		const { id } = router.query;
		const { data, error } = await supabase
			.from("public_jobs")
			.select("*,uploader:uploader_id(*)")
			.eq("id", id)
			.single();

		if (error) {
			console.log(error);
			toast.error("Something went wrong, please try again later");
			return {} as LocalProvJobPost;
		}

		return data as LocalProvJobPost;
	};

	const jobData = useQuery({
		queryKey: ["applicationData"],
		queryFn: fetchJobData,
		enabled: !!router.query.id,
		refetchOnWindowFocus: false,
	});

	// const fetchURL = () => {
	// 	const { id } = router.query;
	// 	console.log(id);
	// };

	const handleApply = async () => {
		const localIsApplied = _currentUser.applied_jobs.includes(
			jobData.data?.id as string,
		);

		if (localIsApplied) {
			// Remove from applied jobs from user_hunters and public_jobs
			const { error: errorRemove } = await supabase
				.from("user_hunters")
				.update({
					applied_jobs: _currentUser.applied_jobs.filter(
						(job) => job !== jobData.data?.id,
					),
				})
				.eq("id", _currentUser.id);

			if (errorRemove) {
				console.log(errorRemove);
				toast.error("Something went wrong, please try again later");
				return;
			}

			const { error: errorRemove2 } = await supabase
				.from("public_jobs")
				.update({
					applicants: jobData.data?.applicants.filter(
						(job) => job !== _currentUser.id,
					),
				})
				.eq("id", jobData.data?.id);

			if (errorRemove2) {
				console.log(errorRemove2);
				toast.error("Something went wrong, please try again later");
				return;
			}

			toast.success("Successfully removed from applied jobs");
			setIsApplied(false);
		} else {
			// Add to applied jobs from user_hunters and public_jobs
			const { error: errorAdd } = await supabase
				.from("user_hunters")
				.update({
					applied_jobs: [..._currentUser.applied_jobs, jobData.data?.id],
				})
				.eq("id", _currentUser.id);

			if (errorAdd) {
				console.log(errorAdd);
				toast.error("Something went wrong, please try again later");
				return;
			}

			const { error: errorAdd2 } = await supabase
				.from("public_jobs")
				.update({
					applicants: [
						...(jobData.data?.applicants as string[]),
						_currentUser.id,
					],
				})
				.eq("id", jobData.data?.id);

			if (errorAdd2) {
				console.log(errorAdd2);
				toast.error("Something went wrong, please try again later");
				return;
			}

			toast.success("Successfully added to applied jobs");
			setIsApplied(true);
		}
	};

	useEffect(() => {
		if (_currentUser && jobData) {
			const isApply = _currentUser.applied_jobs?.includes(
				jobData.data?.id as string,
			);
			setIsApplied(isApply);
		}
	}, [_currentUser, jobData, isApplied]);

	return (
		jobData.isSuccess &&
		_currentUser && (
			<>
				<motion.main
					variants={AnimPageTransition}
					initial="initial"
					animate="animate"
					exit="exit"
					className="relative min-h-screen w-full flex flex-col gap-10 py-24"
				>
					<div>
						<h1 className="text-3xl font-bold mb-5">Review Job Application</h1>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
							<div className="flex col-span-1 w-full p-3 gap-3">
								<img
									src={
										jobData.data.uploader?.avatar_url ||
										`https://api.dicebear.com/5.x/shapes/png?seed=${jobData.data.uploader.legalName}`
									}
									alt=""
									className="h-10 rounded-md"
								/>
								<div className="leading-6">
									<p className="text-2xl font-semibold">
										{jobData.data.job_title}
									</p>
									<p>{jobData.data.job_type}</p>
									<p>{jobData.data.uploader.legalName}</p>
									<p>{jobData.data.job_location}</p>
									<p className="opacity-75">
										Posted at{" "}
										{dayjs(jobData.data.created_at).format("MMMM DD YYYY")}
									</p>
								</div>
							</div>
							<div className="max-w-max col-span-2 bg-base-200 rounded-btn p-5">
								<div className="flex flex-col gap-5 ">
									{/* apply button */}
									<div className="flex gap-2 justify-end ">
										{isApplied ? (
											<button
												onClick={handleApply}
												className="btn btn-primary gap-2"
												disabled
											>
												<MdCheck className="text-lg" />
												Applied
											</button>
										) : (
											<button onClick={handleApply} className="btn btn-primary">
												Submit Application
												<MdSend className="text-lg" />
											</button>
										)}
										{/* <button onClick={handleApply} className="btn btn-primary gap-2">
											{isApplied ? (<><MdCheck /> Applied</>) : "Sumbit Application"}
											<MdSend className={"text-lg"} />
										</button> */}
									</div>
									<div className="flex gap-2 rounded-btn">
										<img
											src={_currentUser.avatar_url}
											alt=""
											className="w-15 h-15 bg-primary mask mask-square rounded-md object-cover object-center "
											width={128}
											height={128}
										/>

										<div>
											<p className="font-bold text-xl mt-7">
												{_currentUser.full_name.first}{" "}
												{_currentUser.full_name.last}
											</p>
											<p>{_currentUser.email}</p>
											<p>{_currentUser.phone}</p>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<h2 className="text-xl font-bold w-full border-b mt-2">
											Cover Letter
										</h2>
										<p className="text-justify ">
											{" "}
											{_currentUser.cover_letter}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.main>
			</>
		)
	);
};

export default ApplyPage;
