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

const Novie2: FC = () => {
	const _currentUser = useStore($accountDetails) as IUserHunter;

	return (
		_currentUser && (
			<>
				<div className="flex justify-center items-center">
                    <Image
                        src={_currentUser.avatar_url}
                        alt="profile picture"
                        width={150}
                        height={150}
                        className="mr-4"
                    />

                    <div>
                        <p className="text-4xl font-bold">
                            {_currentUser.full_name.first} {_currentUser.full_name.last}
                        </p>
                        <p className="text-xl">{_currentUser.skill_primary}</p>
                    </div>

				</div>

                <ReactMarkdown className="prose max-w-max mt-10">
					{_currentUser.cover_letter}
				</ReactMarkdown>


				{/* experience */}

                <div className="grid grid-cols-2 gap-10 mt-10">
                    <div className="flex flex-col">
                        <h2 className="text-2xl border-b-2 border-base-content/50 w-full">
                                Job Experiences
                        </h2>
                        {_currentUser.experience.map((exp, index) => (
                        <div className="col-span-4 mt-4" key={`exp_${index}`}>
								<p className="text-xl font-bold">{exp.jobPosition} |{" "} {exp.location}</p>
								<p className="italic">								
									<span>{dayjs(exp.startDate).format("MMMM YYYY")} to </span>
									<span>
										{exp.isCurrent
											? "Current"
											: dayjs(exp.endDate).format("MMMM YYYY")}
									</span>
								</p>
								<ReactMarkdown className="prose max-w-max mt-3">
									{exp.description}
								</ReactMarkdown>
                        </div>
                        ))}

                    <div className="flex flex-col mt-4">
                        <h2 className="text-2xl border-b-2 border-base-content/50 w-full">
                        Trainings and Seminars
                        </h2>
                        {_currentUser.trainings.map((training, index) => (
                        <div className="col-span-4 mt-4" key={`training_${index}`}>
								<p className="text-xl capitalize font-bold">{training.title} | {training.type}</p>
								<p className="">								
                                {training.organizer}
								</p>								<p className="italic">								
                                {dayjs(training.date).format("YYYY MMMM")} | {training.location}
								</p>
                        </div>
                        ))}

                    </div>
                </div>


                {/* Contact , Skills, Education */}
                    <div className="flex flex-col">
                        <div>
                            <h2 className="text-2xl border-b-2 border-base-content/50 w-full">
                                Contact
                            </h2>
                                <div className="flex flex-col mt-4" >
                                    <div className="flex flex-row items-center">
                                        <MdPhone className="w-5 h-5 mr-3" />
                                        <p>
                                            {_currentUser.phone.length > 0
                                            ? _currentUser.phone
                                            : "-------------------------"}
                                        </p>
                                    </div>

                                    <div className="flex flex-row items-center">
                                        <MdEmail className="w-5 h-5 mr-3" />
                                        <p>
                                            {_currentUser.email.length > 0
                                                ? _currentUser.email
                                                : "-------------------------"}
                                        </p>
                                    </div>
                                </div>
                        </div>

                        <div>
                            <h2 className="text-2xl border-b-2 border-base-content/50 w-full mt-5">
                                Skillset
                            </h2>
                            {/* primary */}
                            <div className="grid grid-cols-5 mt-4">
                                <div className="col-span-1">
                                    <p className="flex gap-2 font-bold mt-[3px]">Primary Skill</p>
                                </div>
                                <div className="col-span-4 ml-5 mt-1">
                                    <p className="capitalize">{_currentUser.skill_primary}</p>
                                </div>
                            </div>
                            {/* secondary */}
                            <div className="grid grid-cols-5 mt-3">
                                <div className="col-span-1">
                                    <p className="flex gap-2 font-bold mt-[3px]">Secondary Skills</p>
                                </div>
                                <div className="col-span-4 ml-5 mt-1">
                                    {_currentUser.skill_secondary.map((skill, index) => (
                                        <p className="capitalize " key={`skillsec_${index}`}>
                                            {skill}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl border-b-2 border-base-content/50 w-full mt-5">
                                Education History
                            </h2>
                            {_currentUser.education.map((edu, index) => (
                                <div className="col-span-4 mt-4" key={`edu_${index}`}>
                                    <p className="text-xl capitalize font-bold">{edu.degreeType} |{" "} {edu.degreeName}</p>
                                    <p className="italic">
                                        {edu.institution} |	{edu.location} | {edu.yearGraduated}
                                    </p>

                                </div>
                            ))}
                        </div>

                    </div>     
                </div>

			</>
		)
	);
};

export default Novie2;
