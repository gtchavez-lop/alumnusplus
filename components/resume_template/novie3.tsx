import { MdEmail, MdPhone, MdLocationPin, MdBusinessCenter, MdCalendarToday, MdBook } from "react-icons/md";

import { $accountDetails } from "@/lib/globalStates";
import { IUserHunter } from "@/lib/types";
import Image from "next/image";
import { NextPage } from "next";
import dayjs from "dayjs";
import { useStore } from "@nanostores/react";
import { FC } from "react";

const novs3: FC = () => {
	const _currentUser = useStore($accountDetails) as IUserHunter;

	return (
		<>
			<div className="flex gap-5 items-start">
                {/* header */}
				<div className="flex flex-col items-start">
                    <div className="flex items-center">
                        <Image
                            src={_currentUser.avatar_url}
                            alt="profile picture"
                            width={100}
                            height={100}
                            className="rounded-full m-3"
                        />
                        <div className="p-5">
                            <h1 className="flex-row text-4xl font-bold">
                                {_currentUser.full_name.first} {_currentUser.full_name.last}
                            </h1>
                            <p className="text-2xl uppercase tracking-tight text-red-400">
                                {_currentUser.skill_primary}
                            </p>
                        </div>                    
                    </div>
                    
                    <div className="flex flex-row items-center mt-2 gap-5">
                        <div className="flex flex-row items-center">
                            <MdLocationPin className=" w-5 h-5" />
                            <p className="text-1xl font-tint ml-1">
                            {_currentUser.address.city}
                            </p>
                        </div>
                        
                        <div className="flex flex-row items-center">
                            <MdEmail className="w-5 h-5" />
                            <p className="text-1xl font-tint ml-1">
                            {_currentUser.email}
                            </p>
                        </div>
                        
                        <div className="flex flex-row items-center">
                            <MdPhone className=" w-5 h-5" />
                            <p className="text-1xl font-tint ml-1">
                            {_currentUser.phone}
                            </p>
                        </div>
                    </div>
				</div>
			</div>

            {/* introduction */}
			<div className="grid mt-3 items-center">
                <h2 className="text-1xl leading-loose uppercase text-red-400">Cover Letter</h2>
				<p className="m-3 text-justify prose max-w-max text-1xl font-tint leading-snug">
					{_currentUser.cover_letter}
				</p>
			</div>


            <div className="border-b-2 border-red-400 mt-5 mb-5" />
            
            {/* experience */}

				<div>
					<h2 className="text-1xl mb-5 leading-loose uppercase text-red-400">
						Experience
					</h2>
					{_currentUser.experience.map((work, index) => ( 
						<div
							key={`work_experience_${index}`}
							className="flex flex-col items-start p-0"
						>

                            <div>

                                <div className="flex flex-row justify-between items-center gap-12  ">
                                    
                                    <p className="text-base-content italic text-xl">
                                        {work.jobPosition} 
                                    </p>

                                    <div className="flex flex-row items-center">
                                        <MdBusinessCenter className=" ml-5 w-5 h-5" />
                                        <p className="text-1xl font-tint ml-1">
                                            {work.companyName}

                                        </p>
                                    </div>

                                    <div className="flex flex-row items-center">
                                        <MdCalendarToday className=" ml-5 w-5 h-5" />
                                        <p className="text-1xl font-tint ml-1">
                                        {dayjs(work.startDate).format("MMMM D, YYYY")} -{" "}
                                    {work.isCurrent
                                        ? "Present"
                                        : dayjs(work.endDate).format("MMMM D, YYYY")} 


                                        </p>
                                    </div>

                                </div>

                                <div>
                                    <p className="m-3 text-justify">
                                        {/* {work.jobDescription} */}

                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam augue leo, finibus quis mi ut, lobortis viverra sapien. Phasellus porttitor lorem eu augue imperdiet ullamcorper. Ut mauris lacus, mattis a interdum posuere, fermentum molestie enim. Quisque lorem nibh, imperdiet a varius sit amet, viverra sed mauris. 
                                    </p>
                                </div>

                            </div>
                            <div className="border-b-2 border-red-100 mt-5 mb-5" />
						</div>
                        
					))}
					{_currentUser.experience.length === 0 && (
						<p className="text-base-content">No work experience yet</p>
					)} 
				</div>

                <div className="border-b-2 border-red-400 mt-5 mb-5" />

            {/* educations & skills  */}

                    <div className="grid grid-cols-2">
                        <div>
                            <h2 className="text-1xl mb-3 leading-loose uppercase text-red-400">
                                Skills
                            </h2>

                            <p className="text-base-content italic text-xl ">
                            {_currentUser.skill_primary}
                            </p>                            
                            {_currentUser.skill_secondary.map((skill, index) => (
                            <p key={`secondary_skill_${index}`}
                            className="text-base-content italic text-xl">
                                {skill}
                            </p>
                            ))}
                        </div>

                        <div>
                            <h2 className="text-1xl mb-3 leading-loose uppercase text-red-400">
                                Educations
                            </h2>
                            
                                <div className="flex flex-col items-start p-0 mt-2">
                                {_currentUser.education.map((edu, index) => (

                                    <div key={`education_${index}`}
                                    className="m-2">
                                        
                                        <p className="text-base-content italic text-xl">
                                                {edu.degreeName}
                                        </p>

                                        <div className="grid grid-cols-3 items-center">
                                            <div className="flex flex-row col-span-2 items-center">
                                                    <MdBook className="w-5 h-5 mr-1"/>
                                                    <p className="text-1xl font-tint">
                                                    {edu.institution}
                                                    </p>
                                            </div>

                                            <div className="flex flex-row items-center justify-end">
                                                <MdCalendarToday className="w-5 h-5 mr-1" />
                                                <p className="text-1xl font-tint">
                                                {edu.yearGraduated}
                                                </p>
                                            </div>
                                        </div>
                                       
                                    </div>
                                   
                                    ))}
                                    {_currentUser.education.length === 0 && (
                                        <p className="opacity-75">No education history yet</p>
                                    )}
                                
                            </div>
                        </div>
                    </div>
		</>
	);
};

export default novs3;
