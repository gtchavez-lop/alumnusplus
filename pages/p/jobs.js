import { AnimatePresence, motion } from "framer-motion";
import { FiLoader, FiPlus, FiX } from "react-icons/fi";

import IndustryTypes from "../../schemas/industryTypes.json";
import JobCardProv from "@/components/Jobs/JobCardProv";
import ProtectedPageContainer from "@/components/ProtectedPageContainer";
import { ReactMarkdown } from "react-markdown";
import { __PageTransition } from "../../lib/animation";
import { __supabase } from "../../supabase";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import uuidv4 from "../../lib/uuidv4";

// import { useSupabaseClient } from "@supabase/auth-helpers-react";

const JobPostings = () => {
	const [addPostModalShown, setAddPostModalShown] = useState(false);
	const thisSession = useSession();
	const thisUser = useUser();

	const fetchProvJobs = async () => {
		const { data, error } = await __supabase.from("public_jobs").select("*").eq("uploader_id", thisUser.id);

		if (error) {
			console.log(error);
			return [];
		}

		return data;
	};

	const provJobs = useQuery({
		queryKey: ["provJobList"],
		queryFn: fetchProvJobs,
		onSuccess: () => {
			console.log("provJobs loaded");
		},
		onError: () => {
			console.log("provJobs failed to load");
		},
		suspense: true,
		enabled: !!thisUser,
	});

	return (
		<ProtectedPageContainer>
			{!provJobs.isLoading ? (
				<>
					<motion.main
						variants={__PageTransition}
						initial="initial"
						animate="animate"
						exit="exit"
						className="relative min-h-screen w-full flex flex-col gap-10 pt-24 pb-36"
					>
						<button onClick={() => setAddPostModalShown(true)} className="btn btn-primary items-center gap-2">
							<span>Add new job</span>
							<FiPlus />
						</button>

						<div>
							<p className="text-3xl mb-2">Active Job Posts</p>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								{provJobs.data.map((job, index) => (
									<JobCardProv job={job} key={`jobcard_${index}`} />
								))}
							</div>
						</div>
					</motion.main>

					<AnimatePresence mode="wait">
						{addPostModalShown && (
							<AddJobPostModal setModalShown={setAddPostModalShown} key={`modalShown_${addPostModalShown}`} />
						)}
					</AnimatePresence>
				</>
			) : (
				<motion.main
					variants={__PageTransition}
					initial="initial"
					animate="animate"
					exit="exit"
					className="relative min-h-screen w-full flex flex-col justify-center items-center"
				>
					<FiLoader className="animate-spin text-4xl text-primary" />
				</motion.main>
			)}
		</ProtectedPageContainer>
	);
};

const AddJobPostModal = ({ setModalShown }) => {
	const { reload } = useRouter();
	const [jobqualifications, setJobQualifications] = useState(["Wicket Profile"]);
	const [addJobSchema, setAddJobSchema] = useState({
		job_title: "",
		full_description: "",
		short_description: "",
		job_qualifications: ["Wicket Profile"],
		job_location: "",
		job_type: "",
	});

	const addJob = async (e) => {
		e.preventDefault();

		const {
			data: { user },
		} = await __supabase.auth.getUser();

		toast.loading("Adding job post...");

		const formData = new FormData(e.target);

		setAddJobSchema({
			...addJobSchema,
			job_title: formData.get("job_title"),
			full_description: formData.get("full_description"),
			short_description: formData.get("short_description"),
			job_qualifications: jobqualifications,
			job_location: formData.get("job_location"),
		});

		console.clear();
		console.log(addJobSchema);

		// check if all fields are filled
		for (const [key, value] of Object.entries(addJobSchema)) {
			if (value === "") {
				toast.dismiss();
				toast.error(`Please fill in the ${key}`);
				return;
			}
		}

		const { error: jobPostError } = await __supabase.from("public_jobs").insert([
			{
				...addJobSchema,
				id: uuidv4(),
				uploader_id: user.id,
				created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			},
		]);

		if (jobPostError) {
			toast.dismiss();
			toast.error(jobPostError.message);
			return;
		}

		toast.dismiss();
		toast.success("Job post added successfully");
		setModalShown(false);
		reload();
	};

	return (
		<motion.main
			initial={{ opacity: 0 }}
			animate={{ opacity: 1, transition: { ease: "circOut", duration: 0.2 } }}
			exit={{ opacity: 0, transition: { ease: "circIn", duration: 0.2 } }}
			onClick={(e) => {
				e.currentTarget === e.target && setModalShown(false);
			}}
			className="fixed top-0 left-0 w-full h-screen bg-base-300 bg-opacity-50"
		>
			<motion.section
				initial={{ opacity: 0, x: 200 }}
				animate={{
					opacity: 1,
					x: 0,
					transition: { ease: "circOut", duration: 0.2, delay: 0.2 },
				}}
				exit={{
					opacity: 0,
					x: 200,
					transition: { ease: "circIn", duration: 0.2 },
				}}
				className="absolute w-full max-w-lg right-0 max-h-screen px-5 py-24 top-0 bg-base-100 overflow-y-auto"
			>
				<p className="text-2xl font-bold">Add new Post</p>

				<form className="mt-5" onSubmit={addJob}>
					{/* job title */}
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

					{/* descriptions */}
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

					{/* job location */}
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

					{/* job qualifications */}
					<div className="flex flex-col gap-1 mt-5">
						<label>Job Qualifications</label>
						{/* input field, press enter to add to jobqualifications array */}
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
						{/* list of qualifications */}
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

					{/* job type */}
					<div className="flex flex-col gap-1 mt-5">
						<label>Job Type</label>
						{/* checkboxes */}
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
				</form>
			</motion.section>
		</motion.main>
	);
};

export default JobPostings;
