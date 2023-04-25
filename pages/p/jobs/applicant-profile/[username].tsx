import {
	FiCheck,
	FiFacebook,
	FiGithub,
	FiInstagram,
	FiLinkedin,
	FiLoader,
	FiTwitter,
	FiX,
} from "react-icons/fi";
import { GetServerSideProps, NextPage } from "next";
import { IUserHunter, IUserProvisioner } from "@/lib/types";
import { MdCheckCircleOutline, MdHelp } from "react-icons/md";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import Image from "next/image";
import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import Tabs from "@/components/Tabs";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQueries } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { useStore } from "@nanostores/react";

type TTab = {
	title: string;
	value: string;
};

const PageTabs: TTab[] = [
	{
		title: "About",
		value: "about",
	},
	{
		title: "Experiences",
		value: "experiences",
	},
	{
		title: "Education",
		value: "education",
	},
	{
		title: "Trainings",
		value: "trainings",
	},
];

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { username } = context.query;

	return {
		props: {
			username,
		},
	};
};

const ApplicantProfile: NextPage<{ username: string }> = ({ username }) => {
	const _currentUser = useStore($accountDetails) as IUserProvisioner;
	const [tabSelected, setTabSelected] = useState<TTab["value"]>("about");
	const [tabContentRef] = useAutoAnimate();
	const router = useRouter();

	const fetchApplicant = async () => {
		const { data, error } = await supabase
			.from("user_hunters")
			.select("*")
			.eq("username", username)
			.single();

		if (error) {
			console.error(error);
			return {} as unknown as IUserHunter;
		}

		return data as IUserHunter;
	};

	const [applicant] = useQueries({
		queries: [
			{
				queryKey: ["applicant", username],
				queryFn: fetchApplicant,
				enabled: !!username && !!_currentUser,
				refetchOnMount: true,
				refetchOnWindowFocus: false,
			},
		],
	});

	const handleRejectApplicant = async () => {
		toast.loading("Rejecting applicant...");

		//get updated job data
		const { data: updatedData, error: updatedDataError } = await supabase
			.from("public_jobs")
			.select("applicants")
			.eq("id", router.query.job_id)
			.single();

		if (updatedDataError) {
			toast.dismiss();
			toast.error("Something went wrong");
			return;
		}

		//remove applicant from job
		const { data, error } = await supabase
			.from("public_jobs")
			.update({
				applicants: updatedData.applicants.filter(
					(ap: string) => ap !== applicant.data?.id,
				),
			})
			.eq("id", router.query.job_id);

		if (error) {
			toast.dismiss();
			toast.error("Failed to reject applicant");
			return;
		}

		toast.dismiss();
		toast.success("Applicant rejected");
		router.push("/p/jobs");
	};
	const handleAcceptApplicant = async () => {
		toast.loading("Accepting applicant...");

		const newAppliedJobs = applicant.data?.applied_jobs.filter(
			(job: string) => job !== router.query.job_id,
		);
		const { error } = await supabase
			.from("user_hunters")
			.update({
				activeJob: router.query.job_id,
				// remove job from applicant's applied jobs
				applied_jobs: newAppliedJobs,
			})
			.eq("username", username);

		if (error) {
			toast.dismiss();
			toast.error("Failed to accept applicant");
			return;
		}

		toast.dismiss();
		toast.success("Applicant accepted");
		applicant.refetch();
	};

	return applicant.isSuccess ? (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				<section className="flex flex-col gap-5">
					<div className="col-span-3 flex flex-col gap-3">
						{/* landing profile */}
						<div className="flex sm:items-center gap-5 flex-col sm:flex-row bg-base-200 rounded-btn p-5">
							<div className="relative">
								<Image
									src={applicant.data.avatar_url}
									alt="avatar"
									className="w-32 h-32 bg-primary mask mask-squircle object-cover object-center "
									width={128}
									height={128}
								/>
							</div>
							<div>
								<p className="text-3xl font-bold flex gap-1 items-center">
									{applicant.data.full_name.first}{" "}
									{applicant.data.full_name.last}
									{applicant.data.is_verified && (
										<MdCheckCircleOutline className="text-blue-500 text-lg" />
									)}
								</p>
								<p className="font-semibold opacity-75">
									{applicant.data.email}
								</p>
								<p>
									Joined at:{" "}
									<span className="opacity-50">
										{dayjs(applicant.data.created_at).format("MMMM DD, YYYY")}
									</span>
								</p>
							</div>
						</div>

						{/* mobile select */}
						<div className="lg:hidden">
							<select
								value={tabSelected}
								onChange={(e) =>
									setTabSelected(e.currentTarget.value as TTab["value"])
								}
								className="select select-primary w-full"
							>
								{PageTabs.map((tab, index) => (
									<option key={`tab-${index}`} value={tab.value}>
										{tab.title}
									</option>
								))}
							</select>
						</div>
						{/* accept and reject buttons */}
						{!applicant.data.activeJob ? (
							<div className="flex justify-end gap-2">
								<button
									onClick={handleRejectApplicant}
									className="btn btn-ghost gap-2"
								>
									<FiX className="text-lg text-error" />
									<span className="text-error">Reject Applicant</span>
								</button>
								<button
									onClick={handleAcceptApplicant}
									className="btn btn-primary gap-2"
								>
									<FiCheck className="text-lg" />
									<span>Accept Applicant</span>
								</button>
							</div>
						) : (
							<div className="flex justify-end gap-2">
								<button className="btn btn-ghost gap-2">
									<FiX className="text-lg text-error" />
									<span className="text-error">Terminate Applicant</span>
								</button>
							</div>
						)}

						{/* desktop tabs */}
						<Tabs
							activeTab={tabSelected}
							onTabChange={(tab) => setTabSelected(tab as TTab["value"])}
							tabs={PageTabs}
						/>

						{/* tab contents */}
						<div className="py-5" ref={tabContentRef}>
							{tabSelected === "about" && (
								<div className="flex flex-col gap-2">
									{/* bio */}
									<div className="flex flex-col shadow-md rounded-btn p-5 gap-3">
										<div className="flex justify-between items-start">
											<p className="text-2xl font-bold">Bio</p>
										</div>

										<ReactMarkdown className="prose">
											{applicant.data?.bio ||
												"This user has not added a bio yet"}
										</ReactMarkdown>
									</div>
									{/* skills */}
									<div className="flex flex-col shadow-md rounded-btn p-5 gap-3">
										<p className="text-2xl font-bold">Skillsets</p>
										<div className="flex flex-col">
											<h4 className="text-lg font-semibold">Primary Skill</h4>
											<p className="badge badge-primary badge-lg">
												{applicant.data?.skill_primary}
											</p>
										</div>
										<div className="flex flex-col">
											<h4 className="text-lg font-semibold">
												Secondary Skills
											</h4>
											<p className="flex flex-wrap gap-2">
												{applicant.data?.skill_secondary.map((skill, index) => (
													<span
														key={`secondaryskill_${index}`}
														className="badge badge-accent badge-lg"
													>
														{skill}
													</span>
												))}
											</p>
										</div>
									</div>
									{/* residence */}
									<div className="flex flex-col shadow-md rounded-btn p-5 gap-3">
										<p className="text-2xl font-bold">Residence</p>
										<div className="flex flex-col ">
											<p>
												{applicant.data?.address.address},{" "}
												{applicant.data?.address.city} -{" "}
												{applicant.data?.address.postalCode}
											</p>
										</div>
									</div>
									{/* socials */}
									<div className="flex flex-col shadow-md rounded-btn p-5 gap-3">
										<p className="text-2xl font-bold">Social Media Links</p>
										<div className="flex flex-wrap gap-2">
											{applicant.data?.social_media_links.facebook && (
												<Link
													href={applicant.data?.social_media_links.facebook}
													target="_blank"
													rel="noopener noreferrer"
													className="btn btn-primary"
												>
													<FiFacebook className="text-xl" />
												</Link>
											)}
											{applicant.data?.social_media_links.twitter && (
												<Link
													href={applicant.data?.social_media_links.twitter}
													target="_blank"
													rel="noopener noreferrer"
													className="btn btn-primary"
												>
													<FiTwitter className="text-xl" />
												</Link>
											)}
											{applicant.data?.social_media_links.instagram && (
												<Link
													href={applicant.data?.social_media_links.instagram}
													target="_blank"
													rel="noopener noreferrer"
													className="btn btn-primary"
												>
													<FiInstagram className="text-xl" />
												</Link>
											)}
											{applicant.data?.social_media_links.linkedin && (
												<Link
													href={applicant.data?.social_media_links.linkedin}
													target="_blank"
													rel="noopener noreferrer"
													className="btn btn-primary"
												>
													<FiLinkedin className="text-xl" />
												</Link>
											)}
											{applicant.data?.social_media_links.github && (
												<Link
													href={applicant.data?.social_media_links.github}
													target="_blank"
													rel="noopener noreferrer"
													className="btn btn-primary"
												>
													<FiGithub className="text-xl" />
												</Link>
											)}
										</div>
									</div>
								</div>
							)}
							{tabSelected === "experiences" && (
								<div className="flex flex-col gap-2">
									{applicant.data?.experience.length === 0 && (
										<div className="flex flex-col items-center col-span-full">
											<MdHelp className="text-5xl text-primary" />
											<p>No employment history yet</p>
										</div>
									)}
									{applicant.data?.experience.map((exp, i) => (
										<div
											key={`expereince_${i}`}
											className="shadow-md rounded-btn p-5"
										>
											<p className="text-lg">
												{exp.jobPosition} - {exp.companyName}
											</p>
											<p>{exp.location}</p>
											<p className="mt-2 text-sm opacity-75">
												{exp.startDate} -{" "}
												{exp.isCurrent ? "Present" : exp.endDate}
											</p>
										</div>
									))}
								</div>
							)}
							{tabSelected === "education" && (
								<div className="flex flex-col gap-2">
									{applicant.data?.education.length === 0 && (
										<div className="flex flex-col items-center col-span-full">
											<MdHelp className="text-5xl text-primary" />
											<p>No education history yet</p>
										</div>
									)}
									{applicant.data?.education.map((edu, i) => (
										<div
											key={`education_${i}`}
											className="shadow-md rounded-btn p-5"
										>
											<p className="text-lg">
												<span className="capitalize">{edu.degreeType}</span> -{" "}
												{edu.institution}
											</p>
											<p>{edu.location}</p>
											{edu.degreeName && (
												<p className="mt-2 text-sm opacity-75">
													{edu.degreeName}
												</p>
											)}
											<p className="mt-2 text-sm opacity-75">
												{edu.yearGraduated}
											</p>
										</div>
									))}
								</div>
							)}
							{tabSelected === "trainings" && (
								<div className="flex flex-col gap-2">
									{applicant.data?.trainings.length === 0 && (
										<div className="flex flex-col items-center col-span-full">
											<MdHelp className="text-5xl text-primary" />
											<p>No Seminars/Training history yet</p>
										</div>
									)}
									{applicant.data?.trainings.map((training, i) => (
										<div
											key={`training-${i}`}
											className="shadow-md rounded-btn p-5"
										>
											<p className="text-lg font-bold">{training.title}</p>
											<p className="">
												{dayjs(training.date).format("MMMM D, YYYY")}
											</p>
											<p className="text-sm opacity-75">
												{training.organizer} | {training.location}
											</p>
											<p className="text-sm opacity-75 capitalize">
												{training.type}
											</p>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</section>
			</motion.main>
		</>
	) : (
		<div className="min-h-screen flex justify-center items-center">
			<FiLoader className="animate-spin" />
		</div>
	);
};

export default ApplicantProfile;
