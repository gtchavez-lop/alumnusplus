import { AnimatePresence, motion } from "framer-motion";
import {
	MdArrowBack,
	MdArrowForward,
	MdClose,
	MdPersonAdd,
	MdVisibility,
	MdVisibilityOff,
} from "react-icons/md";

import { AnimPageTransition } from "@/lib/animations";
import { FiLoader } from "react-icons/fi";
import Fuse from "fuse.js";
import { IUserHunter } from "@/lib/types";
import _Citizenhip from "@/lib/citizenship.json";
import _PHCities from "@/lib/ph_location.json";
import _Skillset from "@/lib/skills.json";
import dayjs from "dayjs";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useState } from "react";

const RegisterHunterSubPage = () => {
	const router = useRouter();
	const [formPage, setFormPage] = useState(1);
	const [localPassword, setLocalPassword] = useState({
		password: "",
		confirmPassword: "",
	});
	const [passwordMatched, setPasswordMatched] = useState<boolean>(true);
	const [isPasswordRevealed, setIsPasswordRevealed] = useState<boolean>(false);
	const [localRegData, setLocalRegData] = useState<IUserHunter>({
		address: {
			address: "",
			city: "",
			postalCode: "",
		},
		avatar_url: "",
		bio: "",
		citizenship: "Filipino",
		civil_status: "single",
		cover_letter: "",
		email: "",
		experience: [],
		birthdate: "",
		birthplace: "",
		connections: [],
		created_at: "",
		education: [],
		full_name: {
			first: "",
			last: "",
			middle: "",
		},
		followedCompanies: [],
		gender: "male",
		id: "",
		id_number: "",
		id_type: "other",
		is_verified: false,
		phone: "",
		saved_jobs: [],
		skill_primary: "",
		skill_secondary: [],
		social_media_links: {
			facebook: "",
			instagram: "",
			linkedin: "",
			github: "",
			twitter: "",
			youtube: "",
		},
		subscription_type: "junior",
		type: "hunter",
		trainings: [],
		updated_at: "",
		username: "",
	});
	const [citiesSearchResults, setCitiesSearchResults] = useState<
		{ city: string; admin_name: string }[]
	>([]);
	const [citizenshipResults, setCitizenshipResults] = useState<string[]>([]);
	const [skillsetPrimarySearchResults, setSkillsetPrimarySearchResults] =
		useState<string[]>([]);
	const [skillsetSecondaryInput, setSkillsetSecondaryInput] =
		useState<string>("");
	const [skillsetSecondarySearchResults, setSkillsetSecondarySearchResults] =
		useState<string[]>([]);

	const PhCities = new Fuse(_PHCities, {
		keys: ["city", "admin_name"],
		threshold: 0.3,
	});

	const Skillset = new Fuse(_Skillset, {
		threshold: 0.3,
	});

	const Citizenship = new Fuse(_Citizenhip, {
		keys: ["nationality"],
		threshold: 0.3,
	});

	const handleSignUp = async () => {
		const { error } = await supabase.auth.signUp({
			email: localRegData.email,
			password: localPassword.password,
			options: {
				data: {
					...localRegData,
					avatar_url: `https://api.dicebear.com/5.x/bottts-neutral/png?seed=${localRegData.username}`,
					created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
					updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
				},
			},
		});

		if (error) {
			console.log(error);
			toast.error(error.message);
			return;
		}

		toast("Please check your email for verification link.");
		router.push("/login");
	};

	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-16 lg:pt-24 pb-36"
			>
				<div className="flex flex-col items-center py-5">
					<h1 className="text-3xl font-bold text-secondary text-center w-full">
						Register as a Hunter (Job Seeker)
					</h1>
					<p className="text-center w-fulll">
						Fill out the forms below to create your account.
					</p>
				</div>

				<div className="w-full bg-base-200 p-5 rounded-btn max-w-xl mx-auto mt-10">
					<AnimatePresence mode="wait">
						{formPage === 1 && (
							<motion.div
								key={`page-${formPage}`}
								initial={{ opacity: 0, x: 20 }}
								animate={{
									opacity: 1,
									x: 0,
									transition: { easings: "circOut" },
								}}
								exit={{ opacity: 0, x: -20, transition: { easings: "circIn" } }}
							>
								<h2 className="text-2xl font-bold">Account Information</h2>

								<div className="mt-5 flex flex-col gap-3">
									<label className="flex flex-col">
										<span>Username</span>
										<input
											type="text"
											id="username"
											value={localRegData.username}
											className="input input-primary"
											onChange={(e) =>
												setLocalRegData({
													...localRegData,
													username: e.target.value,
												})
											}
										/>
									</label>

									<label className="flex flex-col">
										<span>Email</span>
										<input
											type="email"
											id="email"
											value={localRegData.email}
											className="input input-primary"
											onChange={(e) =>
												setLocalRegData({
													...localRegData,
													email: e.target.value,
												})
											}
										/>
									</label>

									<label className="flex flex-col">
										<span>Password</span>
										<div className="flex items-center gap-1">
											{!isPasswordRevealed ? (
												<input
													type="password"
													id="password"
													value={localPassword.password}
													className={`input input-primary flex-1 ${
														!passwordMatched && "input-error"
													}`}
													onChange={(e) => {
														setLocalPassword({
															...localPassword,
															password: e.currentTarget.value,
														});

														setPasswordMatched(
															localPassword.confirmPassword ===
																e.currentTarget.value,
														);
													}}
												/>
											) : (
												<input
													type="text"
													id="password"
													value={localPassword.password}
													className={`input input-primary flex-1 ${
														!passwordMatched && "input-error"
													}`}
													onChange={(e) => {
														setLocalPassword({
															...localPassword,
															password: e.currentTarget.value,
														});

														setPasswordMatched(
															localPassword.confirmPassword ===
																e.currentTarget.value,
														);
													}}
												/>
											)}
											<div
												onClick={() =>
													setIsPasswordRevealed(!isPasswordRevealed)
												}
												className="btn btn-ghost text-lg"
											>
												{isPasswordRevealed ? (
													<MdVisibilityOff />
												) : (
													<MdVisibility />
												)}
											</div>
										</div>
									</label>

									<label className="flex flex-col">
										<span>Confirm Password</span>
										<div className="flex items-center gap-1">
											{!isPasswordRevealed ? (
												<input
													type="password"
													id="confirmPassword"
													value={localPassword.confirmPassword}
													className={`input input-primary flex-1 ${
														!passwordMatched && "input-error"
													}`}
													onChange={(e) => {
														setLocalPassword({
															...localPassword,
															confirmPassword: e.currentTarget.value,
														});

														setPasswordMatched(
															localPassword.password === e.currentTarget.value,
														);
													}}
												/>
											) : (
												<input
													type="text"
													id="confirmPassword"
													value={localPassword.confirmPassword}
													className={`input input-primary flex-1 ${
														!passwordMatched && "input-error"
													}`}
													onChange={(e) => {
														setLocalPassword({
															...localPassword,
															confirmPassword: e.currentTarget.value,
														});

														setPasswordMatched(
															localPassword.password === e.currentTarget.value,
														);
													}}
												/>
											)}
										</div>
									</label>

									<div className="flex justify-end mt-10">
										<button
											className="btn btn-primary btn-block"
											disabled={
												!(
													passwordMatched &&
													localRegData.email &&
													localRegData.username &&
													localPassword.password &&
													localPassword.confirmPassword
												)
											}
											onClick={() => setFormPage(2)}
										>
											Next
										</button>
									</div>
								</div>
							</motion.div>
						)}

						{formPage === 2 && (
							<motion.div
								key={`page-${formPage}`}
								initial={{ opacity: 0, x: 20 }}
								animate={{
									opacity: 1,
									x: 0,
									transition: { easings: "circOut" },
								}}
								exit={{ opacity: 0, x: -20, transition: { easings: "circIn" } }}
							>
								<h2 className="text-2xl font-bold">Personal Information</h2>

								<div className="mt-5 flex flex-col gap-3">
									<label className="flex flex-col">
										<span>First Name</span>
										<input
											type="text"
											id="first_name"
											value={localRegData.full_name.first}
											className="input input-primary"
											onChange={(e) =>
												setLocalRegData({
													...localRegData,
													full_name: {
														...localRegData.full_name,
														first: e.target.value,
													},
												})
											}
										/>
									</label>

									<label className="flex flex-col">
										<span>Middle Name (optional)</span>
										<input
											type="text"
											id="middle_name"
											value={localRegData.full_name.middle}
											className="input input-primary"
											onChange={(e) =>
												setLocalRegData({
													...localRegData,
													full_name: {
														...localRegData.full_name,
														middle: e.target.value,
													},
												})
											}
										/>
									</label>

									<label className="flex flex-col">
										<span>Last Name</span>
										<input
											type="text"
											id="last_name"
											value={localRegData.full_name.last}
											className="input input-primary"
											onChange={(e) =>
												setLocalRegData({
													...localRegData,
													full_name: {
														...localRegData.full_name,
														last: e.target.value,
													},
												})
											}
										/>
									</label>

									<label className="flex flex-col">
										<span>Birthdate</span>
										<input
											type="date"
											id="birthdate"
											value={localRegData.birthdate}
											max={
												dayjs().diff(dayjs().subtract(18, "year"), "year") === 0
													? dayjs().format("YYYY-MM-DD")
													: dayjs().subtract(18, "year").format("YYYY-MM-DD")
											}
											className="input input-primary"
											onChange={(e) =>
												setLocalRegData({
													...localRegData,
													birthdate: e.target.value,
												})
											}
										/>
									</label>

									<label className="flex flex-col">
										<span>Birthplace</span>
										<input
											type="text"
											id="birthplace"
											value={localRegData.birthplace}
											className="input input-primary"
											onChange={(e) =>
												setLocalRegData({
													...localRegData,
													birthplace: e.target.value,
												})
											}
										/>
									</label>

									<label className="flex flex-col">
										<span>Civil Status</span>
										<select
											id="civil_status"
											value={localRegData.civil_status}
											className='select select-primary'
											onChange={(e) =>
												setLocalRegData({
													...localRegData,
													civil_status: e.target.value as
														| "single"
														| "married"
														| "widowed"
														| "separated"
														| "divorced",
												})
											}
										>
											<option value="single">Single</option>
											<option value="married">Married</option>
											<option value="widowed">Widowed</option>
											<option value="separated">Separated</option>
											<option value="divorced">Divorced</option>
										</select>
									</label>

									<label className="flex flex-col">
										<span>Citizenship</span>
										<input
											type="text"
											id="citizenship"
											value={localRegData.citizenship}
											className="input input-primary"
											onChange={(e) => {
												setLocalRegData({
													...localRegData,
													citizenship: e.target.value,
												});
												const inputquery = e.target.value;
												const res = Citizenship.search(inputquery);
												const mapped = res.map((r) => r.item.nationality);
												setCitizenshipResults(mapped);
											}}
										/>
										{citizenshipResults.length > 0 && (
											<div className="rounded-btn bg-base-200 w-full mt-1">
												{citizenshipResults.map((result, index) => (
													<div
														key={`citizenship-result-${index}`}
														className="p-2 cursor-pointer"
														onClick={() => {
															setLocalRegData({
																...localRegData,
																citizenship: result,
															});
															setCitizenshipResults([]);
														}}
													>
														{result}
													</div>
												))}
											</div>
										)}
									</label>

									<label className="flex flex-col">
										<span>Gender</span>
										<select
											id="gender"
											value={localRegData.gender}
											className='select select-primary'
											onChange={(e) =>
												setLocalRegData({
													...localRegData,
													gender: e.target.value as
														| "male"
														| "female"
														| "non-binary"
														| "other"
														| "prefer not to say",
												})
											}
										>
											<option value="male">Male</option>
											<option value="female">Female</option>
											<option value="non-binary">Non-Binary</option>
											<option value="other">Other</option>
											<option value="prefer not to say">
												Prefer not to say
											</option>
										</select>
									</label>

									<label className="flex flex-col">
										<span>Bio</span>
										<textarea
											id="bio"
											value={localRegData.bio}
											rows={5}
											className="textarea textarea-primary"
											onChange={(e) =>
												setLocalRegData({
													...localRegData,
													bio: e.target.value,
												})
											}
										/>
										<span className="self-end opacity-50">Markdown</span>
									</label>

									<div className="flex justify-between mt-10">
										<button
											className="btn btn-ghost gap-2"
											onClick={() => setFormPage(1)}
										>
											<MdArrowBack />
											<span>Go Back to Page 1</span>
										</button>
										<button
											className="btn btn-primary gap-2"
											disabled={
												!(
													localRegData.full_name.first &&
													localRegData.full_name.last &&
													localRegData.birthdate &&
													localRegData.birthplace &&
													localRegData.gender &&
													localRegData.bio &&
													localRegData.email &&
													localPassword.password
												)
											}
											onClick={() => setFormPage(3)}
										>
											<span>Go to Page 3</span>
											<MdArrowForward />
										</button>
									</div>
								</div>
							</motion.div>
						)}

						{formPage === 3 && (
							<motion.div
								key={`page-${formPage}`}
								initial={{ opacity: 0, x: 20 }}
								animate={{
									opacity: 1,
									x: 0,
									transition: { easings: "circOut" },
								}}
								exit={{ opacity: 0, x: -20, transition: { easings: "circIn" } }}
							>
								<h2 className="text-2xl font-bold">Contact Information</h2>

								<div className="mt-5 flex flex-col gap-3">
									<label className="flex flex-col">
										<span>Physical Address</span>
										<input
											type="text"
											id="address"
											value={localRegData.address.address}
											className="input input-primary"
											onChange={(e) =>
												setLocalRegData({
													...localRegData,
													address: {
														...localRegData.address,
														address: e.target.value,
													},
												})
											}
										/>
									</label>

									<label className="flex flex-col">
										<span>City</span>
										<input
											type="text"
											id="city"
											value={localRegData.address.city}
											className="input input-primary"
											onChange={(e) => {
												setLocalRegData({
													...localRegData,
													address: {
														...localRegData.address,
														city: e.currentTarget.value,
													},
												});

												if (e.currentTarget.value.length > 2) {
													const res = PhCities.search(e.currentTarget.value);
													let cities = res.map((city) => ({
														city: city.item.city,
														admin_name: city.item.admin_name,
													}));
													const limited = cities.slice(0, 5);
													setCitiesSearchResults(limited);
												} else {
													setCitiesSearchResults([]);
												}
											}}
										/>
										<AnimatePresence mode="wait">
											{citiesSearchResults.length > 0 && (
												<motion.div className="bg-base-300 p-3 flex flex-col gap-2 mt-2 rounded-btn">
													{citiesSearchResults.map((city, index: number) => (
														<div
															onClick={() => {
																setLocalRegData({
																	...localRegData,
																	address: {
																		...localRegData.address,
																		city: city.city,
																	},
																});
																setCitiesSearchResults([]);
															}}
															className="p-2 bg-base-200 rounded-btn cursor-pointer hover:bg-primary hover:text-primary-content"
															key={`city-${index}`}
														>
															{city.city}, {city.admin_name}
														</div>
													))}
												</motion.div>
											)}
										</AnimatePresence>
									</label>

									<label className="flex flex-col">
										<span>Postal Code</span>
										<input
											type="number"
											id="postal_code"
											value={localRegData.address.postalCode}
											className="input input-primary"
											onChange={(e) =>
												setLocalRegData({
													...localRegData,
													address: {
														...localRegData.address,
														postalCode: e.target.value,
													},
												})
											}
										/>
									</label>

									<div className="flex justify-between mt-10">
										<button
											className="btn btn-ghost gap-2"
											onClick={() => setFormPage(2)}
										>
											<MdArrowBack />
											<span>Go Back to Page 2</span>
										</button>
										<button
											className="btn btn-primary gap-2"
											disabled={
												!(
													localRegData.address.address &&
													localRegData.address.city &&
													localRegData.address.postalCode &&
													localRegData.email &&
													localPassword.password
												)
											}
											onClick={() => setFormPage(4)}
										>
											<span>Go to Page 4</span>
											<MdArrowForward />
										</button>
									</div>
								</div>
							</motion.div>
						)}

						{formPage === 4 && (
							<motion.div
								key={`page-${formPage}`}
								initial={{ opacity: 0, x: 20 }}
								animate={{
									opacity: 1,
									x: 0,
									transition: { easings: "circOut" },
								}}
								exit={{ opacity: 0, x: -20, transition: { easings: "circIn" } }}
							>
								<h2 className="text-2xl font-bold">Skill Profiling</h2>

								<div className="mt-5 flex flex-col gap-3">
									<label className="flex flex-col">
										<span>Primary Skill</span>
										<input
											type="text"
											id="primary_skill"
											value={localRegData.skill_primary}
											className="input input-primary"
											onChange={(e) => {
												setLocalRegData({
													...localRegData,
													skill_primary: e.currentTarget.value,
												});
												let res = Skillset.search(e.currentTarget.value);
												let skills = res.map((skill) => skill.item);
												let limited = skills.slice(0, 5);

												setSkillsetPrimarySearchResults(limited);
											}}
										/>
										{skillsetPrimarySearchResults.length > 0 && (
											<motion.div className="bg-base-300 p-3 flex flex-col gap-2 mt-2 rounded-btn">
												{skillsetPrimarySearchResults.map(
													(skill: string, index: number) => (
														<div
															onClick={() => {
																setLocalRegData({
																	...localRegData,
																	skill_primary: skill,
																});
																setSkillsetPrimarySearchResults([]);
															}}
															className="p-2 bg-base-200 rounded-btn cursor-pointer hover:bg-primary hover:text-primary-content"
															key={`skill-${index}`}
														>
															{skill}
														</div>
													),
												)}
											</motion.div>
										)}
									</label>

									<label className="flex flex-col">
										<span>Secondary Skill</span>
										<input
											type="text"
											id="secondary_skill"
											className="input input-primary"
											value={skillsetSecondaryInput}
											onChange={(e) => {
												setSkillsetSecondaryInput(e.currentTarget.value);
												let res = Skillset.search(e.currentTarget.value);
												let skills = res.map((skill) => skill.item);
												let filtered = skills.filter(
													(skill) =>
														skill !== localRegData.skill_primary &&
														!localRegData.skill_secondary.includes(skill),
												);
												let limited = filtered.slice(0, 5);

												setSkillsetSecondarySearchResults(limited);
											}}
										/>
										{localRegData.skill_secondary.length < 3 && (
											<span className="ml-auto text-error">
												Must be at least 3 skills
											</span>
										)}
										{skillsetSecondarySearchResults.length > 0 && (
											<motion.div className="bg-base-300 p-3 flex flex-col gap-2 mt-2 rounded-btn">
												{skillsetSecondarySearchResults.map(
													(skill: string, index: number) => (
														<div
															onClick={() => {
																setSkillsetSecondaryInput("");
																setLocalRegData({
																	...localRegData,
																	skill_secondary: [
																		...localRegData.skill_secondary,
																		skill,
																	],
																});
																setSkillsetSecondarySearchResults([]);
															}}
															className="p-2 bg-base-200 rounded-btn cursor-pointer hover:bg-primary hover:text-primary-content"
															key={`skill-${index}`}
														>
															{skill}
														</div>
													),
												)}
											</motion.div>
										)}
										{localRegData.skill_secondary.length > 0 && (
											<div className="flex flex-wrap gap-2 mt-2">
												{localRegData.skill_secondary.map((skill, index) => (
													<div
														key={`skill-${index}`}
														className="badge badge-accent cursor-pointer"
														onClick={() => {
															let newSkills =
																localRegData.skill_secondary.filter(
																	(s) => s !== skill,
																);
															setLocalRegData({
																...localRegData,
																skill_secondary: newSkills,
															});
														}}
													>
														<span>{skill}</span>
														<MdClose />
													</div>
												))}
											</div>
										)}
									</label>

									<div className="flex justify-between mt-10">
										<button
											className="btn btn-ghost gap-2"
											onClick={() => setFormPage(3)}
										>
											<MdArrowBack />
											<span>Go Back to Page 3</span>
										</button>
										<button
											className="btn btn-primary gap-2"
											disabled={
												!(
													localRegData.skill_primary &&
													localRegData.skill_secondary.length > 2
												)
											}
											onClick={() => setFormPage(5)}
										>
											<span>Go to Page 5</span>
											<MdArrowForward />
										</button>
									</div>
								</div>
							</motion.div>
						)}

						{formPage === 5 && (
							<motion.div
								key={`page-${formPage}`}
								initial={{ opacity: 0, x: 20 }}
								animate={{
									opacity: 1,
									x: 0,
									transition: { easings: "circOut" },
								}}
								exit={{ opacity: 0, x: -20, transition: { easings: "circIn" } }}
							>
								<h2 className="text-2xl font-bold">Information Review</h2>

								<div className="mt-5 flex flex-col gap-3">
									<div className="flex flex-col gap-2">
										<span className="text-lg font-bold">
											Personal Information
										</span>

										<div className="flex flex-col gap-3 ml-3">
											<p className="flex flex-col">
												<span className="text-sm font-bold leading-none text-accent">
													Full Name
												</span>
												<span className="leading-none">
													{localRegData.full_name.first}{" "}
													{localRegData.full_name.middle ?? ""}
													{localRegData.full_name.last}
												</span>
											</p>

											<p className="flex flex-col">
												<span className="text-sm font-bold leading-none text-accent">
													Email
												</span>
												<span className="leading-none">
													{localRegData.email}
												</span>
											</p>

											<p className="flex flex-col">
												<span className="text-sm font-bold leading-none text-accent">
													Birthdate
												</span>
												<span className="leading-none">
													{localRegData.birthdate}
												</span>
											</p>

											<p className="flex flex-col">
												<span className="text-sm font-bold leading-none text-accent">
													Birthplace
												</span>
												<span className="leading-none">
													{localRegData.birthplace}
												</span>
											</p>

											<p className="flex flex-col">
												<span className="text-sm font-bold leading-none text-accent">
													Gender
												</span>
												<span className="leading-none capitalize">
													{localRegData.gender}
												</span>
											</p>
										</div>
									</div>

									<div className="flex flex-col gap-2">
										<span className="text-lg font-bold">
											Contact Information
										</span>

										<div className="flex flex-col gap-3 ml-3">
											<p className="flex flex-col">
												<span className="text-sm font-bold leading-none text-accent">
													Physical Address
												</span>
												<span className="leading-none">
													{localRegData.address.address}
												</span>
											</p>

											<p className="flex flex-col">
												<span className="text-sm font-bold leading-none text-accent">
													City
												</span>
												<span className="leading-none">
													{localRegData.address.city}
												</span>
											</p>

											<p className="flex flex-col">
												<span className="text-sm font-bold leading-none text-accent">
													Postal Code
												</span>
												<span className="leading-none">
													{localRegData.address.postalCode}
												</span>
											</p>
										</div>
									</div>

									<div className="flex flex-col gap-2">
										<span className="text-lg font-bold">Skill Profiling</span>

										<div className="flex flex-col gap-3 ml-3">
											<p className="flex flex-col">
												<span className="text-sm font-bold leading-none text-accent">
													Primary Skill
												</span>
												<span className="leading-none">
													{localRegData.skill_primary}
												</span>
											</p>

											<p className="flex flex-col">
												<span className="text-sm font-bold leading-none text-accent">
													Secondary Skills
												</span>
												<span className="leading-none">
													{localRegData.skill_secondary.join(", ")}
												</span>
											</p>
										</div>
									</div>
								</div>

								<div className="flex justify-between mt-10">
									<button
										className="btn btn-ghost gap-2"
										onClick={() => setFormPage(4)}
									>
										<MdArrowBack />
										<span>Go Back to Page 4</span>
									</button>
									<button
										className="btn btn-primary gap-2"
										onClick={() => {
											setFormPage(6);
											handleSignUp();
										}}
									>
										<span>Sign Up and Verify</span>
										<MdPersonAdd />
									</button>
								</div>
							</motion.div>
						)}

						{formPage === 6 && (
							<motion.div
								key={`page-${formPage}`}
								initial={{ opacity: 0, x: 20 }}
								animate={{
									opacity: 1,
									x: 0,
									transition: { easings: "circOut" },
								}}
								exit={{ opacity: 0, x: -20, transition: { easings: "circIn" } }}
							>
								<h2 className="text-2xl font-bold flex gap-2 items-center">
									Signing Up
									<FiLoader className=" animate-spin" />
								</h2>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</motion.main>
		</>
	);
};

export default RegisterHunterSubPage;
