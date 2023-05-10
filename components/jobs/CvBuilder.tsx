import { FC, useState } from "react";
import { HEducation, HWorkExperience, IUserHunter } from "@/lib/types";
import { MdAdd, MdCheckCircle, MdDelete } from "react-icons/md";

import { $accountDetails } from "@/lib/globalStates";
import dayjs from "dayjs";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";

const templates = [
	{
		name: "Default",
		value: "default",
		image: "/cvtemplate/preview_default.png",
	},
	{
		name: "Carlo 1",
		value: "carlo1",
		image: "/cvtemplate/preview_carlo1.png",
	},
	{
		name: "Carlo 2",
		value: "carlo2",
		image: "/cvtemplate/preview_carlo2.png",
	},
	{
		name: "Carlo 3",
		value: "carlo3",
		image: "/cvtemplate/preview_carlo3.png",
	},
	{
		name: "Carlo 4",
		value: "carlo4",
		image: "/cvtemplate/preview_carlo4.png",
	},
	{
		name: "Carlo 5",
		value: "carlo5",
		image: "/cvtemplate/preview_carlo5.png",
	},
	{
		name: "Gabbie 1",
		value: "gabbie1",
		image: "/cvtemplate/preview_gab1.png",
	},
	{
		name: "Novie 1",
		value: "novie1",
		image: "/cvtemplate/preview_novie1.png",
	},
	{
		name: "Novie 2",
		value: "novie2",
		image: "/cvtemplate/preview_novie2.png",
	},
	{
		name: "Novie 3",
		value: "novie3",
		image: "/cvtemplate/preview_novie3.png",
	},
];

const summaryWritingTips = [
	{
		label: "Keep it concise.",
		description:
			"Your summary should be no more than 3-4 sentences long. Keep it short and sweet, while still conveying your most important qualifications and achievements",
	},
	{
		label: "Highlight your key skills and experiences",
		description:
			"Use your summary to showcase your most relevant skills and experiences for the job you're applying for. This is your chance to grab the reader's attention and make a strong first impression",
	},
	{
		label: "Tailor it to the job application",
		description:
			"Make sure your summary reflects the specific requirements of the job you're applying for. Use keywords from the job description to help demonstrate your fit for the position",
	},
	{
		label: "Be specific",
		description:
			"Avoid vague statements that could apply to anyone. Instead, be specific about your accomplishments and the impact you've had in previous roles",
	},
	{
		label: "Keep it professional",
		description:
			"Avoid using slang or overly casual language. Your summary should be written in a professional tone that reflects your qualifications and experience",
	},
];

