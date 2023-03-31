import { FiPlus, FiX } from "react-icons/fi";
import { IUserProvisioner, TProvJobPost } from "@/lib/types";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import Fuse from "fuse.js";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Skills from "@/lib/skills.json";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useState } from "react";
import { useStore } from "@nanostores/react";
import { uuid } from "uuidv4";

const CreateNewJobPage = () => {
	const _currentUser = useStore($accountDetails) as IUserProvisioner;
	const router = useRouter();

	const [jobSkillQuery, setJobSkillQuery] = useState("");
	const [jobSkillSearchResults, setJobSkillSearchResults] = useState<string[]>(
		[],
	);
	const [addJobSchema, setAddJobSchema] = useState<TProvJobPost>({
		id: uuid(),
		created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		full_description: "",
		job_location: "",
		applicants: [],
		job_qualifications: [],
		job_skills: [],
		job_title: "",
		job_type: [],
		short_description: "",
		uploader_id: "",
		draft: false,
	});
	const _SkillList = new Fuse(Skills, {
		threshold: 0.3,
	});

	const submitJobHandler = async () => {
		// check if the user has filled out all the fields
		if (
			addJobSchema.job_title === "" ||
			addJobSchema.full_description === "" ||
			addJobSchema.short_description === "" ||
			addJobSchema.job_qualifications.length === 0 ||
			addJobSchema.job_location === "" ||
			addJobSchema.job_type.length === 0 ||
			addJobSchema.job_skills.length === 0
		) {
			toast.error("Please fill out all the fields");
			return;
		}

		toast.loading("Posting job...");

		const { error } = await supabase
			.from("public_jobs")
			.insert<TProvJobPost[]>([
				{
					...addJobSchema,
					draft: false,
					uploader_id: _currentUser.id,
				},
			]);

		toast.dismiss();
		if (error) {
			toast.error(error.message);
			return;
		}

		if (!error) {
			toast.success("Job posted successfully");
			router.push("/p/jobs");
		}
	};

	const submitJobAsDraftHandler = async () => {
		// check if the user has filled out all the fields
		if (
			addJobSchema.job_title === "" ||
			addJobSchema.full_description === "" ||
			addJobSchema.short_description === "" ||
			addJobSchema.job_qualifications.length === 0 ||
			addJobSchema.job_location === "" ||
			addJobSchema.job_type.length === 0 ||
			addJobSchema.job_skills.length === 0
		) {
			toast.error("Please fill out all the fields");
			return;
		}

		toast.loading("Posting job...");

		const { error } = await supabase
			.from("public_jobs")
			.insert<TProvJobPost[]>([
				{
					...addJobSchema,
					draft: true,
					uploader_id: _currentUser.id,
				},
			]);

		toast.dismiss();
		if (error) {
			toast.error(error.message);
			return;
		}

		if (!error) {
			toast.success("Job posted successfully");
			router.push("/p/jobs");
		}
	};

	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				<p className="text-2xl font-bold mb-10">Add new Post</p>

				{/* job title */}
				<label className="flex flex-col mb-5">
					<span className="text-lg text-primary font-bold">Job Title</span>
					<input
						type="text"
						name="job_title"
						id="job_title"
						placeholder="What is the position called?"
						className="input input-bordered"
						value={addJobSchema.job_title}
						onChange={(e) => {
							setAddJobSchema({
								...addJobSchema,
								job_title: e.target.value,
							});
						}}
					/>
				</label>

				{/* job type */}
				<label className="flex flex-col mb-5">
					<span className="text-lg text-primary font-bold">Job Type</span>
					<select
						name="job_type"
						id="job_type"
						className="select select-bordered"
						value={addJobSchema.job_type}
						onChange={(e) => {
							setAddJobSchema({
								...addJobSchema,
								job_type: [e.target.value],
							});
						}}
					>
						<option value="" disabled>
							Select a job type
						</option>
						<option value="Full Time">Full Time</option>
						<option value="Part Time">Part Time</option>
						<option value="Contract">Contract</option>
						<option value="Internship">Internship</option>
						<option value="Temporary">Temporary</option>
					</select>
				</label>

				{/* job location */}
				<label className="flex flex-col mb-5">
					<span className="text-lg text-primary font-bold">Job Location</span>
					<input
						type="text"
						name="job_location"
						id="job_location"
						placeholder="Where is this job located?"
						className="input input-bordered"
						value={addJobSchema.job_location}
						onChange={(e) => {
							setAddJobSchema({
								...addJobSchema,
								job_location: e.target.value,
							});
						}}
					/>
				</label>

				{/* job qualifications */}
				<label className="flex flex-col mb-5">
					<span className="text-lg text-primary font-bold">
						Job Qualifications
					</span>
					<input
						type="text"
						name="job_qualifications"
						id="job_qualifications"
						placeholder="What are the qualifications for this job?"
						className="input input-bordered"
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								// check for duplicates
								if (
									addJobSchema.job_qualifications.includes(
										e.currentTarget.value,
									)
								) {
									toast.error("Qualification already added");
									return;
								}
								// add to array
								setAddJobSchema({
									...addJobSchema,
									job_qualifications: [
										...addJobSchema.job_qualifications,
										e.currentTarget.value,
									],
								});
								e.currentTarget.value = "";
							}
						}}
					/>
					<div className="flex flex-wrap gap-2 mt-2">
						{addJobSchema.job_qualifications.map((qualification, index) => (
							<div
								key={`qualification-${index}`}
								className="flex items-center gap-3 bg-primary text-primary-content rounded-btn px-3 py-1"
							>
								<p>{qualification}</p>
								<button
									onClick={() => {
										setAddJobSchema({
											...addJobSchema,
											job_qualifications:
												addJobSchema.job_qualifications.filter(
													(item) => item !== qualification,
												),
										});
									}}
								>
									<FiX />
								</button>
							</div>
						))}
					</div>
				</label>

				{/* job skills */}
				<label className="flex flex-col mb-5">
					<span className="text-lg text-primary font-bold">Job Skills</span>
					<input
						type="text"
						name="job_skills"
						id="job_skills"
						placeholder="What are the skills required for this job?"
						className="input input-bordered"
						value={jobSkillQuery}
						onChange={(e) => setJobSkillQuery(e.target.value)}
						onKeyUp={(e) => {
							if (jobSkillQuery.length === 0) {
								setJobSkillSearchResults([]);
							}
							setJobSkillSearchResults([]);
							e.preventDefault();

							const res = _SkillList.search(jobSkillQuery);
							const skills = res.map((item) => item.item);
							const filtered = skills.filter((skill) => {
								return !addJobSchema.job_skills.includes(skill);
							});
							const limited = filtered.slice(0, 5);
							setJobSkillSearchResults(limited);
						}}
					/>
					{jobSkillSearchResults.length > 0 && (
						<motion.div
							animate={{
								opacity: [0, 1],
								translateY: [10, 0],
								transition: { duration: 0.2 },
							}}
							className="bg-base-300 w-full rounded-md shadow-md flex flex-wrap p-4 mt-2 gap-3"
						>
							{jobSkillSearchResults.map((skill, index) => (
								<motion.div
									animate={{
										opacity: [0, 1],
										transition: { duration: 0.2, delay: index * 0.05 },
									}}
									onClick={() => {
										setAddJobSchema({
											...addJobSchema,
											job_skills: [...addJobSchema.job_skills, skill],
										});
										setJobSkillSearchResults([]);
										setJobSkillQuery("");
									}}
									key={`skill-${index}`}
									className="flex items-center gap-3 bg-accent text-accent-content rounded-btn px-3 py-1 cursor-pointer"
								>
									<p>{skill}</p>
									<FiPlus />
								</motion.div>
							))}
						</motion.div>
					)}
					<div className="flex flex-wrap gap-2 mt-2">
						{addJobSchema.job_skills.map((skill, index) => (
							<div
								key={`skill-${index}`}
								className="flex items-center gap-3 bg-primary text-primary-content rounded-btn px-3 py-1"
							>
								<p>{skill}</p>
								<button
									onClick={() => {
										setAddJobSchema({
											...addJobSchema,
											job_skills: addJobSchema.job_skills.filter(
												(item) => item !== skill,
											),
										});
									}}
								>
									<FiX />
								</button>
							</div>
						))}
					</div>
				</label>

				{/* job short description */}
				<label className="flex flex-col mb-5">
					<span className="text-lg text-primary font-bold">
						Job Short Description
					</span>
					<input
						type="text"
						name="short_description"
						id="short_description"
						placeholder="Write a short description of the job that will be displayed on the job card"
						className="input input-bordered"
						value={addJobSchema.short_description}
						onChange={(e) => {
							setAddJobSchema({
								...addJobSchema,
								short_description: e.target.value,
							});
						}}
					/>
				</label>

				{/* full description */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5 gap-y-0">
					<p className="col-span-full text-lg text-primary font-bold">
						Full Description
					</p>
					<div className="prose prose-sm">
						<p>Editor</p>
						<textarea
							value={addJobSchema.full_description}
							onKeyUp={(e) => {
								e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
							}}
							onChange={(e) => {
								if (e.currentTarget.value.length < 1) {
									e.currentTarget.style.height = "auto";
								}
								setAddJobSchema({
									...addJobSchema,
									full_description: e.target.value,
								});
							}}
							className="textarea textarea-bordered w-full h-max overflow-y-hidden"
						/>
					</div>

					<div className="prose prose-sm hidden md:block">
						<p>Preview</p>
						<ReactMarkdown className="bg-base-200 rounded-btn p-2">
							{addJobSchema.full_description}
						</ReactMarkdown>
					</div>
					<div className="prose prose-sm md:hidden">
						<p>Preview only available at larger screens</p>
					</div>
				</div>

				{/* submit */}
				<div className="flex justify-end mt-16 gap-2">
					<Link href="/p/jobs" className="btn btn-ghost">
						Cancel
					</Link>
					<button
						disabled={
							!(
								addJobSchema.job_title.length > 0 &&
								addJobSchema.job_type.length > 0 &&
								addJobSchema.job_skills.length > 0 &&
								addJobSchema.short_description.length > 0 &&
								addJobSchema.full_description.length > 0
							)
						}
						onClick={submitJobAsDraftHandler}
						className="btn btn-ghost"
					>
						Submit as draft
					</button>
					<button
						disabled={
							!(
								addJobSchema.job_title.length > 0 &&
								addJobSchema.job_type.length > 0 &&
								addJobSchema.job_skills.length > 0 &&
								addJobSchema.short_description.length > 0 &&
								addJobSchema.full_description.length > 0
							)
						}
						onClick={submitJobHandler}
						className="btn btn-primary"
					>
						Submit
					</button>
				</div>
			</motion.main>
		</>
	);
};

export default CreateNewJobPage;
