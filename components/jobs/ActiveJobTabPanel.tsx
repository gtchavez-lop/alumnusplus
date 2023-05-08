import { $accountData, $accountDetails } from "@/lib/globalStates";
import { IUserHunter, IUserProvisioner, TProvJobPost } from "@/lib/types";

import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { supabase } from "@/lib/supabase";
import { useQueries } from "@tanstack/react-query";
import { useStore } from "@nanostores/react";

interface LocalProvJobPost extends TProvJobPost {
	uploader: IUserProvisioner;
}
const ActiveJobTabPanel = () => {
	const _currentUser = useStore($accountDetails) as IUserHunter;

	const fetchActiveJob = async () => {
		const { data, error } = await supabase
			.from("public_jobs")
			.select("*,uploader:uploader_id(*)")
			.eq("id", _currentUser.activeJob)
			.single();

		if (error) {
			console.log(error);
			return {} as LocalProvJobPost;
		}

		return data as LocalProvJobPost;
	};

	const [activeJob] = useQueries({
		queries: [
			{
				queryKey: ["h.jobs.active"],
				queryFn: fetchActiveJob,
				enabled: !!_currentUser,
				refetchOnMount: false,
				refetchOnWindowFocus: false,
			},
		],
	});

	return (
		<>
			<h2 className="text-3xl">Your current job status</h2>

			{activeJob.isSuccess && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
					<div>
						<div className="flex flex-col gap-5">
							<div className="flex flex-col gap-2">
								<h2 className="text-xl font-bold underline underline-offset-4">
									About the Company
								</h2>
								<ReactMarkdown className="prose">
									{activeJob.data?.uploader.shortDescription ||
										"No description"}
								</ReactMarkdown>
							</div>

							<div className="flex flex-col gap-2">
								<h2 className="text-xl font-bold underline underline-offset-4">
									About the Job
								</h2>
								<ReactMarkdown className="prose">
									{activeJob.data?.short_description || "No description"}
								</ReactMarkdown>
							</div>

							<div className="flex flex-col gap-2">
								<h2 className="text-xl font-bold underline underline-offset-4">
									Skill Profile
								</h2>
								<div className="flex gap-2 flex-wrap">
									{activeJob.data?.job_skills.map((skill, index) => (
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
									{activeJob.data?.job_qualifications.map((qual, index) => (
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
									{activeJob.data.full_description}
								</ReactMarkdown>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ActiveJobTabPanel;