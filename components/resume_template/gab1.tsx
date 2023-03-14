import { MdEmail, MdPhone } from "react-icons/md";

import { $accountDetails } from "@/lib/globalStates";
import { IUserHunter } from "@/lib/types";
import Image from "next/image";
import { NextPage } from "next";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import dayjs from "dayjs";
import { useStore } from "@nanostores/react";

const Gab1: NextPage = () => {
	const _currentUser = useStore($accountDetails) as IUserHunter;

	return (
		<>
			<div className="flex justify-evenly md:justify-center gap-3 py-2 pt-4 w-full ">
				{/* <Image
        src={_currentUser.avatar_url}
        alt="profile picture"
        width={125}
        height={125}
        className="rounded-btn"
    /> */}

				<div className="flex flex-col items-center">
					<h1 className="text-3xl font-bold ">
						{_currentUser.full_name.first} {_currentUser.full_name.last}
					</h1>
					<p className="leading-3">{_currentUser.address.city}</p>
					<p>{_currentUser.email}</p>
					<p>{_currentUser.phone}</p>
				</div>
			</div>

			<div className="flex flex-col mt-10 ">
				<h2 className="text-lg text-left mb-2 font-bold underline underline-offset-4 ">
					PROFESSIONAL SUMMARY
				</h2>
				<ReactMarkdown className="mt-4 text-justify items-center  prose prose-sm max-w-max">
					{_currentUser.cover_letter}
				</ReactMarkdown>
			</div>

			<div className="flex flex-col mt-10">
				<h2 className="text-lg text-left mb-2 font-bold underline underline-offset-4 ">
					WORK EXPERIENCE
				</h2>
				<div className="flex flex-col gap-2 mt-4">
					{_currentUser.experience.map((work, index) => (
						<div
							key={`work_experience_${index}`}
							className="grid grid-cols-2 mt-2 border-2 border-primary rounded-btn p-3 border-opacity-40"
						>
							<p className="font-bold col-span-2 leading-3">
								{work.jobPosition}
							</p>
							<p className="opacity-75">
								{work.companyName}, {work.location}
							</p>
							<p className="opacity-75 text-right">
								{dayjs(work.startDate).format("MMMM D, YYYY")} -{" "}
								{work.isCurrent
									? "Present"
									: dayjs(work.endDate).format("MMMM D, YYYY")}
							</p>
							<div className="mt-2  ">
								<p>{work.description}</p>
							</div>
						</div>
					))}
					{_currentUser.experience.length === 0 && (
						<p className="opacity-75">No work experience yet</p>
					)}
				</div>
			</div>

			<div className="flex flex-col mt-10">
				<h2 className="text-lg text-left mb-2 font-bold underline underline-offset-4 ">
					EDUCATION
				</h2>
				<div className="flex flex-col gap-2 mt-4">
					{_currentUser.education.map((edu, index) => (
						<div key={`education_${index}`} className="grid grid-cols-2 mt-2">
							<p className="font-bold col-span-2 leading-3">
								<span className="capitalize">{edu.degreeType}</span> -{" "}
								{edu.degreeName}
							</p>
							<p className="opacity-75">{edu.institution}</p>
							<p className="opacity-75 text-right">{edu.yearGraduated}</p>
						</div>
					))}
					{_currentUser.education.length === 0 && (
						<p className="opacity-75">No education history yet</p>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 grid-col mt-10">
				<h2 className="text-lg text-left mb-2 font-bold underline underline-offset-4  ">
					SKILLS
				</h2>
				<div className="flex flex-wrap gap-1 mt-4">
					<p className="text-primary px-2 py-1 rounded-full">
						{_currentUser.skill_primary}
					</p>
					{_currentUser.skill_secondary.map((skill, index) => (
						<p
							key={`secondary_skill_${index}`}
							className="bg-base-200 text-base-content px-2 py-1 rounded-full"
						>
							{skill}
						</p>
					))}
				</div>
			</div>

			<div className="flex flex-col mt-10">
				<h2 className="text-lg text-left font-bold col-span-1 border-b-2 underline underline-offset-4 ">
					PROFESSIONAL CERTIFICATES
				</h2>
				<div className="flex flex-col gap-2 mt-4">
					{_currentUser.trainings.map((training, index) => (
						<div key={`trainings_${index}`} className="grid grid-cols-2 mt-2">
							<p className="font-semibold col-span-2 leading-3">
								<span className="capitalize">{training.title}</span>
							</p>
							<p className="opacity-75">{training.organizer}</p>
							<p className="opacity-75 text-right">
								{dayjs(training.date).format("MMMM D, YYYY")}
							</p>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default Gab1;