const CvBuilder: FC = () => {
	const _currentUser = useStore($accountDetails) as IUserHunter;
	const [tempUserDetails, setTempUserDetails] =
		useState<IUserHunter>(_currentUser);
	const router = useRouter();
	const [selectedTemplate, setSelectedTemplate] = useState<string>("default");

	const generateCV = async () => {
		toast.loading("Generating CV...");

		// update user details
		const { error } = await supabase
			.from("user_hunters")
			.update({
				cover_letter: tempUserDetails.cover_letter,
			})
			.eq("id", _currentUser.id);

		if (error) {
			toast.error("Something went wrong");
			return;
		}

		toast.dismiss();
		router.push(`/h/jobs/cv?template=${selectedTemplate}`);
	};

	return (
		_currentUser && (
			<>
				<div>
					<h2 className="text-3xl">Build your Wicket CV/Resume here</h2>

					<div className="hidden lg:block mt-10">
						{/* input */}
						<>
							<h4 className="text-lg font-bold">
								Write an introduction about yourself. Then click the button
								below to build a preview of your CV or Resume.
							</h4>
							<textarea
								name="cover_letter"
								// rows={10}
								className="textarea textarea-primary w-full h-max"
								placeholder="Write your introduction here"
								onInput={(e) => {
									e.currentTarget.style.height = "";
									e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
								}}
								onChange={(e) =>
									setTempUserDetails({
										...tempUserDetails,
										cover_letter: e.target.value,
									})
								}
								value={tempUserDetails.cover_letter}
							/>
						</>

						{/* tips */}
						<>
							<h4 className="text-lg font-bold mt-10">
								Summary Writing Tips (hover your pointer for more details)
							</h4>
							<div className="flex flex-wrap gap-2">
								{summaryWritingTips.map((tip, index) => (
									<div
										className="tooltip"
										data-tip={tip.description}
										key={`tip_${index}`}
									>
										<div className="badge badge-lg badge-primary hover:badge-success transition-all cursor-pointer">
											{tip.label}
										</div>
									</div>
								))}
							</div>
						</>

						{/* templates */}
						<>
							<h4 className="text-lg font-bold mt-10">Choose a template</h4>

							<div className="grid grid-cols-2 mt-2 md:grid-cols-4 lg:grid-cols-5 gap-4 ">
								{templates.map((template, key) => (
									<div
										key={`template-${key}`}
										onClick={() => setSelectedTemplate(template.value)}
										className={`relative overflow-hidden flex flex-col justify-end items-center h-[140px] border-2 border-primary/0 cursor-pointer hover:scale-[0.98] transition rounded-btn bg-base-300 ${
											selectedTemplate === template.value &&
											"text-primary border-primary/100"
										}`}
									>
										<img
											src={template.image}
											alt=""
											className={`absolute h-full w-full object-cover object-center ${
												selectedTemplate === template.value
													? "opacity-25"
													: "opacity-100"
											}`}
										/>
										<div className="absolute w-full h-full inset-0 bg-gradient-to-t from-base-100 to-transparent z-20 ">
											{" "}
										</div>
										<MdCheckCircle
											className={`absolute text-4xl top-1/2 -translate-y-1/2 transition-all ${
												selectedTemplate === template.value
													? "opacity-100"
													: "opacity-0"
											}`}
										/>
										<p className="absolute bottom-2 z-30">{template.name}</p>
									</div>
								))}
							</div>
						</>

						{/* generate button */}
						<>
							<div className="mt-10">
								<button
									disabled={tempUserDetails.cover_letter.length < 200}
									className="btn btn-primary w-full"
									onClick={() => {
										if (tempUserDetails.cover_letter.length < 200) {
											toast.error(
												"Your cover letter must be at least 200 characters long",
											);
											return;
										}
										generateCV();
									}}
								>
									Submit and Generate CV
								</button>
							</div>
						</>
					</div>

					<div className="alert alert-info mt-10 lg:hidden">
						This feature is only available on desktop. Please use a laptop or a
						desktop computer to build your CV or Resume.
					</div>
				</div>
			</>
		)
	);
};




// <div className="mt-10">
// 	<h4 className="text-lg font-bold">
// 		Write a cover letter to the hiring manager. Then click the button
// 		below to generate your CV or Resume.
// 	</h4>

// 	<textarea
// 		name="cover_letter"
// 		rows={10}
// 		className="textarea textarea-primary w-full"
// 		placeholder="Write your cover letter here"
// 		onChange={(e) =>
// 			setTempUserDetails({
// 				...tempUserDetails,
// 				cover_letter: e.target.value,
// 			})
// 		}
// 	>
// 		{tempUserDetails.cover_letter}
// 	</textarea>
// 	{tempUserDetails.cover_letter.length < 200 && (
// 		<p className="text-sm text-red-500">
// 			Your cover letter must be at least 200 characters long
// 		</p>
// 	)}

// 	{/* templates */}
// 	<p className="mt-10 text-2xl font-bold">Select Template</p>
// 	<div className="grid grid-cols-2 mt-2 md:grid-cols-4 lg:grid-cols-5 gap-4 ">
// 		{templates.map((template, key) => (
// 			<div
// 				key={`template-${key}`}
// 				onClick={() => setSelectedTemplate(template.value)}
// 				className={`relative overflow-hidden flex flex-col justify-end items-center h-[140px] border-2 border-primary/0 cursor-pointer hover:scale-[0.98] transition rounded-btn bg-base-300 ${selectedTemplate === template.value &&
// 					"text-primary border-primary/100"
// 					}`}
// 			>
// 				<img
// 					src={template.image}
// 					alt=""
// 					className={`absolute h-full w-full object-cover object-center ${selectedTemplate === template.value
// 						? "opacity-25"
// 						: "opacity-100"
// 						}`}
// 				/>
// 				<div className="absolute w-full h-full inset-0 bg-gradient-to-t from-base-100 to-transparent z-20 ">
// 					{" "}
// 				</div>
// 				<MdCheckCircle
// 					className={`absolute text-4xl top-1/2 -translate-y-1/2 transition-all ${selectedTemplate === template.value
// 						? "opacity-100"
// 						: "opacity-0"
// 						}`}
// 				/>
// 				<p className="absolute bottom-2 z-30">{template.name}</p>
// 			</div>
// 		))}
// 	</div>

// 	<div className="flex justify-end mt-5 gap-2">

// 	</div>
// </div>

export default CvBuilder;
