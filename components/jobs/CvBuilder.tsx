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
		name: "Gabbie 1",
		value: "gabbie1",
		image: "/cvtemplate/preview_gab1.png",
	},
	{
		name: "Gabbie 2",
		value: "gabbie2",
		image: "/cvtemplate/preview_gab2.png",
	},
];

const CvBuilder: FC = () => {
	const _currentUser = useStore($accountDetails) as IUserHunter;
	const [tempUserDetails, setTempUserDetails] =
		useState<IUserHunter>(_currentUser);
	const router = useRouter();
	const [selectedTemplate, setSelectedTemplate] = useState<string>("default");
	const [templateSelectorRef] = useAutoAnimate<HTMLDivElement>({
		duration: 0.5,
	});

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
					<h2 className="text-3xl">Build your Wicket CV here</h2>

					<div className="mt-10">
						<h4 className="text-lg font-bold">
							Write a cover letter to the hiring manager. Then click the button
							below to generate your CV.
						</h4>

						<textarea
							name="cover_letter"
							rows={10}
							className="textarea textarea-primary w-full"
							placeholder="Write your cover letter here"
							onChange={(e) =>
								setTempUserDetails({
									...tempUserDetails,
									cover_letter: e.target.value,
								})
							}
						>
							{tempUserDetails.cover_letter}
						</textarea>
						{tempUserDetails.cover_letter.length < 200 && (
							<p className="text-sm text-red-500">
								Your cover letter must be at least 200 characters long
							</p>
						)}

						{/* templates */}
						<p className="mt-10 text-2xl font-bold">Select Template</p>
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

						<div className="flex justify-end mt-5 gap-2">
							<button
								disabled={tempUserDetails.cover_letter.length < 200}
								className="btn btn-primary"
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
					</div>
				</div>
			</>
		)
	);
};

export default CvBuilder;
