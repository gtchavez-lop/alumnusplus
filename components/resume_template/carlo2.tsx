import { MdEmail, MdPhone } from "react-icons/md";

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
			<div className="grid grid-cols-5 gap-5 mt-4">
				<div className="col-span-2 row-start-1 row-span-2 mx-auto">
					<Image
						src={_currentUser.avatar_url}
						alt="profile picture"
						width={200}
						height={200}
						className=" items-center rounded-btn"
					/>
				</div>
				<div className="text-left row-start-1 row-span-2 col-span-3 px-10">
					<h1 className="text-8xl font-bold">{_currentUser.full_name.first}</h1>
					<h1 className="text-8xl font-bold">{_currentUser.full_name.last}</h1>
					<p className="text-2xl font-thin">{_currentUser.skill_primary}</p>
				</div>

				<div className="col-span-2 row-start-3">
					<h2 className="text-2xl leading-loose col-span-1 text-primary font-semibold">
						ABOUT ME
					</h2>
					<p className="text-justify leading-tight">
						{_currentUser.cover_letter}
					</p>
					<div className="divider" />

					<h2 className="text-2xl leading-loose text-primary font-semibold">
						SKILLSET
					</h2>
					<div className="flex flex-wrap gap-2">
						<ul className="list-disc pl-5">
							<li className="font-bold text-primary">
								{_currentUser.skill_primary}
							</li>

							{_currentUser.skill_secondary.map((skill, index) => (
								<li key={`secondary_skill_${index}`}>{skill}</li>
							))}
						</ul>
					</div>

					<div className="divider" />

					<h2 className="text-2xl leading-loose text-primary font-semibold">
						CONTACT INFO
					</h2>
					<p className="flex items-center gap-2">
						<MdEmail />
						{_currentUser.email}
					</p>
					<p className="flex items-center gap-2">
						<MdPhone />
						{_currentUser.phone}
					</p>
				</div>

				<div className="text-left col-span-3 row-start-3">
					<h2 className="text-2xl leading-loose text-primary font-semibold">
						EDUCATION
					</h2>
					<p className="text-justify font-semibold">
						{_currentUser.education.map((edu, index) => (
							<div key={`education_${index}`}>
								<p className="text-xl font-bold underline underline-offset-8">
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

					<div className="divider" />

					<h2 className="text-2xl leading-loose text-primary font-semibold">
						WORK HISTORY
					</h2>
					<p className="text-justify font-semibold">
						{_currentUser.experience.map((work, index) => (
							<div key={`work_experience_${index}`}>
								<p className="text-xl font-bold underline underline-offset-4">
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

					<div className="divider" />
					<h2 className="text-2xl leading-loose text-primary font-semibold">
						SEMINARS/TRAININGS
					</h2>
					<div className="flex flex-col gap-2">
						{_currentUser.trainings.map((item, index) => (
							<div key={`training_${index}`}>
								<h2 className="text-xl font-bold underline underline-offset-8">
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
