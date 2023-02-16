import { FiPlus, FiX } from "react-icons/fi";

import Link from "next/link";
import ProtectedPageContainer from "@/components/ProtectedPageContainer";
import ReactMarkdown from "react-markdown";
import { __PageTransition } from "@/lib/animation";
import { __supabase } from "@/supabase";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import uuidv4 from "@/lib/uuidv4";

const CreateNewJobPage = () => {
	const currentUser = useUser();
	const router = useRouter();
	const [jobSkillQuery, setJobSkillQuery] = useState("");
	const [jobSkillSearchResults, setJobSkillSearchResults] = useState([]);
	const [addJobSchema, setAddJobSchema] = useState({
		job_title: "",
		full_description: "**This is where you write the full details of the job**",
		short_description: "",
		job_qualifications: ["Wicket Profile"],
		job_location: "",
		job_type: [],
		job_skills: [],
	});

	const handleSkillSearch = async (query) => {
		const result = await fetch(`/api/skills?q=${query}&limit=20`);
		const data = await result.json();

		setJobSkillSearchResults(data);
	};

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

		const { error } = await __supabase.from("public_jobs").insert([
			{
				uploader_id: currentUser.id,
				job_title: addJobSchema.job_title,
				full_description: addJobSchema.full_description,
				short_description: addJobSchema.short_description,
				job_qualifications: addJobSchema.job_qualifications,
				job_location: addJobSchema.job_location,
				job_type: addJobSchema.job_type,
				job_skills: addJobSchema.job_skills,
			},
		]);

		if (error) {
			toast.error(error.message);
		}

		if (!error) {
			toast.success("Job posted successfully");
			router.push("/p/jobs");
		}
	};

	return (
		<>
			<ProtectedPageContainer>
				<motion.main
					variants={__PageTransition}
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
						<span className="text-lg text-primary font-bold">Job Qualifications</span>
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
									if (addJobSchema.job_qualifications.includes(e.target.value)) {
										toast.error("Qualification already added");
										return;
									}
									// add to array
									setAddJobSchema({
										...addJobSchema,
										job_qualifications: [...addJobSchema.job_qualifications, e.target.value],
									});
									e.target.value = "";
								}
							}}
						/>
						<div className="flex flex-wrap gap-2 mt-2">
							{addJobSchema.job_qualifications.map((qualification, index) => (
								<div
									key={`qualification-${index}`}
									className="flex items-center gap-3 bg-secondary text-secondary-content rounded-btn px-3 py-1"
								>
									<p>{qualification}</p>
									<button
										onClick={() => {
											setAddJobSchema({
												...addJobSchema,
												job_qualifications: addJobSchema.job_qualifications.filter((item) => item !== qualification),
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
								if (e.key === "Enter" && jobSkillQuery.length > 0) {
									setJobSkillSearchResults([]);
									e.preventDefault();
									handleSkillSearch(jobSkillQuery);
								}
							}}
						/>
						{jobSkillSearchResults.length > 0 && (
							<motion.div
								animate={{ opacity: [0, 1], translateY: [10, 0], transition: { duration: 0.2 } }}
								className="bg-base-300 w-full rounded-md shadow-md flex flex-wrap p-4 mt-2 gap-3"
							>
								{jobSkillSearchResults.map((skill, index) => (
									<motion.div
										animate={{ opacity: [0, 1], transition: { duration: 0.2, delay: index * 0.05 } }}
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
									className="flex items-center gap-3 bg-secondary text-secondary-content rounded-btn px-3 py-1"
								>
									<p>{skill}</p>
									<button
										onClick={() => {
											setAddJobSchema({
												...addJobSchema,
												job_skills: addJobSchema.job_skills.filter((item) => item !== skill),
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
						<span className="text-lg text-primary font-bold">Job Short Description</span>
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
						<p className="col-span-full text-lg text-primary font-bold">Full Description</p>
						<div className="prose prose-sm">
							<p>Editor</p>
							<textarea
								value={addJobSchema.full_description}
								onKeyUp={(e) => {
									e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
								}}
								onChange={(e) => {
									if (e.target.value < 1) {
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
							<ReactMarkdown className="bg-base-200 rounded-btn p-2">{addJobSchema.full_description}</ReactMarkdown>
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
						<button onClick={submitJobHandler} className="btn btn-primary">
							Submit
						</button>
					</div>

					{/* <form className="mt-5 max-w-lg mx-auto">
						<div className="flex flex-col">
							<label htmlFor="job_title">Job Title</label>
							<input
								type="text"
								name="job_title"
								id="job_title"
								placeholder="A very cool job"
								className="input input-bordered"
							/>
						</div>

						<div className="flex flex-col mt-5 w-full">
							<label htmlFor="full_description w-full">
								<span>Job Full Description</span>
							</label>
							<textarea
								name="full_description"
								id="full_description"
								placeholder="The description of the job that you are posting"
								className="textarea textarea-bordered prose"
								rows={5}
							/>
							<span className="opacity-50 ml-auto">Markdown</span>
						</div>
						<div className="flex flex-col mt-5 w-full">
							<label htmlFor="short_description w-full">
								<span>Job Short Description</span>
							</label>
							<textarea
								name="short_description"
								id="short_description"
								placeholder="The description of the job that you are posting"
								className="textarea textarea-bordered prose"
								rows={5}
							/>
							<span className="opacity-50 ml-auto">Markdown</span>
						</div>

						<div className="flex flex-col mt-5">
							<label htmlFor="job_location">Job Location</label>
							<input
								type="text"
								name="job_location"
								id="job_location"
								placeholder="Where is the job located?"
								className="input input-bordered"
							/>
						</div>

						<div className="flex flex-col gap-1 mt-5">
							<label>Job Qualifications</label>
							<input
								type="text"
								name="job_qualifications"
								id="job_qualifications"
								placeholder="What are the qualifications for this job?"
								className="input input-bordered"
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										setJobQualifications([...jobqualifications, e.target.value]);
										e.target.value = "";
									}
								}}
							/>
							<div className="flex flex-row flex-wrap gap-2 mt-2">
								{jobqualifications.map((item, index) => (
									<div
										key={`jobqualification-${index}`}
										onClick={() => {
											setJobQualifications(jobqualifications.filter((i) => i !== item));
										}}
										className="badge badge-primary cursor-pointer gap-2 hover:scale-95 hover:badge-error"
									>
										<span>{item}</span>
										<FiX />
									</div>
								))}
							</div>
						</div>

						<div className="flex flex-col gap-1 mt-5">
							<label>Job Type</label>
							<div className="flex flex-row mt-2">
								<input
									type="checkbox"
									name="job_type_1"
									id="job_type_1"
									checked={addJobSchema.job_type.includes("Full Time")}
									className="checkbox checkbox-primary"
									onChange={(e) => {
										const oldList = addJobSchema.job_type;
										const newList = e.target.checked
											? [...oldList, "Full Time"]
											: oldList.filter((item) => item !== "Full Time");

										setAddJobSchema({
											...addJobSchema,
											job_type: newList,
										});
									}}
								/>
								<label htmlFor="job_type_1">Full Time</label>
							</div>
							<div className="flex flex-row">
								<input
									type="checkbox"
									name="job_type_2"
									id="job_type_2"
									className="checkbox checkbox-primary"
									checked={addJobSchema.job_type.includes("Part Time")}
									onChange={(e) => {
										const oldList = addJobSchema.job_type;
										const newList = e.target.checked
											? [...oldList, "Part Time"]
											: oldList.filter((item) => item !== "Part Time");

										setAddJobSchema({
											...addJobSchema,
											job_type: newList,
										});
									}}
								/>
								<label htmlFor="job_type_2">Part Time</label>
							</div>
							<div className="flex flex-row">
								<input
									type="checkbox"
									name="job_type_3"
									id="job_type_3"
									checked={addJobSchema.job_type.includes("Contract")}
									className="checkbox checkbox-primary"
									onChange={(e) => {
										const oldList = addJobSchema.job_type;
										const newList = e.target.checked
											? [...oldList, "Contract"]
											: oldList.filter((item) => item !== "Contract");

										setAddJobSchema({
											...addJobSchema,
											job_type: newList,
										});
									}}
								/>
								<label htmlFor="job_type_3">Contract</label>
							</div>
						</div>

						<button type="submit" className="btn btn-primary mt-16 btn-block">
							Add Job
						</button>
					</form> */}
				</motion.main>
			</ProtectedPageContainer>
		</>
	);
};

export default CreateNewJobPage;
