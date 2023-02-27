import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import Fuse from "fuse.js";
import { IUserHunter } from "@/lib/types";
import Link from "next/link";
import { NextPage } from "next";
import _PhCities from "@/lib/ph_location.json";
import _Skills from "@/lib/skills.json";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useState } from "react";
import { useStore } from "@nanostores/react";

const EditProfilePage: NextPage = () => {
	const router = useRouter()
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

	const f_PhCities = new Fuse(_PhCities, {
		keys: ["city", "admin_name"],
		threshold: 0.3,
	});
	const f_Skills = new Fuse(_Skills, {
		threshold: 0.3,
	});

	const handleChanges = async () => {
		if (
			tempUserDetails.address.address.length < 5 ||
			tempUserDetails.address.city.length < 5 ||
			!tempUserDetails.address.postalCode ||
			tempUserDetails.bio.length < 10 ||
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
		})

		const {error} = await supabase.from("user_hunters")
			.update(tempUserDetails)
			.eq("id", _currentUserDetails.id);

		if (error) {
			toast.error("Something went wrong. Please try again later.");
			return;
		}

		toast.dismiss();
		toast.success("Changes saved successfully.");
		$accountDetails.set(tempUserDetails);
		router.push("/h/me");
	}

	return (
		<>
			{
				!!tempUserDetails && (
					<motion.main
						variants={AnimPageTransition}
						initial="initial"
						animate="animate"
						exit="exit"
						className="relative min-h-screen w-full pt-24 pb-36"
					>
						<h1 className="text-4xl font-bold">Edit Your Profile</h1>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
							<div className="col-span-full flex justify-end items-center w-full gap-2">
								<button onClick={handleChanges} className="btn btn-success">Save Changes</button>
								<Link href="/h/me" className="btn btn-ghost">
									Discard and Go back
								</Link>
							</div>

							<div className="flex flex-col gap-2 bg-base-200 p-5 rounded-btn h-max">
								<p className="text-xl font-bold">Account Information</p>
								<label className="flex flex-col gap-2">
									<span>Profile Picture</span>
									<img
										src={`https://avatars.dicebear.com/api/bottts/${_currentUserDetails.username}.svg`}
										alt="Profile Picture"
										className="w-24 h-24 object-cover bg-primary mask mask-squircle p-3"
									/>
									<input
										className="file-input 	file-input-primary"
										type="file"
										accept="image/png, image/gif, image/jpeg"
										disabled
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

							<div className="flex flex-col gap-2 bg-base-200 p-5 rounded-btn h-max">
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
									{
										primarySkillSearchResults.length > 0 && (
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
										)
									}
								</label>
								<label className="flex flex-col">
									<span>Secondary Skills</span>
									<p className="flex flex-wrap my-2 gap-1">
										{tempUserDetails.skill_secondary.map((skill, index) => (
											<span
												className="badge badge-accent hover:badge-error cursor-pointer "
												onClick={() => {
													let newSkills = tempUserDetails.skill_secondary.filter(
														(s) => s !== skill
													);
													setTempUserDetails({
														...tempUserDetails,
														skill_secondary: newSkills,
													});
												}}
												key={`secondaryskill_${index}`}
											>
												{skill}
											</span>
										))}
									</p>
									<input className="input input-primary" id="skillSecondary_input" type="text" onChange={e => {
										let res = f_Skills.search(e.target.value);
										let skills = res.map(skill => skill.item);
										// filter out existing skills and primary skill
										let filtered = skills.filter(skill => !tempUserDetails.skill_secondary.includes(skill) && skill !== tempUserDetails.skill_primary);
										let limited = filtered.slice(0, 5);

										setSecondarySkillSearchResults(limited);
									}} />
									{
										secondarySkillSearchResults.length > 0 && (
											<div className="flex flex-col gap-2 bg-base-100 p-2 rounded-btn mt-3">
												{secondarySkillSearchResults.map((skill, index) => (
													<button
														className="btn btn-ghost btn-block justify-start"
														key={`secondaryskill_${index}`}
														onClick={() => {
															let skillSecondary_input = document.getElementById('skillSecondary_input') as HTMLInputElement;
															setTempUserDetails({
																...tempUserDetails,
																skill_secondary: [...tempUserDetails.skill_secondary, skill]
															});
															skillSecondary_input.value = '';
															setSecondarySkillSearchResults([]);
														}}
														>
															{skill}
														</button>
													))}
												</div>
										)
									}
									{
										tempUserDetails.skill_secondary.length < 3 && (
											<span className="self-end text-error">
												Must be at least 3 skills
											</span>
										)
									}
								</label>
							</div>

							<div className="flex flex-col gap-2 bg-base-200 p-5 rounded-btn h-max">
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
									/>
								</label>
								<label className="flex flex-col">
									<span>Birthdate</span>
									<input
										className="input input-primary"
										value={tempUserDetails.birthdate}
										type="date"
										onChange={e => {
											setTempUserDetails({
												...tempUserDetails,
												birthdate: e.target.value
											});
										}
										}
									/>
								</label>
								<label className="flex flex-col">
									<span>Birthplace</span>
									<input
										className="input input-primary"
										value={tempUserDetails.birthplace}
										type="text"
										onChange={e => {
											setTempUserDetails({
												...tempUserDetails,
												birthplace: e.target.value
											});
										}
										}
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
												gender: e.target.value as "male" | "female" | "non-binary" | "other" | "prefer not to say",
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

							<div className="flex flex-col gap-2 bg-base-200 p-5 rounded-btn h-max">
								<p className="text-xl font-bold">Residence Information</p>

								<label className="flex flex-col">
									<span>Address</span>
									<input
										className="input input-primary"
										value={tempUserDetails.address.address}
										type="text"
										onChange={e => {
											setTempUserDetails({
												...tempUserDetails,
												address: {
													...tempUserDetails.address,
													address: e.target.value
												}
											});
										}
										}
									/>
								</label>
								<label className="flex flex-col">
									<span>City</span>
									<input
										className="input input-primary"
										value={tempUserDetails.address.city}
										type="text"
										onChange={e => {
											let res = f_PhCities.search(e.target.value);
											let filtered = res.map((item) => {
												return {
													city: item.item.city,
													admin_name: item.item.admin_name,
												}
											});
											let limited = filtered.slice(0, 5);

											setCitySearchResults(limited);
											setTempUserDetails({
												...tempUserDetails,
												address: {
													...tempUserDetails.address,
													city: e.target.value
												}
											});
										}}
									/>
									{
										citySearchResults.length > 0 && (
											<div className="flex flex-col gap-2 bg-base-100 p-2 rounded-btn mt-3">
												{
													citySearchResults.map((item, index) => (
														<button
														className="btn btn-ghost btn-block justify-start"
														key={`city_${index}`}
														onClick={() => {
															setTempUserDetails({
																...tempUserDetails,
																address: {
																	...tempUserDetails.address,
																	city: item.city,
																}
															});

															setCitySearchResults([]);
														}}
														>
															{item.city}, {item.admin_name}
														</button>
													))
												}
											</div>
										)
									}
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
						</div>
					</motion.main>
				)
			}
		</>
	);
};

export default EditProfilePage;
