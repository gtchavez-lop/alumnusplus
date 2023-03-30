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

const ApplyPage: NextPage<{ jobData: LocalProvJobPost }> = ({ jobData }) => {
	const _currentUser = useStore($accountDetails) as IUserHunter;
	const [isApplied, setIsApplied] = useState(false);
	const router = useRouter();

	const fetchURL = () => {
		const { id } = router.query;
		console.log(id);
	};

	const handleApply = async () => {
		const localIsApplied = _currentUser.applied_jobs?.includes(jobData.id)
		if (localIsApplied) {
			const newAppliedList = _currentUser.applied_jobs.filter(
				(job) => job !== jobData.id,
			);
			const { error } = await supabase
				.from("user_hunters")
				.update({ applied_jobs: newAppliedList })
				.eq("id", _currentUser.id);
			if (error) {
				console.log(error);
				toast.error(error.message);
				return;
			}
		}
		else {
			const newAppliedList = _currentUser.applied_jobs.concat(jobData.id);
			const { error: userHunterAppliedJobError } = await supabase
				.from("user_hunters")
				.update({ applied_jobs: newAppliedList })
				.eq("id", _currentUser.id);

			const { error: appliedJobError } = await supabase
				.from("public_jobs")
				.update({ applicants: newAppliedList })
				.eq("id", jobData.id);


			if (userHunterAppliedJobError || appliedJobError) {
				console.log(userHunterAppliedJobError, appliedJobError);
				toast.error("Something went wrong, please try again later");
				return;
			} else {
				toast.success("Added to Applied Jobs");
				setIsApplied(true);
				$accountDetails.set({
					..._currentUser,
					applied_jobs: newAppliedList,
				});
			}
		}
	};

	useEffect(() => {
		if (_currentUser && jobData) {
			const isApply = _currentUser.applied_jobs?.includes(jobData.id);
			setIsApplied(isApply);
		}
	}, [_currentUser, jobData, isApplied]);

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
					<div>
						<h1 className="text-3xl font-bold mb-5">Review Job Application</h1>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
							<div className="flex col-span-1 w-full p-3 gap-3">
								<img src={jobData.uploader.avatar_url ||
									`https://api.dicebear.com/5.x/shapes/png?seed=${jobData.uploader.legalName}`}
									alt=""
									className="h-10 rounded-md" />
								<div className="leading-6">
									<p className="text-2xl font-semibold">{jobData.job_title}</p>
									<p>{jobData.job_type}</p>
									<p>{jobData.uploader.legalName}</p>
									<p>{jobData.job_location}</p>
									<p className="opacity-75">
										Posted at {dayjs(jobData.created_at).format("MMMM DD YYYY")}
									</p>
								</div>
							</div>
							<div className="max-w-max col-span-2 bg-base-200 rounded-btn p-5">
								<div className="flex flex-col gap-5 ">
									{/* apply button */}
									<div className="flex gap-2 justify-end ">
										{isApplied ? (
											<button
												className="btn btn-primary gap-2"
												disabled
											>
												<MdCheck className="text-lg" />
												Applied
											</button>

										) : <button
											className="btn btn-primary">
											Sumbit Application
											<MdSend className="text-lg" />
										</button>}
										{/* <button onClick={handleApply} className="btn btn-primary gap-2">
											{isApplied ? (<><MdCheck /> Applied</>) : "Sumbit Application"}
											<MdSend className={"text-lg"} />
										</button> */}
									</div>
									<div className="flex gap-2 rounded-btn">

										<img src={_currentUser.avatar_url} alt=""
											className="w-15 h-15 bg-primary mask mask-square rounded-md object-cover object-center "
											width={128}
											height={128} />

										<div>
											<p className="font-bold text-xl mt-7">
												{_currentUser.full_name.first} {_currentUser.full_name.last}
											</p>
											<p>{_currentUser.email}</p>
											<p>{_currentUser.phone}</p>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<h2 className="text-xl font-bold w-full border-b mt-2">
											Cover Letter
										</h2>
										<p className="text-justify "> {_currentUser.cover_letter}</p>
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
