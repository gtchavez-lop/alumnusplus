import { MdEmail, MdPhone } from "react-icons/md";
import { $accountDetails } from "@/lib/globalStates";
import { IUserHunter } from "@/lib/types";
import Image from "next/image";
import { NextPage } from "next";
import dayjs from "dayjs";
import { useStore } from "@nanostores/react";
import { FC } from "react";

const Carlo1: FC = () => {
	const _currentUser = useStore($accountDetails) as IUserHunter;

	return (
		<>
			<div className="flex gap-5 items-start">
				<div>
					<h1 className="text-7xl font-bold leading-none">
						{_currentUser.full_name.first}
					</h1>
					<h1 className="text-7xl font-bold leading-none">
						{_currentUser.full_name.last}
					</h1>
					<p className="text-4xl font-thin leading-none">
						{_currentUser.skill_primary}
					</p>
				</div>

				<Image
					src={_currentUser.avatar_url}
					alt="profile picture"
					width={150}
					height={150}
					className="rounded-btn ml-auto text-right"
				/>
				{/* <div className="py-20 ml-auto text-right">
								<h2 className="text-2xl leading-none font-bold col-span-1 text-primary">
									Contact Info
								</h2>
								<p className="flex items-center justify-end gap-2">
									{_currentUser.email}
									<MdEmail />
								</p>
								<p className="flex items-center justify-end gap-2">
									{_currentUser.phone}
									<MdPhone />
								</p>
							</div> */}
			</div>
			<div className="grid mt-8">
				<h2 className="text-3xl leading-loose text-primary">ABOUT ME</h2>
				<p className="text-justify prose max-w-max font-semibold leading-snug">
					{_currentUser.cover_letter}
				</p>
			</div>
			<div className="divider" />
			<div className="grid grid-cols-2 gap-5">
				<div>
					<h2 className="text-3xl leading-loose text-primary">Education</h2>
					{_currentUser.education.map((edu, index) => (
						<div
							key={`education_${index}`}
							className="p-3 border-2 border-primary border-opacity-50 rounded-btn border-t-8 mt-5 first-of-type:mt-0"
						>
							<p className="text-xl font-bold underline underline-offset-2">
								{edu.institution}
							</p>
							<p className="text-base-content">
								<span className="capitalize">{edu.degreeType}</span> -{" "}
								{edu.degreeName}
							</p>
							<p className="text-base-content">{edu.location}</p>
							<p className="text-base-content text-sm opacity-75">
								Graduated on {edu.yearGraduated}
							</p>
						</div>
					))}
					{_currentUser.education.length === 0 && (
						<p className="text-base-content">No education history yet</p>
					)}
				</div>
				<div>
					<h2 className="text-3xl leading-loose text-primary">
						Work Experience
					</h2>
					{_currentUser.experience.map((work, index) => (
						<div
							key={`work_experience_${index}`}
							className="p-3 border-2 border-primary border-opacity-50 rounded-btn border-t-8 mt-5 first-of-type:mt-0"
						>
							<p className="text-xl font-bold underline underline-offset-2">
								{work.companyName}
							</p>
							<p className="text-base-content">{work.jobPosition}</p>
							<p className="text-base-content">{work.location}</p>
							<p className="text-base-content text-sm opacity-75">
								{dayjs(work.startDate).format("MMMM D, YYYY")} -{" "}
								{work.isCurrent
									? "Present"
									: dayjs(work.endDate).format("MMMM D, YYYY")}
							</p>
						</div>
					))}
					{_currentUser.experience.length === 0 && (
						<p className="text-base-content">No work experience yet</p>
					)}
				</div>
			</div>
			<div className="grid grid-cols-2 gap-5 mt-3">
				<div>
					<h2 className="text-3xl leading-loose text-primary">
						Seminars/Trainings
					</h2>
					<div className="flex flex-col gap-2">
						{_currentUser.trainings.map((item, index) => (
							<div key={`trainings_${index}`}>
								<h2 className="text-2xl font-bold">{item.title}</h2>
								<p className="text-xl font-thin">{item.organizer}</p>
								<p className="text-base font-thin">{item.location}</p>
								<p className="text-base font-thin">{item.date}</p>
							</div>
						))}
					</div>
				</div>
				<div>
					<h2 className="text-3xl leading-loose text-primary">Skillset</h2>
					<div className="flex flex-wrap gap-2 mt-5">
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
			</div>
			<div className="mt-10 ml-auto text-right">
				<h2 className="text-2xl leading-none font-bold text-primary">
					Contact Info
				</h2>
				<p className="flex items-center justify-end gap-2">
					{_currentUser.email}
					<MdEmail />
				</p>
				<p className="flex items-center justify-end gap-2">
					{_currentUser.phone}
					<MdPhone />
				</p>
			</div>
		</>
	);
};

export default Carlo1;
