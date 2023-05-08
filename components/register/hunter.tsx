import { AnimatePresence, motion } from "framer-motion";
import { FC, FormEvent, useState } from "react";
import {
	MdAdd,
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
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const RegisterHunterSubPage: FC = () => {
	// states
	const router = useRouter();
	const [formPage, setFormPage] = useState(1);
	const [formInputRef] = useAutoAnimate();
	const [localPassword, setLocalPassword] = useState<string>("");
	const [isPasswordRevealed, setIsPasswordRevealed] = useState<boolean>(false);
	const [localRegData, setLocalRegData] = useState<IUserHunter>({
		address: {
			address: "",
			city: "",
			postalCode: "",
		},
		activeJob: "",
		applied_jobs: [],
		avatar_url: "",
		banner_url: "",
		birthdate: "",
		bio: "",
		citizenship: "",
		birthplace: "",
		civil_status: "" as
			| "single"
			| "married"
			| "divorced"
			| "widowed"
			| "separated",
		connections: [],
		education: [],
		cover_letter: "",
		created_at: "",
		email: "",
		experience: [],
		followedCompanies: [],
		full_name: {
			first: "",
			last: "",
			middle: "",
		},
		gender: "male" as
			| "male"
			| "female"
			| "non-binary"
			| "other"
			| "prefer not to say",
		id: "",
		id_number: "",
		id_type: "" as "other" | "national id" | "passport" | "driver's license",
		is_verified: false,
		phone: "",
		saved_jobs: [],
		skill_primary: "",
		skill_secondary: [],
		social_media_links: {
			facebook: "",
			instagram: "",
			linkedin: "",
			twitter: "",
			github: "",
			youtube: "",
		},
		subscription_type: "" as "junior" | "senior" | "expert",
		trainings: [],
		type: "hunter",
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

	// Fuse Search
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

	return (
		<>
			<div className="flex flex-col items-center py-5">
				<h1 className="text-3xl font-bold text-secondary text-center w-full">
					Register as a Hunter (Job Seeker)
				</h1>
				<p className="text-center w-fulll">
					Fill out the forms below to create your account.
				</p>
			</div>

			<div
				ref={formInputRef}
				className="w-full bg-base-200 p-5 rounded-btn max-w-xl mx-auto mt-10"
			>
				{formPage === 1 && (
					<form
						onChange={(e: FormEvent<HTMLFormElement>) => {
							const form = e.target as HTMLFormElement;
							switch (form.name) {
								case "username":
									if (!/^[a-zA-Z0-9_.-]*$/.test(form.value)) {
										form.classList.add("input-error");
										// remove all characters that are not alphanumeric, underscore, period, or dash
									} else {
										form.classList.remove("input-error");
									}
									break;
								case "email":
									if (
										!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(
											form.value,
										)
									) {
										form.classList.add("input-error");
									} else {
										form.classList.remove("input-error");
									}
									break;
								case "password":
									const confirmPassword = document.getElementById(
										"confirmPassword",
									) as HTMLInputElement;

									if (confirmPassword.value !== form.value) {
										form.classList.add("input-error");
										confirmPassword.classList.add("input-error");
									} else {
										if (
											!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/.test(
												form.value,
											) ||
											form.value.length < 8 ||
											form.value.length > 20
										) {
											form.classList.add("input-error");
											confirmPassword.classList.add("input-error");
										} else {
											form.classList.remove("input-error");
											confirmPassword.classList.remove("input-error");
										}
									}
									break;
								case "confirmPassword":
									const passwordInput = document.getElementById(
										"password",
									) as HTMLInputElement;

									if (passwordInput.value !== form.value) {
										form.classList.add("input-error");
										passwordInput.classList.add("input-error");
									} else {
										if (
											!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/.test(
												form.value,
											) ||
											form.value.length < 8 ||
											form.value.length > 20
										) {
											form.classList.add("input-error");
											passwordInput.classList.add("input-error");
										} else {
											form.classList.remove("input-error");
											passwordInput.classList.remove("input-error");
										}
									}
									break;
							}
						}}
						onSubmit={async (e: FormEvent<HTMLFormElement>) => {
							e.preventDefault();
							toast.dismiss();
							toast.loading("Checking if username and email are available");

							const form = e.target as HTMLFormElement;

							const usernameInput = form["username"] as HTMLInputElement;
							const emailInput = form["email"] as HTMLInputElement;
							const passwordInput = form["password"] as HTMLInputElement;
							// check if username, email, and password are valid
							if (usernameInput.classList.contains("input-error")) {
								toast.dismiss();
								toast.error(
									"Username must only contain alphanumeric characters, underscores, periods, and dashes",
								);
								return;
							}
							if (emailInput.classList.contains("input-error")) {
								toast.dismiss();
								toast.error("Please enter a valid email address");
								return;
							}
							if (passwordInput.classList.contains("input-error")) {
								toast.dismiss();
								toast.error(
									"Password must be at least 8 characters long, and must contain at least one uppercase letter, one lowercase letter, and one number, and one special character",
								);
								return;
							}

							// check if username and email are already taken
							const { data, error } = await supabase
								.from("user_hunters")
								.select("username,email")
								.or(
									`username.eq.${usernameInput.value},email.eq.${emailInput.value}`,
								);

							console.log(data, error);

							if (error) {
								toast.dismiss();
								toast(error.message);
								return;
							}

							if (data.length > 0) {
								for (const c in data) {
									if (data[c].username === usernameInput.value) {
										toast.dismiss();
										toast.error("Username is already taken");
										break;
									}
									if (data[c].email === emailInput.value) {
										toast.dismiss();
										toast.error("Email is already taken");
										break;
									}
								}
							}

							console.log(data);
							toast.dismiss();
							setLocalRegData({
								...localRegData,
								username: usernameInput.value,
								email: emailInput.value,
							});
							setLocalPassword(passwordInput.value);

							window.scrollTo({
								top: 0,
								behavior: "smooth",
							});
							setFormPage(2);
						}}
					>
						<h2 className="text-2xl font-bold">Account Information</h2>

						<div className="mt-5 flex flex-col gap-3">
							<label className="flex flex-col">
								<span>
									<span>Username</span>
									<span className="text-red-500 ml-1">*</span>
								</span>
								<input
									type="text"
									id="username"
									name="username"
									required
									maxLength={20}
									value={localRegData.username}
									onChange={(e) => {
										setLocalRegData({
											...localRegData,
											username: e.target.value,
										});
									}}
									className="input input-primary"
								/>
							</label>
							<label className="flex flex-col">
								<span>
									<span>Email</span>
									<span className="text-red-500 ml-1">*</span>
								</span>
								<input
									type="email"
									id="email"
									name="email"
									required
									value={localRegData.email}
									onChange={(e) => {
										setLocalRegData({
											...localRegData,
											email: e.target.value,
										});
									}}
									className="input input-primary"
								/>
							</label>
							<label className="flex flex-col">
								<span>
									<span>Password</span>
									<span className="text-red-500 ml-1">*</span>
								</span>
								<div className="flex items-center gap-1">
									<label className="input-group">
										<input
											type={!isPasswordRevealed ? "password" : "text"}
											id="password"
											name="password"
											required
											className="input input-primary flex-1"
											value={localPassword}
											onChange={(e) => {
												setLocalPassword(e.target.value);
											}}
										/>
										<button
											type="button"
											onClick={() => setIsPasswordRevealed(!isPasswordRevealed)}
											className="btn btn-primary"
										>
											{!isPasswordRevealed ? (
												<MdVisibility className="text-lg" />
											) : (
												<MdVisibilityOff className="text-lg" />
											)}
										</button>
									</label>
								</div>
							</label>
							<label className="flex flex-col">
								<span>
									<span>Confirm Password</span>
									<span className="text-red-500 ml-1">*</span>
								</span>
								<div className="flex items-center gap-1">
									<input
										type={!isPasswordRevealed ? "password" : "text"}
										id="confirmPassword"
										name="confirmPassword"
										required
										className="input input-primary flex-1"
									/>
								</div>
							</label>

							<div className="flex justify-end mt-10">
								<button type="submit" className="btn btn-primary">
									Next
								</button>
							</div>
						</div>
					</form>
				)}
				{formPage === 2 && (
					<form
						onSubmit={(e: FormEvent<HTMLFormElement>) => {
							e.preventDefault();

							const form = e.target as HTMLFormElement;

							const givenNameInput = form["givenName"] as HTMLInputElement;
							const middleNameInput = form["middleName"] as HTMLInputElement;
							const lastNameInput = form["lastName"] as HTMLInputElement;
							const birthdateInput = form["birthdate"] as HTMLInputElement;
							const birthplaceInput = form["birthplace"] as HTMLInputElement;
							const civilStatusInput = form[
								"civil_status"
							] as HTMLSelectElement;
							const genderInput = form["gender"] as HTMLSelectElement;
							const mobileInput = form["mobileNumber"] as HTMLInputElement;

							setLocalRegData({
								...localRegData,
								full_name: {
									first: givenNameInput.value,
									middle: middleNameInput.value,
									last: lastNameInput.value,
								},
								birthdate: birthdateInput.value,
								birthplace: birthplaceInput.value,
								civil_status: civilStatusInput.value as
									| "single"
									| "married"
									| "divorced"
									| "widowed"
									| "separated",
								gender: genderInput.value as
									| "male"
									| "female"
									| "non-binary"
									| "other"
									| "prefer not to say",
								phone: mobileInput.value,
							});

							setFormPage(3);
						}}
					>
						<h2 className="text-2xl font-bold">Personal Information</h2>

						<div className="mt-5 flex flex-col gap-3">
							<label className="flex flex-col">
								<span>
									Given Name
									<span className="text-red-500 ml-1">*</span>
								</span>
								<input
									type="text"
									id="givenName"
									name="givenName"
									required
									className="input input-primary"
									value={localRegData.full_name.first}
									onChange={(e) => {
										setLocalRegData({
											...localRegData,
											full_name: {
												...localRegData.full_name,
												first: e.target.value.replace(/[^a-zA-Z ]/g, ""),
											},
										});
									}}
								/>
							</label>
							<label className="flex flex-col">
								<span>Middle Name</span>
								<input
									type="text"
									id="middleName"
									name="middleName"
									className="input input-primary"
									value={localRegData.full_name.middle}
									onChange={(e) => {
										setLocalRegData({
											...localRegData,
											full_name: {
												...localRegData.full_name,
												middle: e.target.value.replace(/[^a-zA-Z ]/g, ""),
											},
										});
									}}
								/>
							</label>
							<label className="flex flex-col">
								<span>
									Last Name
									<span className="text-red-500 ml-1">*</span>
								</span>
								<input
									type="text"
									id="lastName"
									name="lastName"
									required
									className="input input-primary"
									value={localRegData.full_name.last}
									onChange={(e) => {
										setLocalRegData({
											...localRegData,
											full_name: {
												...localRegData.full_name,
												last: e.target.value.replace(/[^a-zA-Z ]/g, ""),
											},
										});
									}}
								/>
							</label>
							<label className="flex flex-col">
								<span>
									Birthdate
									<span className="text-red-500 ml-1">*</span>
								</span>
								<input
									type="date"
									id="birthdate"
									name="birthdate"
									required
									max={dayjs().subtract(18, "years").format("YYYY-MM-DD")}
									min={dayjs().subtract(60, "years").format("YYYY-MM-DD")}
									className="input input-primary"
									value={localRegData.birthdate}
									onChange={(e) => {
										setLocalRegData({
											...localRegData,
											birthdate: e.target.value,
										});
									}}
								/>
							</label>
							<label className="flex flex-col">
								<span>
									Birthplace
									<span className="text-red-500 ml-1">*</span>
								</span>
								<input
									type="text"
									id="birthplace"
									name="birthplace"
									required
									className="input input-primary"
									value={localRegData.birthplace}
									onChange={(e) => {
										setLocalRegData({
											...localRegData,
											birthplace: e.target.value,
										});
									}}
								/>
							</label>
							<label className="flex flex-col">
								<span>
									Civil Status
									<span className="text-red-500 ml-1">*</span>
								</span>

								<select
									id="civil_status"
									name="civil_status"
									defaultValue="single"
									required
									className='select select-primary'
									value={localRegData.civil_status}
									onChange={(e) => {
										setLocalRegData({
											...localRegData,
											civil_status: e.target.value as
												| "single"
												| "married"
												| "divorced"
												| "widowed"
												| "separated",
										});
									}}
								>
									<option value="single">Single</option>
									<option value="married">Married</option>
									<option value="widowed">Widowed</option>
									<option value="separated">Separated</option>
									<option value="divorced">Divorced</option>
								</select>
							</label>
							<label className="flex flex-col">
								<span>
									Gender
									<span className="text-red-500 ml-1">*</span>
								</span>

								<select
									id="gender"
									name="gender"
									defaultValue="male"
									required
									className='select select-primary'
									value={localRegData.gender}
									onChange={(e) => {
										setLocalRegData({
											...localRegData,
											gender: e.target.value as
												| "male"
												| "female"
												| "non-binary"
												| "other"
												| "prefer not to say",
										});
									}}
								>
									<option value="male">Male</option>
									<option value="female">Female</option>
									<option value="non-binary">Non-Binary</option>
									<option value="other">Other</option>
									<option value="prefer not to say">Prefer not to say</option>
								</select>
							</label>
							<label className="flex flex-col">
								<span>Mobile Number</span>
								<div className="flex gap-2 items-center">
									<span>+63</span>
									<input
										type="number"
										id="mobileNumber"
										name="mobileNumber"
										className="input input-primary flex-1"
										value={localRegData.phone}
										onChange={(e) => {
											setLocalRegData({
												...localRegData,
												phone: e.target.value,
											});
										}}
									/>
								</div>
							</label>
							<label className="flex flex-col">
								<span>Bio (can be added later)</span>
								<textarea
									id="bio"
									name="bio"
									className="input input-primary h-32"
									rows={3}
									value={localRegData.bio}
									onChange={(e) => {
										setLocalRegData({
											...localRegData,
											bio: e.target.value,
										});
									}}
								/>
							</label>
						</div>

						<div className="flex justify-between mt-10">
							<button
								type="button"
								onClick={() => setFormPage(1)}
								className="btn btn-primary"
							>
								Back
							</button>
							<button type="submit" className="btn btn-primary">
								Next
							</button>
						</div>
					</form>
				)}
				{formPage === 3 && (
					<form
						onSubmit={(e: FormEvent<HTMLFormElement>) => {
							e.preventDefault();

							const form = e.target as HTMLFormElement;
							const cityInput = form["city"] as HTMLInputElement;

							// check if city is included in the list of cities
							// loop through cities in json file
							let cityExists = false;
							for (const city of _PHCities) {
								if (city.city === cityInput.value) {
									cityExists = true;
									break;
								}
							}

							if (!cityExists) {
								toast.error("City does not exist");
								return;
							}

							setFormPage(4);
						}}
					>
						<h2 className="text-2xl font-bold">Residence Information</h2>

						<div className="mt-5 flex flex-col gap-3">
							<label className="flex flex-col">
								<span>
									Address
									<span className="text-red-500 ml-1">*</span>
								</span>
								<input
									type="text"
									id="address"
									name="address"
									required
									className="input input-primary"
									value={localRegData.address.address}
									onChange={(e) => {
										setLocalRegData({
											...localRegData,
											address: {
												...localRegData.address,
												address: e.target.value,
											},
										});
									}}
								/>
							</label>
							<label className="flex flex-col">
								<span>
									City
									<span className="text-red-500 ml-1">*</span>
								</span>

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
											const cities = res.map((city) => ({
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
						</div>

						<div className="flex justify-between mt-10">
							<button
								type="button"
								onClick={() => setFormPage(2)}
								className="btn btn-primary"
							>
								Back
							</button>
							<button type="submit" className="btn btn-primary">
								Next
							</button>
						</div>
					</form>
				)}
				{formPage === 4 && (
					<form
						onSubmit={async (e: FormEvent<HTMLFormElement>) => {
							e.preventDefault();

							toast.loading("Registering...");

							// check if primary skill is not empty
							if (localRegData.skill_primary === "") {
								toast.dismiss();
								toast.error("Primary skill is required");
								return;
							}

							// check if secondary skill has 3 items with max of 10
							if (
								localRegData.skill_secondary.length < 3 ||
								localRegData.skill_secondary.length > 10
							) {
								toast.dismiss();
								toast.error(
									"Secondary skill must have at least 3 items and maximum of 10",
								);
								return;
							}

							// add default avatar
							localRegData.avatar_url = `https://api.dicebear.com/6.x/open-peeps/png?seed=${localRegData.username}`;
							localRegData.banner_url = `https://picsum.photos/seed/${localRegData.username}/200/300`;

							const { error } = await supabase.auth.signUp({
								email: localRegData.email,
								password: localPassword,
								options: {
									data: localRegData,
								},
							});

							if (error) {
								toast.dismiss();
								toast.error(error.message);
								return;
							}

							toast.dismiss();
							toast.success("Successfully registered");
							toast("Redirecting to login page...");
							toast("Please check your email for verification");

							setTimeout(() => {
								router.push("/login");
							}, 5000);
						}}
					>
						<h2 className="text-2xl font-bold">Skillset Tagging</h2>

						<div className="mt-5 flex flex-col gap-3">
							<label className="flex flex-col">
								<span>
									Primary Skill
									<span className="text-red-500 ml-1">*</span>
								</span>
								<input
									type="text"
									id="primary_skill"
									value={localRegData.skill_primary}
									className="input input-primary"
									required
									onChange={(e) => {
										setLocalRegData({
											...localRegData,
											skill_primary: e.currentTarget.value,
										});
										const res = Skillset.search(e.currentTarget.value);
										const skills = res.map((skill) => skill.item);
										const limited = skills.slice(0, 5);

										setSkillsetPrimarySearchResults(limited);
									}}
								/>
								{skillsetPrimarySearchResults.length > 0 && (
									<motion.div className="bg-base-300 p-3 flex flex-col gap-2 mt-2 rounded-btn">
										{/* add custom tag */}
										<div
											onClick={() => {
												setLocalRegData({
													...localRegData,
													// make it title case
													skill_primary: localRegData.skill_primary
														.split(" ")
														.map(
															(word) => word[0].toUpperCase() + word.slice(1),
														)
														.join(" "),
												});
												setSkillsetPrimarySearchResults([]);
											}}
											className="p-2 bg-base-200 rounded-btn cursor-pointer hover:bg-primary hover:text-primary-content flex justify-between items-center gap-2"
										>
											{localRegData.skill_primary} <MdAdd />
										</div>
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
								<span>
									Secondary Skills
									<span className="text-red-500 ml-1">*</span>
								</span>

								<input
									type="text"
									id="secondary_skill"
									className="input input-primary"
									value={skillsetSecondaryInput}
									onChange={(e) => {
										setSkillsetSecondaryInput(e.currentTarget.value);
										const res = Skillset.search(e.currentTarget.value);
										const skills = res.map((skill) => skill.item);
										const filtered = skills.filter(
											(skill) =>
												skill !== localRegData.skill_primary &&
												!localRegData.skill_secondary.includes(skill),
										);
										const limited = filtered.slice(0, 5);

										setSkillsetSecondarySearchResults(limited);
									}}
								/>
								{localRegData.skill_secondary.length < 3 && (
									<span className="ml-auto text-error">
										Must be at least 3 skills
									</span>
								)}
								{skillsetSecondaryInput.length > 0 && (
									<motion.div className="bg-base-300 p-3 flex flex-col gap-2 mt-2 rounded-btn">
										{/* add custom tag */}
										<div
											onClick={() => {
												setLocalRegData({
													...localRegData,
													// make it title case
													skill_secondary: [
														...localRegData.skill_secondary,
														skillsetSecondaryInput
															.split(" ")
															.map(
																(word) => word[0].toUpperCase() + word.slice(1),
															)
															.join(" "),
													],
												});
												setSkillsetSecondaryInput("");
											}}
											className="p-2 bg-base-200 rounded-btn cursor-pointer hover:bg-primary hover:text-primary-content flex justify-between items-center gap-2"
										>
											{skillsetSecondaryInput} <MdAdd />
										</div>
										{skillsetSecondarySearchResults.length > 0 &&
											skillsetSecondarySearchResults.map(
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
													const newSkills = localRegData.skill_secondary.filter(
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
						</div>

						<div className="flex justify-between mt-10">
							<button
								type="button"
								onClick={() => setFormPage(formPage - 1)}
								className="btn btn-primary"
							>
								Back
							</button>
							<button type="submit" className="btn btn-primary">
								Next
							</button>
						</div>
					</form>
				)}
			</div>
		</>
	);
};

export default RegisterHunterSubPage;
