import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, SyntheticEvent, useEffect, useState } from "react";
import { HEducation, HWorkExperience, IUserHunter } from "@/lib/types";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import Compressor from "compressorjs";
import Fuse from "fuse.js";
import Image from "next/image";
import Link from "next/link";
import { NextPage } from "next";
import _PhCities from "@/lib/ph_location.json";
import _Skills from "@/lib/skills.json";
import dayjs from "dayjs";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";

const EditProfilePage: NextPage = () => {
	const [hasChanges, setHasChanges] = useState(false);
	const router = useRouter();
	const _currentUserDetails = useStore($accountDetails) as IUserHunter;
	const [tempUserDetails, setTempUserDetails] =
		useState<IUserHunter>(_currentUserDetails);
	const [primarySkillSearchResults, setPrimarySkillSearchResults] = useState<
		string[]
	>([]);
	const [secondarySkillSearchResults, setSecondarySkillSearchResults] =
		useState<string[]>([]);
	const [citySearchResults, setCitySearchResults] = useState<
		{ city: string; admin_name: string }[]
	>([]);
	const [tabSelected, setTabSelected] = useState<
		| "account"
		| "personal"
		| "skillset"
		| "residence"
		| "socials"
		| "employment"
		| "education"
	>("account");
	const [tabContentRef] = useAutoAnimate();
	const [employmentHistoryRef] = useAutoAnimate();

	const f_PhCities = new Fuse(_PhCities, {
		keys: ["city", "admin_name"],
		threshold: 0.3,
	});
	const f_Skills = new Fuse(_Skills, {
		threshold: 0.3,
	});

	const handleChanges = async () => {
		// check if no changes were made
		if (
			JSON.stringify(tempUserDetails) === JSON.stringify(_currentUserDetails)
		) {
			toast.error("No changes were made.");
			return;
		}

		if (
			tempUserDetails.address.address.length < 5 ||
			tempUserDetails.address.city.length < 5 ||
			!tempUserDetails.address.postalCode ||
			tempUserDetails.bio.length < 1 ||
			!tempUserDetails.birthdate ||
			tempUserDetails.birthplace.length < 5 ||
			tempUserDetails.full_name.first.length < 2 ||
			tempUserDetails.full_name.last.length < 2 ||
			!tempUserDetails.gender ||
			tempUserDetails.skill_primary.length < 3 ||
			tempUserDetails.skill_secondary.length < 3
		) {
			toast.error("Please fill out all the fields correctly.");
			return;
		}

		toast.loading("Saving changes...");

		setTempUserDetails({
			...tempUserDetails,
			updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		});

		const { error } = await supabase
			.from("user_hunters")
			.update(tempUserDetails)
			.eq("id", _currentUserDetails.id);

		if (error) {
			toast.error("Something went wrong. Please try again later.");
			return;
		}

		toast.dismiss();
		toast.success("Changes saved successfully.");
		setHasChanges(false);
		$accountDetails.set(tempUserDetails);
	};

	// detect changes
	useEffect(() => {
		setHasChanges(
			JSON.stringify(tempUserDetails) !== JSON.stringify(_currentUserDetails),
		);
	}, [tempUserDetails]);

	return (
		<>
			{!!tempUserDetails && (
				<motion.main
					variants={AnimPageTransition}
					initial="initial"
					animate="animate"
					exit="exit"
					className="relative min-h-screen w-full pt-24 pb-36"
				>
					<h1 className="text-4xl font-bold">Edit Your Profile</h1>

					{/* tabs desktop */}
					<div className="tabs hidden lg:flex justify-center tabs-boxed mt-5">
						<p
							onClick={() => setTabSelected("account")}
							className={`tab ${tabSelected === "account" && "tab-active"}`}
						>
							Account
						</p>
						<p
							onClick={() => setTabSelected("personal")}
							className={`tab ${tabSelected === "personal" && "tab-active"}`}
						>
							Personal
						</p>
						<p
							onClick={() => setTabSelected("skillset")}
							className={`tab ${tabSelected === "skillset" && "tab-active"}`}
						>
							Skillset
						</p>
						<p
							onClick={() => setTabSelected("residence")}
							className={`tab ${tabSelected === "residence" && "tab-active"}`}
						>
							Residence
						</p>
						<p
							onClick={() => setTabSelected("socials")}
							className={`tab ${tabSelected === "socials" && "tab-active"}`}
						>
							Socials
						</p>
						<p
							onClick={() => setTabSelected("employment")}
							className={`tab ${tabSelected === "employment" && "tab-active"}`}
						>
							Employment
						</p>
						<p
							onClick={() => setTabSelected("education")}
							className={`tab ${tabSelected === "education" && "tab-active"}`}
						>
							Education
						</p>
					</div>
					{/* dropdown mobile */}
					<select
						className="select select-primary mt-5 w-full lg:hidden"
						value={tabSelected}
						onChange={(e) =>
							setTabSelected(
								e.target.value as
									| "account"
									| "personal"
									| "skillset"
									| "residence"
									| "socials"
									| "employment"
									| "education",
							)
						}
					>
						<option value="account">Account</option>
						<option value="personal">Personal</option>
						<option value="skillset">Skillset</option>
						<option value="residence">Residence</option>
						<option value="employment">Employment</option>
						<option value="education">Education</option>
					</select>

					<AnimatePresence mode="wait">
						{hasChanges && (
							<motion.div
								initial={{ y: 100, opacity: 0 }}
								animate={{
									y: 0,
									opacity: 1,
									transition: { easings: "circOut" },
								}}
								exit={{
									y: 100,
									opacity: 0,
									transition: { easings: "circIn" },
								}}
								className="fixed bottom-0 left-0 p-5 bg-base-100 w-full flex justify-center z-40"
							>
								<div className="col-span-full flex justify-end items-center w-full gap-2 max-w-5xl">
									<button onClick={handleChanges} className="btn btn-success">
										Save Changes
									</button>
									<button
										onClick={() => {
											setTempUserDetails(_currentUserDetails);
											setHasChanges(false);
											toast.success("Changes discarded.");
											setHasChanges(false);
										}}
										className="btn btn-ghost"
									>
										Discard and Reset
									</button>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* tab content */}
					<div
						ref={tabContentRef}
						className="mt-5 w-full max-w-2xl mx-auto overflow-hidden"
					>
						{tabSelected === "account" && (
							<div className="flex flex-col gap-2 rounded-btn h-max w-full">
								<p className="text-xl font-bold">Account Information</p>
								<label className="flex flex-col gap-2">
									<span>Profile Picture</span>
									<Image
										src={tempUserDetails.avatar_url}
										alt="Profile Picture"
										className="w-24 h-24 object-cover bg-primary mask mask-squircle"
										width={96}
										height={96}
									/>
									<input
										className="file-input file-input-primary"
										type="file"
										accept="image/png, image/gif, image/jpeg"
										onChange={({ currentTarget }) => {
											// check if file exceeds 1mb
											const file = currentTarget.files?.[0] as Blob;
											if (file.size > 1000000) {
												toast.error("File size exceeds 1 megabyte.");
												return;
											}
											// set the file to base64
											new Compressor(file, {
												quality: 0.4,
												success(result) {
													const reader = new FileReader();
													reader.readAsDataURL(result);
													reader.onload = () => {
														setTempUserDetails({
															...tempUserDetails,
															avatar_url: reader.result?.toString() || "",
														});
													};
												},
											});
										}}
									/>
								</label>
								<label className="flex flex-col">
									<span>Email</span>
									<input
										className="input input-primary"
										value={tempUserDetails.email}
										type="email"
										readOnly
										disabled
									/>
								</label>
								<label className="flex flex-col">
									<span>Username</span>
									<input
										className="input input-primary"
										value={tempUserDetails.username}
										type="text"
										disabled
										// onChange={(e) => {
										// 	setTempUserDetails({
										// 		...tempUserDetails,
										// 		username: e.target.value,
										// 	});
										// }}
									/>
								</label>
							</div>
						)}
						{tabSelected === "personal" && (
							<div className="flex flex-col gap-2 rounded-btn h-max w-full">
								<p className="text-xl font-bold">Personal Information</p>
								<label className="flex flex-col">
									<span>Bio</span>
									<textarea
										className="textarea textarea-primary"
										value={tempUserDetails.bio}
										rows={5}
										onChange={(e) => {
											setTempUserDetails({
												...tempUserDetails,
												bio: e.target.value,
											});
										}}
									/>
								</label>
								<label className="flex flex-col">
									<span>First Name</span>
									<input
										className="input input-primary"
										value={tempUserDetails.full_name.first}
										type="text"
										onChange={(e) => {
											setTempUserDetails({
												...tempUserDetails,
												full_name: {
													...tempUserDetails.full_name,
													first: e.target.value,
												},
											});
										}}
									/>
								</label>
								<label className="flex flex-col">
									<span>Middle Name (Optional)</span>
									<input
										className="input input-primary"
										value={tempUserDetails.full_name.middle}
										type="text"
										onChange={(e) => {
											setTempUserDetails({
												...tempUserDetails,
												full_name: {
													...tempUserDetails.full_name,
													middle: e.target.value,
												},
											});
										}}
									/>
								</label>
								<label className="flex flex-col">
									<span>Last Name</span>
									<input
										className="input input-primary"
										value={tempUserDetails.full_name.last}
										type="text"
										onChange={(e) => {
											setTempUserDetails({
												...tempUserDetails,
												full_name: {
													...tempUserDetails.full_name,
													last: e.target.value,
												},
											});
										}}
									/>
								</label>
								<label className="flex flex-col">
									<span>Birthdate</span>
									<input
										className="input input-primary"
										value={tempUserDetails.birthdate}
										type="date"
										max={
											dayjs().diff(dayjs().subtract(18, "year"), "year") === 0
												? dayjs().format("YYYY-MM-DD")
												: dayjs().subtract(18, "year").format("YYYY-MM-DD")
										}
										onChange={(e) => {
											setTempUserDetails({
												...tempUserDetails,
												birthdate: e.target.value,
											});
										}}
									/>
								</label>
								<label className="flex flex-col">
									<span>Birthplace</span>
									<input
										className="input input-primary"
										value={tempUserDetails.birthplace}
										type="text"
										onChange={(e) => {
											setTempUserDetails({
												...tempUserDetails,
												birthplace: e.target.value,
											});
										}}
									/>
								</label>
								<label className="flex flex-col">
									<span>Gender</span>
									<select
										className="select select-primary"
										value={tempUserDetails.gender}
										onChange={(e) => {
											setTempUserDetails({
												...tempUserDetails,
												gender: e.target.value as
													| "male"
													| "female"
													| "non-binary"
													| "other"
													| "prefer not to say",
											});
										}}
									>
										<option value="" disabled>
											Select Gender
										</option>
										<option value="male">Male</option>
										<option value="female">Female</option>
										<option value="non-binary">Non-Binary</option>
										<option value="other">Other</option>
										<option value="prefer not to say">Prefer not to say</option>
									</select>
								</label>
							</div>
						)}
						{tabSelected === "skillset" && (
							<div className="flex flex-col gap-2 rounded-btn h-max w-full">
								<p className="text-xl font-bold">Skillset Information</p>

								<label className="flex flex-col">
									<span>Primary Skill</span>
									<input
										className="input input-primary"
										value={tempUserDetails.skill_primary}
										type="text"
										onChange={(e) => {
											setTempUserDetails({
												...tempUserDetails,
												skill_primary: e.target.value,
											});

											let res = f_Skills.search(e.target.value);
											let skills = res.map((skill) => skill.item);
											let limited = skills.slice(0, 5);

											setPrimarySkillSearchResults(limited);
										}}
									/>
									{primarySkillSearchResults.length > 0 && (
										<div className="flex flex-col gap-2 bg-base-100 p-2 rounded-btn mt-3">
											{primarySkillSearchResults.map((skill, index) => (
												<button
													className="btn btn-ghost btn-block justify-start"
													key={`primaryskill_${index}`}
													onClick={() => {
														setTempUserDetails({
															...tempUserDetails,
															skill_primary: skill,
														});
														setPrimarySkillSearchResults([]);
													}}
												>
													{skill}
												</button>
											))}
										</div>
									)}
								</label>
								<label className="flex flex-col">
									<span>Secondary Skills</span>
									<ul className="flex flex-wrap my-2 gap-2 p-3 border-[1px] rounded-btn border-primary">
										{tempUserDetails.skill_secondary.map((skill, index) => (
											<li
												className="badge items-center cursor-pointer "
												onClick={() => {
													let newSkills =
														tempUserDetails.skill_secondary.filter(
															(s) => s !== skill,
														);
													setTempUserDetails({
														...tempUserDetails,
														skill_secondary: newSkills,
													});
												}}
												key={`secondaryskill_${index}`}
											>
												{skill}
											</li>
										))}
										<li className="w-full">
											<input
												className="input input-ghost w-full"
												id="skillSecondary_input"
												type="text"
												placeholder="Add a skill"
												onChange={(e) => {
													let res = f_Skills.search(e.target.value);
													let skills = res.map((skill) => skill.item);
													// filter out existing skills and primary skill
													let filtered = skills.filter(
														(skill) =>
															!tempUserDetails.skill_secondary.includes(
																skill,
															) && skill !== tempUserDetails.skill_primary,
													);
													let limited = filtered.slice(0, 5);

													setSecondarySkillSearchResults(limited);
												}}
											/>
										</li>
									</ul>
									{secondarySkillSearchResults.length > 0 && (
										<div className="flex flex-col gap-2 bg-base-100 p-2 rounded-btn mt-3">
											{secondarySkillSearchResults.map((skill, index) => (
												<button
													className="btn btn-ghost btn-block justify-start"
													key={`secondaryskill_${index}`}
													onClick={() => {
														let skillSecondary_input = document.getElementById(
															"skillSecondary_input",
														) as HTMLInputElement;
														setTempUserDetails({
															...tempUserDetails,
															skill_secondary: [
																...tempUserDetails.skill_secondary,
																skill,
															],
														});
														skillSecondary_input.value = "";
														setSecondarySkillSearchResults([]);
													}}
												>
													{skill}
												</button>
											))}
										</div>
									)}
									{tempUserDetails.skill_secondary.length < 3 && (
										<span className="self-end text-error">
											Must be at least 3 skills
										</span>
									)}
								</label>
							</div>
						)}
						{tabSelected === "residence" && (
							<div className="flex flex-col gap-2 rounded-btn h-max w-full">
								<p className="text-xl font-bold">Residence Information</p>

								<label className="flex flex-col">
									<span>Address</span>
									<input
										className="input input-primary"
										value={tempUserDetails.address.address}
										type="text"
										onChange={(e) => {
											setTempUserDetails({
												...tempUserDetails,
												address: {
													...tempUserDetails.address,
													address: e.target.value,
												},
											});
										}}
									/>
								</label>
								<label className="flex flex-col">
									<span>City</span>
									<input
										className="input input-primary"
										value={tempUserDetails.address.city}
										type="text"
										onChange={(e) => {
											let res = f_PhCities.search(e.target.value);
											let filtered = res.map((item) => {
												return {
													city: item.item.city,
													admin_name: item.item.admin_name,
												};
											});
											let limited = filtered.slice(0, 5);

											setCitySearchResults(limited);
											setTempUserDetails({
												...tempUserDetails,
												address: {
													...tempUserDetails.address,
													city: e.target.value,
												},
											});
										}}
									/>
									{citySearchResults.length > 0 && (
										<div className="flex flex-col gap-2 bg-base-100 p-2 rounded-btn mt-3">
											{citySearchResults.map((item, index) => (
												<button
													className="btn btn-ghost btn-block justify-start"
													key={`city_${index}`}
													onClick={() => {
														setTempUserDetails({
															...tempUserDetails,
															address: {
																...tempUserDetails.address,
																city: item.city,
															},
														});

														setCitySearchResults([]);
													}}
												>
													{item.city}, {item.admin_name}
												</button>
											))}
										</div>
									)}
								</label>
								<label className="flex flex-col">
									<span>Postal Code</span>
									<input
										className="input input-primary"
										value={tempUserDetails.address.postalCode}
										type="number"
									/>
								</label>
							</div>
						)}
						{tabSelected === "socials" && (
							<div className="flex flex-col gap-2 rounded-btn h-max w-full">
								<p className="text-xl font-bold">Other Social Links</p>

								<label className="flex flex-col">
									<span>Facebook</span>
									<input
										className="input input-primary"
										value={tempUserDetails.social_media_links.facebook}
										type="url"
										onChange={(e) => {
											setTempUserDetails({
												...tempUserDetails,
												social_media_links: {
													...tempUserDetails.social_media_links,
													facebook: e.target.value,
												},
											});
										}}
									/>
								</label>
								<label className="flex flex-col">
									<span>Instagram</span>
									<input
										className="input input-primary"
										value={tempUserDetails.social_media_links.instagram}
										type="url"
										onChange={(e) => {
											setTempUserDetails({
												...tempUserDetails,
												social_media_links: {
													...tempUserDetails.social_media_links,
													instagram: e.target.value,
												},
											});
										}}
									/>
								</label>
								<label className="flex flex-col">
									<span>Twitter</span>
									<input
										className="input input-primary"
										value={tempUserDetails.social_media_links.twitter}
										type="url"
										onChange={(e) => {
											setTempUserDetails({
												...tempUserDetails,
												social_media_links: {
													...tempUserDetails.social_media_links,
													twitter: e.target.value,
												},
											});
										}}
									/>
								</label>
								<label className="flex flex-col">
									<span>LinkedIn</span>
									<input
										className="input input-primary"
										value={tempUserDetails.social_media_links.linkedin}
										type="url"
										onChange={(e) => {
											setTempUserDetails({
												...tempUserDetails,
												social_media_links: {
													...tempUserDetails.social_media_links,
													linkedin: e.target.value,
												},
											});
										}}
									/>
								</label>
							</div>
						)}
						{tabSelected === "employment" && (
							<div className="flex flex-col gap-2 rounded-btn h-max w-full">
								<p className="text-xl font-bold">Employment Information</p>

								<div
									className="mt-4 flex flex-col gap-2"
									ref={employmentHistoryRef}
								>
									{tempUserDetails.experience.map((exp, i) => (
										<div
											key={`expereince_${i}`}
											className="bg-base-200 rounded-btn p-5"
										>
											<p className="text-lg">
												{exp.jobPosition} - {exp.companyName}
											</p>
											<p>{exp.location}</p>
											<p className="mt-2 text-sm opacity-75">
												{exp.startDate} -{" "}
												{exp.isCurrent ? "Present" : exp.endDate}
											</p>

											<div className="flex justify-end mt-2 gap-2">
												<button
													className="btn btn-error btn-sm"
													onClick={() => {
														const newExperience =
															tempUserDetails.experience.filter(
																(_, index) => index !== i,
															);
														setTempUserDetails({
															...tempUserDetails,
															experience: newExperience,
														});
													}}
												>
													Delete
												</button>
											</div>
										</div>
									))}
									{tempUserDetails.experience.length === 0 && (
										<p className="text-center text-sm opacity-75">
											No Employment History
										</p>
									)}
								</div>

								{/* add experience form */}
								<p className="mt-5 text-lg font-bold">
									Add new Employment History
								</p>
								<form
									onSubmit={(e) => {
										e.preventDefault();
										const form = e.target as HTMLFormElement;

										const formData = new FormData(form);
										const data = Object.fromEntries(formData.entries());

										const newExperience: HWorkExperience = {
											companyName: data.companyName as string,
											jobPosition: data.jobPosition as string,
											location: data.location as string,
											startDate: data.startDate as string,
											endDate: data.endDate as string,
											isCurrent: data.isCurrent === "on",
										};

										setTempUserDetails({
											...tempUserDetails,
											experience: [
												...tempUserDetails.experience,
												newExperience,
											],
										});

										// reset form
										form.reset();
									}}
									className="flex flex-col"
								>
									<label className="flex flex-col">
										<span>Job Position</span>
										<input
											className="input input-primary"
											name="jobPosition"
											type="text"
										/>
									</label>
									<label className="flex flex-col">
										<span>Company Name</span>
										<input
											className="input input-primary"
											name="companyName"
											type="text"
										/>
									</label>
									<label className="flex flex-col">
										<span>Location</span>
										<input
											className="input input-primary"
											name="location"
											type="text"
										/>
									</label>
									<label className="flex flex-col">
										<span>Start Date</span>
										<input
											className="input input-primary"
											name="startDate"
											type="date"
										/>
									</label>
									<label className="flex flex-col">
										<span>End Date</span>
										<input
											className="input input-primary"
											name="endDate"
											type="date"
										/>
									</label>
									<label className="flex items-center mt-2 gap-2">
										<input
											className="toggle toggle-primary"
											name="isCurrent"
											type="checkbox"
										/>
										<span>Is this your current job?</span>
									</label>
									<button
										type="submit"
										className="btn btn-primary btn-block mt-10"
									>
										Add Experience
									</button>
								</form>
							</div>
						)}
						{tabSelected === "education" && (
							<div className="flex flex-col gap-2 rounded-btn h-max w-full">
								<p className="text-xl font-bold">Education Information</p>

								<div
									className="mt-4 flex flex-col gap-2"
									ref={employmentHistoryRef}
								>
									{tempUserDetails.education.map((edu, i) => (
										<div
											key={`education_${i}`}
											className="bg-base-200 rounded-btn p-5"
										>
											<p className="text-lg">
												<span className="capitalize">{edu.degreeType}</span> -{" "}
												{edu.institution}
											</p>
											<p>{edu.location}</p>
											{edu.degreeName && (
												<p className="mt-2 text-sm opacity-75">
													{edu.degreeName}
												</p>
											)}
											<p className="mt-2 text-sm opacity-75">
												{edu.yearGraduated}
											</p>

											<div className="flex justify-end mt-2 gap-2">
												<button
													className="btn btn-error btn-sm"
													onClick={() => {
														const newEducation =
															tempUserDetails.education.filter(
																(_, index) => index !== i,
															);
														setTempUserDetails({
															...tempUserDetails,
															education: newEducation,
														});
													}}
												>
													Delete
												</button>
											</div>
										</div>
									))}
									{tempUserDetails.education.length === 0 && (
										<p className="text-center text-sm opacity-75">
											No Education History
										</p>
									)}
								</div>

								{/* add education form */}
								<p className="mt-5 text-lg font-bold">
									Add new Education History
								</p>
								<form
									onSubmit={(e) => {
										e.preventDefault();
										const form = e.target as HTMLFormElement;

										const formData = new FormData(form);
										const data = Object.fromEntries(formData.entries());

										const newEducation: HEducation = {
											institution: data.institution as string,
											degreeType: data.degreeType as
												| "primary"
												| "secondary"
												| "bachelor"
												| "master"
												| "doctorate"
												| "bachelor undergraduate"
												| "master undergraduate"
												| "doctorate undergraduate"
												| "other",
											degreeName: data.degreeName as string,
											location: data.location as string,
											yearGraduated: data.yearGraduated as string,
										};

										setTempUserDetails({
											...tempUserDetails,
											education: [...tempUserDetails.education, newEducation],
										});

										// reset form
										form.reset();
									}}
									className="flex flex-col"
								>
									<label className="flex flex-col">
										<span>Degree Type</span>
										<select className="select select-primary" name="degreeType">
											<option value="primary">Primary</option>
											<option value="secondary">Secondary</option>
											<option value="bachelor">Bachelor</option>
											<option value="master">Master</option>
											<option value="doctorate">Doctorate</option>
											<option value="bachelor undergraduate">
												Bachelor Undergraduate
											</option>
											<option value="master undergraduate">
												Master Undergraduate
											</option>
											<option value="doctorate undergraduate">
												Doctorate Undergraduate
											</option>
											<option value="other">Other</option>
										</select>
									</label>
									<label className="flex flex-col">
										<span>Degree Name</span>
										<input
											className="input input-primary"
											name="degreeName"
											type="text"
										/>
									</label>
									<label className="flex flex-col">
										<span>Institution</span>
										<input
											className="input input-primary"
											name="institution"
											type="text"
										/>
									</label>
									<label className="flex flex-col">
										<span>Location</span>
										<input
											className="input input-primary"
											name="location"
											type="text"
										/>
									</label>
									<label className="flex flex-col">
										<span>Year Graduated</span>
										<input
											className="input input-primary"
											name="yearGraduated"
											type="text"
										/>
										<span className="self-end text-sm opacity-75">
											If you are graduating this year, just type the year today
										</span>
									</label>
									<button
										type="submit"
										className="btn btn-primary btn-block mt-10"
									>
										Add Education
									</button>
								</form>
							</div>
						)}
					</div>
				</motion.main>
			)}
		</>
	);
};

export default EditProfilePage;
