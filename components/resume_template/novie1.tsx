import { MdEmail, MdPhone } from "react-icons/md";

import { $accountDetails } from "@/lib/globalStates";
import { FC } from "react";
import { IUserHunter } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { NextPage } from "next";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import dayjs from "dayjs";
import { useStore } from "@nanostores/react";

const Novie1: FC = () => {
	const _currentUser = useStore($accountDetails) as IUserHunter;

	return (
		_currentUser && (
			<>
				<div>
					<p className="text-4xl font-bold">
						{_currentUser.full_name.first} {_currentUser.full_name.last}
					</p>
					<p className="text-xl">{_currentUser.skill_primary}</p>
				</div>

				<div className="grid grid-cols-2 gap-2 mt-10">
					<div className="flex flex-col gap-2">
						<div className="flex gap-2">
							<p className="w-[90px] font-bold">Phone</p>
							<p>
								{_currentUser.phone.length > 0
									? _currentUser.phone
									: "-------------------------"}
							</p>
						</div>
						<div className="flex gap-2">
							<p className="w-[90px] font-bold">Email</p>
							<p>
								{_currentUser.email.length > 0
									? _currentUser.email
									: "-------------------------"}
							</p>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						{
							// get all keys in _currentUser.social_media_links
							Object.keys(_currentUser.social_media_links).map((key) => {
								const selectedKey = key as
									| "facebook"
									| "instagram"
									| "linkedin"
									| "twitter"
									| "youtube"
									| "github";
								const socialObject = {
									socialType: key,
									socialUrl: _currentUser.social_media_links[
										selectedKey
									] as unknown as string,
								};

								return (
									socialObject.socialUrl.length > 0 && (
										<div className="flex gap-2">
											<p className="w-[90px] font-bold capitalize">
												{selectedKey}
											</p>
											<Link href={socialObject.socialUrl}>
												{socialObject.socialUrl}
											</Link>
										</div>
									)
								);
							})
						}
					</div>
				</div>

				<ReactMarkdown className="prose max-w-max mt-10">
					{_currentUser.cover_letter}
				</ReactMarkdown>

				{/* experience */}
				<div className="flex flex-col gap-2 mt-10">
					<h2 className="text-2xl border-b-2 border-base-content/50 w-full">
						Job Experiences
					</h2>
					{_currentUser.experience.map((exp, index) => (
						<div className="grid grid-cols-5" key={`exp_${index}`}>
							<div className="col-span-1">
								<p className="flex font-bold mt-[3px] flex-col">
									<span>{dayjs(exp.startDate).format("YYYY-MM")} to</span>
									<span>
										{exp.isCurrent
											? "Current"
											: dayjs(exp.endDate).format("YYYY-MM")}
									</span>
								</p>
							</div>
							<div className="col-span-4">
								<p className="text-xl font-bold">{exp.jobPosition}</p>
								<p className="italic">{exp.location}</p>
								<ReactMarkdown className="prose max-w-max mt-3">
									{exp.description}
								</ReactMarkdown>
							</div>
						</div>
					))}
				</div>

				{/* Education */}
				<div className="flex flex-col gap-2 mt-10">
					<h2 className="text-2xl border-b-2 border-base-content/50 w-full">
						Education History
					</h2>
					{_currentUser.education.map((edu, index) => (
						<div className="grid grid-cols-5" key={`education_${index}`}>
							<div className="col-span-1">
								<p className="flex gap-2 font-bold mt-[3px]">
									Year {edu.yearGraduated}
								</p>
							</div>
							<div className="col-span-4">
								<p className="text-xl capitalize font-bold">
									{edu.degreeType} | {edu.degreeName}
								</p>
								<p className="underline underline-offset-2 mt-2">
									{edu.institution}
								</p>
								<p className="italic">{edu.location}</p>
							</div>
						</div>
					))}
				</div>

				{/* Skill */}
				<div className="flex flex-col gap-2 mt-10">
					<h2 className="text-2xl border-b-2 border-base-content/50 w-full">
						Skillset
					</h2>
					{/* primary */}
					<div className="grid grid-cols-5">
						<div className="col-span-1">
							<p className="flex gap-2 font-bold mt-[3px]">Primary Skill</p>
						</div>
						<div className="col-span-4">
							<p className="text-xl capitalize">{_currentUser.skill_primary}</p>
						</div>
					</div>
					{/* secondary */}
					<div className="grid grid-cols-5">
						<div className="col-span-1">
							<p className="flex gap-2 font-bold mt-[3px]">Secondary Skills</p>
						</div>
						<div className="col-span-4 flex gap-7 flex-wrap">
							{_currentUser.skill_secondary.map((skill, index) => (
								<p className="text-xl capitalize " key={`skillsec_${index}`}>
									{skill}
								</p>
							))}
						</div>
					</div>
				</div>

				{/* Trainings and Seminars */}
				<div className="flex flex-col gap-2 mt-10">
					<h2 className="text-2xl border-b-2 border-base-content/50 w-full">
						Trainings and Seminars
					</h2>
					{_currentUser.trainings.map((training, index) => (
						<div className="grid grid-cols-5" key={`training_${index}`}>
							<div className="col-span-1">
								<p className="flex gap-2 font-bold mt-[3px]">
									{dayjs(training.date).format("YYYY MMMM")}
								</p>
							</div>
							<div className="col-span-4">
								<p className="text-xl capitalize font-bold">
									{training.type} | {training.title}
								</p>
								<p className="italic">{training.location}</p>
							</div>
						</div>
					))}
				</div>
			</>
		)
	);
};

export default Novie1;
