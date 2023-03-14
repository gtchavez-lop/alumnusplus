import { MdEmail, MdPhone, MdPrint, MdWarning } from "react-icons/md";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { IUserHunter } from "@/lib/types";
import Image from "next/image";
import { NextPage } from "next";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { motion } from "framer-motion";
import { useStore } from "@nanostores/react";
import dayjs from "dayjs";

const Template_1: NextPage = () => {
	const _currentUser = useStore($accountDetails) as IUserHunter;

	return (
		!!_currentUser && (
			<>
				<motion.main
					variants={AnimPageTransition}
					initial="initial"
					animate="animate"
					exit="exit"
					className="relative min-h-screen w-full pt-24 print:pt-0 pb-36 print:pb-0"
				>
					{/* show warning if on mobile */}
					<div className="absolute alert alert-warning shadow-lg lg:hidden print:invisible">
						<div>
							<MdWarning className="inline-block mr-2" />
							<span>This feature is for desktop only</span>
						</div>
					</div>

					{/* mobile restrict */}
					<div className="hidden lg:block print:block">
						{/* header */}
						<div className="grid grid-cols-5 gap-5 mt-4">
							{/* <div className="grid grid-cols-2 items-center">
								<h1 className="text-7xl font-bold">
									{_currentUser.full_name.first} {_currentUser.full_name.last}
								</h1>
								<p className="text-4xl font-thin text-center">
									{_currentUser.skill_primary}
								</p>
							</div> */}
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
								<h1 className="text-8xl font-bold">
									{_currentUser.full_name.first}
								</h1>
								<h1 className="text-8xl font-bold">
									{_currentUser.full_name.last}
								</h1>
								<p className="text-2xl font-thin">
									{_currentUser.skill_primary}
								</p>
							{/* <div className="divider">

								</div> */}
								
							</div>


							<div className="col-span-2 row-start-3">
								<h2 className="text-2xl leading-loose col-span-1 text-primary font-semibold">
									ABOUT ME
								</h2>
								<p className="text-justify leading-tight">
									{_currentUser.cover_letter}
								</p>
								<div className="divider">

								</div>

								<h2 className="text-2xl leading-loose text-primary font-semibold">
									SKILLSET
								</h2>
								<div className="flex flex-wrap gap-2">
									<ul className="list-disc pl-5">
									<li className="font-bold text-primary">
										{_currentUser.skill_primary}
									</li> 

									{_currentUser.skill_secondary.map((skill, index) => (
										<li
											key={`secondary_skill_${index}`}
										>
											{skill}
										</li>
									))}
									</ul>
								</div>

								<div className="divider"/>

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
								{/* <div className="divider">

								</div> */}
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
										<p>
											No education history yet
										</p>
									)}
								</p>

								<div className="divider">

								</div>

								<h2 className="text-2xl leading-loose text-primary font-semibold">WORK HISTORY</h2>
								<p className="text-justify font-semibold">
									{_currentUser.experience.map((work, index) => (
										<div
											key={`work_experience_${index}`}
										>
											<p className="text-xl font-bold underline underline-offset-4">
												{work.companyName}
											</p>
											<p>{work.jobPosition}</p>
											<p>{work.location}</p>
											<p>
												{dayjs(work.startDate).format("MMMM D, YYYY")} -{" "}
												{work.isCurrent ? "Present" : dayjs(work.endDate).format("MMMM D, YYYY")}
											</p>
										</div>
									))}
									{_currentUser.experience.length === 0 && (
										<p >No work experience yet</p>
									)}
								</p>

								<div className="divider">

								</div>
								<h2 className="text-2xl leading-loose text-primary font-semibold">
									SEMINARS/TRAININGS
								</h2>
								<div className="flex flex-col gap-2">
									{_currentUser.trainings.map((item, index) => (
									<div>
										<h2 className="text-xl font-bold underline underline-offset-8">
											{item.title}
										</h2>
										<p>
											{item.organizer}
										</p>
										<p>
											{item.location}
										</p>
										<p>
											{dayjs(item.date).format("MMMM D, YYYY")}
										</p>
									</div>
								))}
								</div>
							</div>
							
						</div>

						{/* <div className="grid grid-cols-2 mt-10">
							<div className="py-2 ml-auto text-right">
								<h2 className="text-2xl leading-none font-bold text-primary divider">
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
						</div> */}
						{/* <div className="grid grid-cols-3 mt-10">
							<h2 className="text-2xl leading-none font-bold col-span-1 text-primary">
								Work Experience
							</h2>
							<div className="col-span-2 flex flex-col gap-2">
								{_currentUser.experience.map((work, index) => (
									<div
										key={`work_experience_${index}`}
										className="p-3 border-2 border-primary border-opacity-25 rounded-btn"
									>
										<p className="text-xl font-bold underline underline-offset-4">
											{work.companyName}
										</p>
										<p className="text-base-content">{work.jobPosition}</p>
										<p className="text-base-content">{work.location}</p>
										<p className="text-base-content text-sm opacity-75">
											{work.startDate} -{" "}
											{work.isCurrent ? "Present" : work.endDate}
										</p>
									</div>
								))}
								{_currentUser.experience.length === 0 && (
									<p className="text-base-content">No work experience yet</p>
								)}
							</div>
						</div> */}

						{/* <div className="grid grid-cols-3 mt-10">
							<h2 className="text-2xl leading-none font-bold col-span-1 text-primary">
								Related Skills
							</h2>
							<div className="col-span-2 flex flex-wrap gap-2">
								<p className="badge badge-primary badge-lg">
									{_currentUser.skill_primary}
								</p>
								{_currentUser.skill_secondary.map((skill, index) => (
									<p
										key={`secondary_skill_${index}`}
										className="badge badge-ghost badge-lg"
									>
										{skill}
									</p>
								))}
							</div>
						</div> */}

						{/* <div className="grid grid-cols-3 mt-10">
							<h2 className="text-2xl leading-none font-bold col-span-1 text-primary">
								Education History
							</h2>
							<div className="col-span-2 flex flex-col gap-2">
								{_currentUser.education.map((edu, index) => (
									<div
										key={`education_${index}`}
										className="p-3 border-2 border-primary border-opacity-25 rounded-btn"
									>
										<p className="text-xl font-bold underline underline-offset-4">
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
						</div> */}

						{/* print button */}
						<div className="fixed bottom-0 right-0 mb-5 mr-5 print:hidden">
							<button
								onClick={() => window.print()}
								className="btn btn-primary btn-lg gap-2 btn-block"
							>
								<MdPrint />
								Print
							</button>
						</div>
					</div>
				</motion.main>
			</>
		)
	);
};

export default Template_1;
