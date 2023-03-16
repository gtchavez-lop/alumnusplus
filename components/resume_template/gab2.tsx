import { MdAddLocation, MdEmail, MdPhone, MdPin } from "react-icons/md";

import { $accountDetails } from "@/lib/globalStates";
import { IUserHunter } from "@/lib/types";
import { NextPage } from "next";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import dayjs from "dayjs";
import { useStore } from "@nanostores/react";
import { FC } from "react";
import Image from "next/image";






const Gab2: FC = () => {
    const _currentUser = useStore($accountDetails) as IUserHunter;

    return (
        <>
            <div className="grid grid-cols-5 gap-5 mt-4 ">
                <div className="flex flex-col col-span-5 items-center ">
                    <Image
                        src="/cvtemplate/gab2_header2.svg"
                        alt=""
                        width={1100}
                        height={300}
                        className="border-b-4 border-[#b5805a]"
                    />
                    <div className="absolute pt-10">
                        <h1 className=" text-orange-200 text-5xl uppercase ">
                            {_currentUser.full_name.first} {_currentUser.full_name.last}
                        </h1>
                    </div>
                    <div className="absolute pt-24">
                        <p className="leading-9 text-lg uppercase text-orange-200">
                            {_currentUser.skill_primary}
                        </p>
                    </div>
                </div>

                {/* left side */}
                <div className="col-span-2 row-start-3 border-r-2 border-[#b5805a]">
                    <div className="flex items-center gap-2 mb-2">
                        <MdAddLocation className="fill-[#b5805a] rounded-full border-2 border-[#b5805a] w-5 h-5 items-center" />
                        <p className="text-justify leading-tight text-xs">
                            {_currentUser.address.city}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <MdEmail className="fill-[#b5805a] rounded-full border-2 border-[#b5805a] w-5 h-5 items-center" />
                        <p className="text-justify leading-tight text-xs">
                            {_currentUser.email}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <MdPhone className="fill-[#b5805a] rounded-full border-2 border-[#b5805a] w-5 h-5 items-center" />
                        <p className="text-justify leading-tight text-xs">
                            {_currentUser.phone}
                        </p>
                    </div>
                    <div className="border-b-2 border-[#b5805a] mt-5 mb-5" />

                    {/* education */}
                    <div className="text-left col-span-3 row-start-3">
                        <h2 className="text-l leading-loose text-[#b5805a] font-semibold mb-5">
                            EDUCATION
                        </h2>
                        <p className="text-justify text-xs leading-5">
                            {_currentUser.education.map((edu, index) => (
                                <div key={`education_${index}`}>
                                    <p className="uppercase">
                                        {edu.degreeType}
                                    </p>
                                    <p>
                                        {edu.degreeName}
                                    </p>
                                    <p className="text-base-content opacity-75 mb-5">
                                        {edu.institution} | {edu.yearGraduated}
                                    </p>
                                </div>
                            ))}
                            {_currentUser.education.length === 0 && (
                                <p>No education history yet</p>
                            )}
                        </p>
                        <div className="border-b-2 border-[#b5805a] mt-5 mb-5" />

                        <h2 className="text-l leading-loose text-[#b5805a] font-semibold mb-5">
                            EXPERTISE
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            <ul className="text-xs">
                                <li className="mb-3">
                                    {_currentUser.skill_primary}
                                </li>

                                {_currentUser.skill_secondary.map((skill, index) => (
                                    <li className="mb-3" key={`secondary_skill_${index}`}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="" />

                {/* right side */}
                <div className="text-left col-span-3 row-start-3">
                    <h2 className="text-l leading-loose text-[#b5805a] font-semibold mb-5">
                        CAREER OBJECTIVE
                    </h2>
                    <p className="text-justify leading-tight text-xs">
                        {_currentUser.cover_letter}
                    </p>

                    <div className="border-b-2 border-[#b5805a] mt-5 mb-5" />

                    <h2 className="text-l leading-loose text-[#b5805a] font-semibold mb-5">
                        EXPERIENCE
                    </h2>
                    <p className="text-justify text-xs">
                        {_currentUser.experience.map((work, index) => (
                            <div key={`work_experience_${index}`}>
                                <p className="uppercase">
                                    {work.jobPosition} | {work.companyName}
                                </p>
                                <p className="text-base-content opacity-75 mb-1">{work.location} | {dayjs(work.startDate).format("MMMM D, YYYY")} -{" "}
                                    {work.isCurrent
                                        ? "Present"
                                        : dayjs(work.endDate).format("MMMM D, YYYY")}
                                </p>
                                <p className="mb-5">{work.description}</p>
                            </div>
                        ))}
                        {_currentUser.experience.length === 0 && (
                            <p>No work experience yet</p>
                        )}
                    </p>
                    <div className="border-b-2 border-[#b5805a] mt-5 mb-5" />

                    <h2 className="text-l leading-loose text-[#b5805a] font-semibold mb-5">
                        PROFESSIONAL CERTIFICATES
                    </h2>
                    <div className="flex flex-col gap-2 text-justify text-xs">
                        {_currentUser.trainings.map((item, index) => (
                            <div key={`training_${index}`}>
                                <p className="uppercase">
                                    {item.title}
                                </p>
                                <p>{item.organizer}</p>
                                <p className="text-base-content opacity-75 mb-5"> {item.location} | {dayjs(item.date).format("MMMM D, YYYY")}</p>
                            </div>
                        ))}

                    </div>

                </div>
            </div>
        </>
    );
};

export default Gab2;
