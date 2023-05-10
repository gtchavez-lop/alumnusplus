import { MdEmail, MdHomeFilled, MdPhone } from "react-icons/md";

import { $accountDetails } from "@/lib/globalStates";
import { FC } from "react";
import { IUserHunter } from "@/lib/types";
import Image from "next/image";
import dayjs from "dayjs";
import { useStore } from "@nanostores/react";

const Carlo2: FC = () => {
	const _currentUser = useStore($accountDetails) as IUserHunter;
	return (
		<>
			<div className="grid grid-cols-5 gap-1 mt-4 ml-6">
				<div className="col-span-5 row-start-1 row-span-2 text-center">
					<h1 className="text-7xl font-bold">
						{_currentUser.full_name.first} {_currentUser.full_name.last}
					</h1>
				</div>
				<div className="text-center row-start-3 col-span-5 items-center">
					<div className="flex items-center text-center gap-1 ml-10">
						<MdHomeFilled />
						{_currentUser.address.address} {_currentUser.address.city}
						<MdEmail />
						{_currentUser.email}
						<MdPhone />
						{_currentUser.phone}
					</div>
				</div>
				<div className="col-span-5">
					<div className="divider" />
				</div>

				<div className="col-span-5 row-start-5 mx-auto">
					<h2 className="text-2xl leading-loose text-primary font-bold underline underline-offset-4 mt-auto">
						PROFILE
					</h2>
					<p className="text-left leading-tight ml-10">
						{_currentUser.cover_letter}
					</p>

					<h2 className="text-2xl leading-loose text-primary font-bold underline underline-offset-4 mt-3">
						ACADEMIC BACKGROUND
					</h2>
					<p className="text-justify font-semibold ml-10">
						{_currentUser.education.map((edu, index) => (
							<div key={`education_${index}`}>
								<p className="text-xl font-bold underline underline-offset-8 text-accent">
									{edu.institution}
								</p>
								<p>
									<span className="capitalize">{edu.degreeType}</span> -{" "}
									{edu.degreeName}
								</p>
								<p>{edu.location}</p>
								<p className="text-base-content text-sm opacity-75">
									Graduated on {edu.yearGraduated}
								</p>
							</div>
						))}
						{_currentUser.education.length === 0 && (
							<p>No education history yet</p>
						)}
					</p>

					<h2 className="text-2xl leading-loose text-primary font-bold underline underline-offset-4 mt-3">
						SKILLSET
					</h2>
					<div className="flex flex-wrap gap-2">
						<ul className="list-disc pl-5 ml-10">
							<li className="font-bold text-accent">
								{_currentUser.skill_primary}
							</li>

							{_currentUser.skill_secondary.map((skill, index) => (
								<li key={`secondary_skill_${index}`}>{skill}</li>
							))}
						</ul>
					</div>

					<h2 className="text-2xl leading-loose text-primary font-bold underline underline-offset-4 mt-3">
						EMPLOYMENT RECORD
					</h2>
					<p className="text-justify font-semibold ml-10">
						{_currentUser.experience.map((work, index) => (
							<div key={`work_experience_${index}`}>
								<p className="text-xl font-bold underline underline-offset-4 text-accent">
									{work.companyName}
								</p>
								<p>{work.jobPosition}</p>
								<p>{work.location}</p>
								<p>
									{dayjs(work.startDate).format("MMMM D, YYYY")} -{" "}
									{work.isCurrent
										? "Present"
										: dayjs(work.endDate).format("MMMM D, YYYY")}
								</p>
							</div>
						))}
						{_currentUser.experience.length === 0 && (
							<p>No work experience yet</p>
						)}
					</p>

					<h2 className="text-2xl leading-loose text-primary font-bold underline underline-offset-4 mt-3">
						CERTIFICATIONS
					</h2>
					<div className="flex flex-col gap-2 ml-10">
						{_currentUser.trainings.map((item, index) => (
							<div key={`training_${index}`}>
								<h2 className="text-xl font-bold underline underline-offset-8 text-accent">
									{item.title}
								</h2>
								<p>{item.organizer}</p>
								<p>{item.location}</p>
								<p>{dayjs(item.date).format("MMMM D, YYYY")}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};
export default Carlo2;
