import { MdEmail, MdPhone, MdPrint, MdWarning } from "react-icons/md";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { IUserHunter } from "@/lib/types";
import Image from "next/image";
import { NextPage } from "next";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { motion } from "framer-motion";
import { useStore } from "@nanostores/react";

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
						<div className="flex gap-5 items-end">
							<div>
								<h1 className="text-7xl font-bold">
									{_currentUser.full_name.first}
								</h1>
								<h1 className="text-7xl font-bold">
									{_currentUser.full_name.last}
								</h1>
								<p className="text-4xl font-thin">
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
						{/* <div className="grid grid-cols-3 mt-10">
							<h2 className="text-2xl leading-none font-bold col-span-1 text-primary">
								ABOUT ME
							</h2>
							<ReactMarkdown className="col-span-2 text-justify prose prose-sm max-w-max">
								{_currentUser.cover_letter}
							</ReactMarkdown>
						</div> */}
						<div className="grid mt-6">
							<h2 className="text-3xl leading-loose col-span-1 text-primary font-thin">
								ABOUT ME
							</h2>
							<p className="text-justify prose prose-base max-w-max leading-relaxed font-semibold">
								{_currentUser.cover_letter}
							</p>
						</div>
						<div className="grid grid-cols-2 gap-5 mt-2">
							<div className="text-3xl leading-loose col-span-1 text-primary font-thin">
								<h2>Education</h2>
								<p className="text-justify prose prose-base max-w-max leading-tight font-semibold">
								{_currentUser.education.map((edu, index) => (
									<div
										key={`education_${index}`}
										className="p-3 border-2 border-primary border-opacity-50 rounded-btn border-t-8"
									>
										<p className="text-xl font-bold underline underline-offset-8">
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
								</p>
							</div>
							<div className="text-3xl leading-loose col-span-1 text-primary font-thin">
								<h2>Work Experience</h2>
								<p className="text-justify prose prose-base max-w-max leading-tight font-semibold">
								{_currentUser.experience.map((work, index) => (
									<div
										key={`work_experience_${index}`}
										className="p-3 border-2 border-primary border-opacity-50 rounded-btn border-t-8"
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
								</p>
							</div>
						</div>
						{/* <div className=" mt-10">
							<h2 className="text-2xl leading-none font-bold text-primary">
								Skillset
							</h2>
							<div className="flex flex-wrap gap-2 mt-5">
								<p className="badge badge-primary badge-lg">
									{_currentUser.skill_primary}
								</p>
								{_currentUser.skill_secondary.map((skill, index) => (
									<p
										key={`secondary_skill_${index}`}
										className="badge badge-ghost badge-lg badge-outline"
									>
										{skill}
									</p>
								))}
							</div>
						</div> */}
						<div className="grid grid-cols-2 gap-5 mt-6">
							<div className="text-3xl leading-loose col-span-1 text-primary font-thin">
							<h2 className="text-3xl leading-none font-thin text-primary">
								Seminars/Trainings
							</h2>
							{}
							</div>
							<div className="text-3xl leading-loose col-span-1 text-primary font-thin">
							<h2 className="text-3xl leading-none font-thin text-primary">
								Skillset
							</h2>
							<div className="flex flex-wrap gap-2 mt-5">
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
							</div>
						</div>
						<div className="grid grid-cols-2 mt-10">
							<div>
							</div>
							<div className="py-10 ml-auto text-right">
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
							</div>
						</div>
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
