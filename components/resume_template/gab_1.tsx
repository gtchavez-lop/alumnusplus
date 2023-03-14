import { MdEmail, MdPhone, MdPrint, MdWarning } from "react-icons/md";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { IUserHunter } from "@/lib/types";
import Image from "next/image";
import { NextPage } from "next";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { motion } from "framer-motion";
import { useStore } from "@nanostores/react";

const GabCVTemplate_1: NextPage = () => {
    const _currentUser = useStore($accountDetails) as IUserHunter;

    return (
        !!_currentUser && (
            <>
                <motion.main
                    variants={AnimPageTransition}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="relative min-h-screen w-full pt-24 print:pt-0 pb-36 print:pb-0 "
                >
                    {/* show warning if on mobile */}
                    <div className="absolute alert alert-warning shadow-lg lg:hidden print:invisible">
                        <div>
                            <MdWarning className="inline-block mr-2" />
                            <span>This feature is for desktop only</span>
                        </div>
                    </div>

                    {/* mobile restrict */}
                    <div className="hidden lg:block print:block bg-slate-50 p-10 text-base-100">
                        {/* header */}
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
                                <p >{_currentUser.email}</p>
                                <p >{_currentUser.phone}</p>
                            </div>
                        </div>


                        <div className="flex flex-col mt-10 ">
                            <h2 className="text-lg text-left leading-none font-bold col-span-1 mb-2 border-b-2">
                                PROFESSIONAL SUMMARY
                            </h2>
                            <ReactMarkdown className="col-span-2 text-justify text-base-100 items-center  prose prose-sm max-w-max">
                                {_currentUser.cover_letter}
                            </ReactMarkdown>
                        </div>

                        <div className="flex flex-col mt-10">
                            <h2 className="text-lg text-left leading-none font-bold col-span-1 border-b-2 ">
                                WORK EXPERIENCE
                            </h2>
                            <div className="col-span-2 flex flex-col gap-2">
                                {_currentUser.experience.map((work, index) => (
                                    <div
                                        key={`work_experience_${index}`}
                                        className="grid grid-cols-2 mt-2"
                                    >
                                        <p className="font-bold col-span-2 leading-3">{work.jobPosition}</p>
                                        <p className="opacity-75">
                                            {work.companyName}, {work.location}
                                        </p>
                                        <p className="opacity-75 text-right">
                                            {new Date(work.startDate).toLocaleDateString('en-En', { year: 'numeric', month: 'long', day: 'numeric' })} -{" "}
                                            {work.isCurrent ? "Present" : new Date(work.endDate).toLocaleDateString('en-En', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        <div className="mt-2  ">
                                            <ul>
                                                <li className="list-disc ml-10">job responsibility 1</li>
                                                <li className="list-disc ml-10">job responsibility 2</li>
                                                <li className="list-disc ml-10">job responsibility 3</li>
                                                <li className="list-disc ml-10">job responsibility 4</li>
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                                {_currentUser.experience.length === 0 && (
                                    <p className="opacity-75">No work experience yet</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col mt-10">
                            <h2 className="text-lg text-left leading-none font-bold col-span-1 border-b-2 ">
                                EDUCATION
                            </h2>
                            <div className="col-span-2 flex flex-col gap-2">
                                {_currentUser.education.map((edu, index) => (
                                    <div
                                        key={`education_${index}`}
                                        className="grid grid-cols-2 mt-2"
                                    >
                                        <p className="font-bold col-span-2 leading-3">
                                            <span className="capitalize">{edu.degreeType}</span> -{" "}
                                            {edu.degreeName}
                                        </p>
                                        <p className="opacity-75">
                                            {edu.institution}
                                        </p>
                                        <p className="opacity-75 text-right">
                                            {edu.yearGraduated}
                                        </p>
                                    </div>
                                ))}
                                {_currentUser.education.length === 0 && (
                                    <p className="opacity-75">No education history yet</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 grid-col mt-10">
                            <h2 className="text-lg text-left leading-none font-bold col-span-1 border-b-2 ">
                                SKILLS
                            </h2>
                            <div className="col-span-2 flex flex-wrap gap-2 mt-2">
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

                        <div className="flex flex-col mt-10">
                            <h2 className="text-lg text-left leading-none font-bold col-span-1 border-b-2 ">
                                PROFESSIONAL CERTIFICATES
                            </h2>
                            <div className="col-span-2 flex flex-col gap-2">
                                {_currentUser.trainings.map((training, index) => (
                                    <div
                                        key={`trainings_${index}`}
                                        className="grid grid-cols-2 mt-2"
                                    >
                                        <p className="font-bold col-span-2 leading-3">
                                            <span className="capitalize">{training.title}</span>

                                        </p>
                                        <p className="opacity-75">
                                            {training.organizer}
                                        </p>
                                        <p className="opacity-75 text-right">
                                            {new Date(training.date).toLocaleDateString('en-En', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                ))}

                            </div>
                        </div>

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

export default GabCVTemplate_1;
