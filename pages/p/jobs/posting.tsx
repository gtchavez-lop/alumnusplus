import { AnimatePresence, motion } from "framer-motion";
import { GetServerSideProps, NextPage } from "next";
import { IUserProvisioner, TProvJobPost } from "@/lib/types";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { FiLoader } from "react-icons/fi";
import Fuse from "fuse.js";
import Link from "next/link";
import Modal from "@/components/Modal";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import _Skills from "@/lib/skills.json";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";

const JobPostingPage: NextPage = () => {
	const _currentUser = useStore($accountDetails) as IUserProvisioner;
	const [isEditing, setIsEditing] = useState(false);
	const [tempData, setTempData] = useState({} as TProvJobPost);
	const skillsearchform = useRef<HTMLFormElement>(null);
	const [skillsetRequirementSearchResult, setSkillsetRequirementSearchResult] =
		useState<string[]>([]);
	const [hasChanges, setHasChanges] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const router = useRouter();

	const __Skillset = new Fuse(_Skills, {
		shouldSort: true,
		threshold: 0.3,
	});

	const fetchJobData = async () => {
		const { id } = router.query;

		const { data, error } = await supabase
			.from("public_jobs")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			return {} as unknown as TProvJobPost;
		}

		return data as TProvJobPost;
	};

	const _jobData = useQuery({
		queryKey: ["jobData"],
		queryFn: fetchJobData,
		enabled: !!router.query.id,
		refetchOnWindowFocus: false,
		onSuccess: (data) => {
			setTempData(data);
		},
	});

	const handleChanges = async () => {
		const { error } = await supabase
			.from("public_jobs")
			.update(tempData)
			.eq("id", router.query.id);

		if (error) {
			console.error(error);
			toast.error("Error updating job posting.");
			return;
		}

		toast.success("Job posting updated.");
		setHasChanges(false);
		_jobData.refetch();

		setIsEditing(false);
	};

	const handleDeletePost = async () => {
		const { error } = await supabase
			.from("public_jobs")
			.delete()
			.eq("id", router.query.id);

		if (error) {
			console.error(error);
			toast.error("Error deleting job posting.");
			return;
		}

		toast.success("Job posting deleted.");
		router.push("/p/jobs");
	};

	useEffect(() => {
		setHasChanges(JSON.stringify(tempData) !== JSON.stringify(_jobData.data));
	}, [tempData]);

	return (
		<>
			{_jobData.isLoading ||
				(!_currentUser && (
					<motion.main
						variants={AnimPageTransition}
						initial="initial"
						animate="animate"
						exit="exit"
						className="relative min-h-screen w-full flex justify-center items-center"
					>
						<FiLoader className="animate-spin text-xl" />
					</motion.main>
				))}

			<AnimatePresence mode="wait">
				{hasChanges && (
					<motion.div
						initial={{ y: 100, opacity: 0 }}
						animate={{
							y: 0,
							opacity: 1,
							transition: { easings: "circOut" },
						}}
						exit={{
							y: 100,
							opacity: 0,
							transition: { easings: "circIn" },
						}}
						className="fixed bottom-0 left-0 p-5 bg-base-100 w-full flex justify-center z-40"
					>
						<div className="col-span-full flex justify-end items-center w-full gap-2 max-w-5xl">
							<button onClick={handleChanges} className="btn btn-success">
								Save Changes
							</button>
							<button
								onClick={() => {
									setTempData(_jobData.data as TProvJobPost);
									setHasChanges(false);
									toast("Changes discarded.");
									setHasChanges(false);
								}}
								className="btn btn-ghost"
							>
								Discard and Reset
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{_jobData.isSuccess && _currentUser && (
				<motion.main
					variants={AnimPageTransition}
					initial="initial"
					animate="animate"
					exit="exit"
					className="relative min-h-screen w-full grid grid-cols-5 gap-10 py-24"
				>
					{/* action buttons */}
					{_jobData.data.uploader_id === _currentUser.id && (
						<div className="col-span-full flex items-center justify-end gap-2">
							<label className="flex items-center gap-2">
								<span className="ml-2">Draft</span>
								<input
									type="checkbox"
									checked={tempData.draft}
									onChange={(e) => {
										setTempData({
											...tempData,
											draft: e.target.checked,
										});
									}}
									className="checkbox checkbox-primary"
								/>
							</label>
							<button
								onClick={() => {
									if (isEditing) {
										setIsEditing(!isEditing);
										setTempData(_jobData.data);
									} else {
										setIsEditing(!isEditing);
									}
								}}
								className="btn btn-ghost gap-2"
							>
								<MdEdit className="text-lg" />
								{!isEditing ? <span>Edit</span> : <span>Cancel Changes</span>}
							</button>
							<Link
								href={`/p/jobs/applicants?job_id=${router.query.id}`}
								className="btn"
							>
								See Applicants
							</Link>
							<button
								onClick={() => setIsDeleting(true)}
								className="btn btn-error gap-2"
							>
								<MdDelete className="text-lg" />
								<span>Delete</span>
							</button>
						</div>
					)}

					{/* overview */}
					<div className="col-span-full lg:col-span-2">
						<h3 className="text-2xl font-bold">Overview</h3>

						<div className="mt-10 flex flex-col gap-5">
							<div className="flex flex-col ">
								<p className="text-lg font-bold opacity-75 text-primary">
									Job Title
								</p>
								{!isEditing ? (
									<p>{_jobData.data.job_title}</p>
								) : (
									<input
										type="text"
										value={tempData.job_title}
										className="input input-primary"
										onChange={(e) =>
											setTempData({
												...tempData,
												job_title: e.target.value,
											})
										}
									/>
								)}
							</div>
							<p className="flex flex-col">
								<span className="text-lg font-bold opacity-75 text-primary">
									Job Type
								</span>
								{!isEditing ? (
									<span>{_jobData.data.job_type}</span>
								) : (
									<select
										value={tempData.job_type}
										className="select select-primary"
										onChange={(e) =>
											setTempData({
												...tempData,
												job_type: [e.target.value],
											})
										}
									>
										<option value="Full Time">Full Time</option>
										<option value="Part Time">Part Time</option>
										<option value="Contract">Contract</option>
										<option value="Internship">Internship</option>
										<option value="Temporary">Temporary</option>
									</select>
								)}
							</p>
							<p className="flex flex-col">
								<span className="text-lg font-bold opacity-75 text-primary">
									Job Location
								</span>
								{!isEditing ? (
									<span>{_jobData.data.job_location}</span>
								) : (
									<input
										type="text"
										value={tempData.job_location}
										className="input input-primary"
										onChange={(e) =>
											setTempData({
												...tempData,
												job_location: e.target.value,
											})
										}
									/>
								)}
							</p>
							<p className="flex flex-col">
								<span className="text-lg font-bold opacity-75 text-primary">
									Short Description
								</span>
								{!isEditing ? (
									<span>{_jobData.data.short_description}</span>
								) : (
									<textarea
										value={tempData.short_description}
										rows={8}
										className="textarea textarea-primary"
										onChange={(e) =>
											setTempData({
												...tempData,
												short_description: e.target.value,
											})
										}
									/>
								)}
							</p>
							<div className="flex flex-col">
								<span className="text-lg font-bold opacity-75 text-primary">
									Skill Requirements
								</span>
								{!isEditing ? (
									<ul className="list-disc pl-5">
										{_jobData.data.job_skills.map((skill, index) => (
											<li key={`qualification_${index}`}>{skill}</li>
										))}
									</ul>
								) : (
									<div className="flex flex-col gap-2">
										<div className="flex flex-wrap gap-2 bg-base-200 p-2 rounded-btn">
											{tempData.job_skills.map((skill, index) => (
												<div
													key={`skill_${index}`}
													onClick={() => {
														setTempData({
															...tempData,
															job_skills: tempData.job_skills.filter(
																(skill, i) => i !== index,
															),
														});
													}}
													className="badge badge-secondary hover:badge-error transition-all cursor-pointer"
												>
													{skill}
												</div>
											))}
										</div>

										<form
											ref={skillsearchform}
											onSubmit={(e) => {
												e.preventDefault();
												const form = e.target as HTMLFormElement;
												const skill_input =
													form.skill_input as HTMLInputElement;
												setTempData({
													...tempData,
													job_skills: [
														...tempData.job_skills,
														skill_input.value,
													],
												});
												form.reset();
											}}
											className="flex gap-2"
										>
											<input
												type="text"
												className="input flex-1 input-primary"
												name="skill_input"
												onChange={async (e) => {
													const query = e.target.value;
													if (query.length > 0) {
														const results = await __Skillset.search(query, {
															limit: 7,
														});
														const filtered = results.filter((res) => {
															return !tempData.job_skills.includes(res.item);
														});
														const mapped = filtered.map((res) => res.item);

														setSkillsetRequirementSearchResult(mapped);
													} else {
														setSkillsetRequirementSearchResult([]);
													}
												}}
											/>
											<button className="btn btn-primary">Add</button>
										</form>

										{skillsetRequirementSearchResult.length > 0 && (
											<div className="flex flex-wrap gap-2 bg-base-200 p-2 rounded-btn">
												{skillsetRequirementSearchResult.map((skill, index) => (
													<div
														key={`skill_${index}`}
														onClick={() => {
															setTempData({
																...tempData,
																job_skills: [...tempData.job_skills, skill],
															});
															setSkillsetRequirementSearchResult([]);
															skillsearchform.current?.reset();
														}}
														className="badge badge-primary hover:badge-accent transition-all cursor-pointer"
													>
														{skill}
													</div>
												))}
											</div>
										)}
									</div>
								)}
							</div>

							<div className="flex flex-col">
								<span className="text-lg font-bold opacity-75 text-primary">
									Qualifications
								</span>
								{!isEditing ? (
									<ul className="list-disc pl-5">
										{_jobData.data.job_qualifications.map(
											(qualification, index) => (
												<li key={`qualification_${index}`}>{qualification}</li>
											),
										)}
									</ul>
								) : (
									<form
										onSubmit={(e) => {
											e.preventDefault();

											const form = e.target as HTMLFormElement;
											const qualification_input =
												form.qualification_input as HTMLInputElement;

											setTempData({
												...tempData,
												job_qualifications: [
													...tempData.job_qualifications,
													qualification_input.value,
												],
											});

											form.reset();
										}}
									>
										<div className="flex flex-col gap-2">
											<div className="flex flex-wrap gap-2 bg-base-200 p-2 rounded-btn">
												{tempData.job_qualifications.map(
													(qualification, index) => (
														<div
															key={`qualification_${index}`}
															onClick={() => {
																setTempData({
																	...tempData,
																	job_qualifications:
																		tempData.job_qualifications.filter(
																			(qualification, i) => i !== index,
																		),
																});
															}}
															className="bg-secondary text-secondary-content p-2 rounded-btn w-full hover:bg-error-content cursor-pointer"
														>
															{qualification}
														</div>
													),
												)}
											</div>

											<div className="flex gap-2">
												<input
													type="text"
													className="input flex-1 input-primary"
													name="qualification_input"
												/>
												<button className="btn btn-primary">Add</button>
											</div>
										</div>
									</form>
								)}
							</div>
						</div>
					</div>
					{/* full description */}
					<div className="col-span-full lg:col-span-3">
						<h3 className="text-2xl font-bold mb-10">Full Description</h3>

						{!isEditing ? (
							<ReactMarkdown className="prose ">
								{_jobData.data.full_description}
							</ReactMarkdown>
						) : (
							<div className="flex flex-col gap-2">
								<textarea
									className="textarea textarea-primary"
									name="full_description"
									rows={15}
									value={tempData.full_description}
									onChange={(e) => {
										setTempData({
											...tempData,
											full_description: e.target.value,
										});
									}}
								/>
							</div>
						)}
					</div>
				</motion.main>
			)}

			{isDeleting && (
				<Modal>
					<p>Do you want to remove this post?</p>

					<div className="flex gap-2 mt-2 justify-end">
						<button onClick={handleDeletePost} className="btn btn-error">
							Yes
						</button>
						<button
							className="btn btn-ghost"
							onClick={() => {
								setIsDeleting(false);
							}}
						>
							No
						</button>
					</div>
				</Modal>
			)}
		</>
	);
};

export default JobPostingPage;
