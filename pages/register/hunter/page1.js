import { FiArrowDownCircle, FiPlus, FiX } from "react-icons/fi";

import { $schema_hunter } from "../../../schemas/user";
import $schema_skills from "../../../schemas/skills";
import { __PageTransition } from "../../../lib/animtions";
import __supabase from "../../../lib/supabase";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useState } from "react";
import uuidv4 from "../../../lib/uuidv4";

const MM_Cities = [
	{ name: "Caloocan", province: "MM", city: true },
	{ name: "Las Piñas", province: "MM", city: true },
	{ name: "Makati", province: "MM", city: true },
	{ name: "Malabon", province: "MM", city: true },
	{ name: "Mandaluyong", province: "MM", city: true },
	{ name: "Manila", province: "MM", city: true },
	{ name: "Marikina", province: "MM", city: true },
	{ name: "Muntinlupa", province: "MM", city: true },
	{ name: "Navotas", province: "MM", city: true },
	{ name: "Parañaque", province: "MM", city: true },
	{ name: "Pasay", province: "MM", city: true },
	{ name: "Pasig", province: "MM", city: true },
	{ name: "Pateros", province: "MM" },
	{ name: "Quezon", province: "MM", city: true },
	{ name: "San Juan", province: "MM", city: true },
	{ name: "Taguig", province: "MM", city: true },
	{ name: "Valenzuela", province: "MM", city: true },
];

const Hunter_SignUp_Page1 = ({ setPage }) => {
	const [usernameTaken, setUsernameTaken] = useState(null);
	const [isAlreadyHunter, setIsAlreadyHunter] = useState(null);
	const [subSkillList, setSubSkillList] = useState([]);
	const [subSkillSearchResults, setSubSkillSearchResults] = useState([]);
	const router = useRouter();

	const checkIfUsernameIsTaken = async (username) => {
		const { data, error } = await __supabase.from("user_hunters").select("*").eq("username", username);
		if (error) {
			console.log(error);
			return;
		} else {
			if (data.length > 0) {
				return true;
			} else {
				return false;
			}
		}
	};

	const checkIfEmailIsAlreadyHunter = async (email) => {
		const { data, error } = await __supabase.from("user_hunters").select("*").eq("email", email);
		if (error) {
			console.log(error);
			return;
		} else {
			if (data.length > 0) {
				return true;
			} else {
				return false;
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const form = e.target;
		const schema = $schema_hunter;

		if (
			form.username.value === "" ||
			form.email.value === "" ||
			form.password.value === "" ||
			form.firstName.value === "" ||
			form.lastName.value === "" ||
			form.address.value === "" ||
			form.city.value === "" ||
			form.skillPrimary.value === "" ||
			subSkillList.length === 0 ||
			form.birthdate.value === "" ||
			form.birthplace.value === "" ||
			form.gender.value === ""
		) {
			toast.error("Please fill out all the fields.");
			// scroll to top smoothly
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
			// add "input-error" in classList on the fields that are empty
			for (let i = 0; i < form.length - 1; i++) {
				if (form[i].value === "" && form[i].name !== "middleName") {
					form[i].classList.add("input-error");
				}
			}

			return;
		}
		toast.loading("Creating account...");

		checkIfUsernameIsTaken(form.username.value).then((res) => {
			if (res) {
				toast.dismiss();
				setUsernameTaken(true);
				toast.error("Username is already taken.");
				return;
			} else {
				setUsernameTaken(false);
				checkIfEmailIsAlreadyHunter(form.email.value).then((res) => {
					if (res) {
						setIsAlreadyHunter(true);
						toast.dismiss();
						toast.error("Email is already registered as a hunter.");
						return;
					} else {
						setIsAlreadyHunter(false);

						__supabase.auth
							.signUp(
								{
									email: form.email.value,
									password: form.password.value,
								},
								{
									data: {
										username: form.username.value,
										email: form.email.value,
										education: [],
										connections: [],
										fullname: {
											first: form.firstName.value,
											middle: form.middleName.value || "",
											last: form.lastName.value,
										},
										gender: form.gender.value,
										address: {
											address: form.address.value,
											city: form.city.value,
											postalCode: form.postalCode.value,
										},
										phone: "",
										birthdate: form.birthdate.value,
										birthplace: form.birthplace.value,
										skillPrimary: form.skillPrimary.value,
										skillSecondary: subSkillList,
									},
								},
							)
							.then(({ user, error }) => {
								toast.dismiss();
								if (error) {
									toast.error(error.message);
									return;
								} else {
									toast.success("Account created successfully!");
									router.push("/login");
								}
							});
					}
				});
			}
		});
	};

	return (
		<motion.main transition={{ duration: 0.3, ease: "circOut" }} className="relative py-16">
			{/* img background with gradient filter */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed w-full h-screen top-0 right-0 "
			>
				<div className="hidden lg:block absolute top-0 right-0 w-1/2 h-full bg-gradient-to-r from-base-100 to-transparent" />
				<img
					src="https://images.unsplash.com/photo-1613909207039-6b173b755cc1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80"
					className="absolute top-0 right-0 hidden lg:block w-1/2 h-full object-cover -z-10 transition-all duration-300"
					alt="background"
				/>
			</motion.div>

			<motion.div
				className="relative"
				initial={{ opacity: 0, translateY: 50 }}
				animate={{ opacity: 1, translateY: 0 }}
				exit={{ opacity: 0 }}
			>
				<h1 className="text-3xl">Hunter Account</h1>
				<p className="opacity-50 max-w-md">
					A Hunter is a person who is looking for a job. They can be freelancers, contractors, or full-time employees.
				</p>

				<div className="grid grid-cols-1 lg:grid-cols-3 z-10">
					<form
						className="grid grid-cols-2 gap-5 mt-16 gap-y-2 lg:col-span-2"
						onSubmit={(e) => handleSubmit(e)}
						onChange={(e) => {
							const form = e.target.form;
							// remove "input-error" in classList on the target field
							e.target.classList.remove("input-error");
						}}
					>
							{/* email and password */}
						<div className="flex flex-col col-span-full">
							<label htmlFor="email">Email</label>
							<input
								type="email"
								name="email"
								id="email"
								className={`input ${isAlreadyHunter === true ? "input-error" : "input-primary"} `}
								placeholder="Email"
								onChange={(e) => {
									setIsAlreadyHunter(null);
								}}
							/>
						</div>
						<div className="flex flex-col col-span-full">
							<label htmlFor="password">Password</label>
							<input
								type="password"
								name="password"
								id="password"
								className="input input-primary"
								placeholder="Password"
							/>
						</div>
						{/* divider */}
						<div className="col-span-full divider my-5" />
						{/* name */}
						<div className="flex flex-col col-span-full">
							<label htmlFor="username">Username</label>
							<input
								type="username"
								name="username"
								id="username"
								className={`input ${usernameTaken === true ? "input-error" : "input-primary"}`}
								placeholder="Username"
								onChange={(e) => {
									setUsernameTaken(null);
								}}
							/>
						</div>
						<div className="flex flex-col">
							<label htmlFor="firstName">First Name</label>
							<input
								type="text"
								name="firstName"
								id="firstName"
								className="input input-primary"
								placeholder="First Name"
							/>
						</div>
						<div className="flex flex-col">
							<label htmlFor="lastName">Last Name</label>
							<input
								type="text"
								name="lastName"
								id="lastName"
								className="input input-primary"
								placeholder="Last Name"
							/>
						</div>
						<div className="flex flex-col">
							<label htmlFor="middleName">Middle Name (optional)</label>
							<input
								type="text"
								name="middleName"
								id="middleName"
								className="input input-primary"
								placeholder="Middle Name"
							/>
						</div>
						{/* divider */}
						<div className="col-span-full divider my-0 h-2  opacity-0" />
						<div className="flex flex-col">
							<label htmlFor="gender">Gender</label>
							<select id="gender" className="select select-primary">
								<option disabled={true}>Select Gender</option>
								<option value={"male"}>Male</option>
								<option value={"female"}>Female</option>
								<option value={"nonbinary"}>Non-binary</option>
							</select>
						</div>
						<div className="flex flex-col">
							<label htmlFor="birthdate">Birthdate</label>
							<input
								type="date"
								name="birthdate"
								id="birthdate"
								className="input input-primary"
								placeholder="Birthdate"
							/>
						</div>
						<div className="flex flex-col col-span-full">
							<label htmlFor="birthplace">Birthplace</label>
							<input
								type="text"
								name="birthplace"
								id="birthplace"
								className="input input-primary"
								placeholder="Birthplace"
							/>
						</div>
						{/* divider */}
						<div className="col-span-full divider my-0 h-2  opacity-0" />
						<div className="flex flex-col col-span-full">
							<label htmlFor="address">Address</label>
							<input type="text" name="address" id="address" className="input input-primary" placeholder="Address" />
						</div>
						<div className="flex flex-col">
							<label htmlFor="city">City</label>
							<select id="city" className="select select-primary">
								<option disabled={true}>Select City</option>
								{MM_Cities.map((city) => (
									<option key={city.id} value={city.id}>
										{city.name}
									</option>
								))}
							</select>
						</div>
						<div className="flex flex-col">
							<label htmlFor="postalCode">Postal Code</label>
							<input
								type="number"
								name="postalCode"
								id="postalCode"
								className="input input-primary appearance-none"
								placeholder="Postal Code"
							/>
						</div>
						{/* divider */}
						<div className="col-span-full divider my-0 h-2  opacity-0" />
						{/* skills */}
						<div className="flex flex-col col-span-full">
							<label htmlFor="skillPrimary">Primary Skill</label>
							<select id="skillPrimary" name="skillPrimary" className="select select-primary">
								{$schema_skills.map((skill, index) => (
									<option key={`skill_${index + 1}`} value={skill}>
										{skill}
									</option>
								))}
							</select>
						</div>
						<div className="flex flex-col col-span-full">
							<label htmlFor="skillSecondary">Other Skills</label>
							{subSkillList.length > 0 && (
								<div className="flex flex-col mt-5">
									<p className="text-sm text-gray-500">Selected Skills</p>
									<div className="flex flex-wrap gap-2 w-full mb-5">
										{subSkillList.map((skill, index) => (
											<motion.p
												animate={{ opacity: [0, 1], scale: [0, 1] }}
												transition={{ duration: 0.2 }}
												onClick={() => {
													setSubSkillList(subSkillList.filter((_, i) => i !== index));
												}}
												className="badge badge-primary"
												key={`skill_${index}`}
											>
												{skill} <FiX className="ml-2" />
											</motion.p>
										))}
									</div>
								</div>
							)}
							{/* search input */}
							<div className="flex flex-col">
								<input
									type="text"
									name="skillSecondary"
									id="skillSecondary"
									className="input input-primary"
									placeholder="Search Skills"
									onBlur={(e) => (e.target.value = "")}
									onChange={(e) => {
										const value = e.target.value;
										if (value.length > 0) {
											setSubSkillSearchResults(
												$schema_skills.filter(
													(skill) => skill.toLowerCase().includes(value.toLowerCase()) && !subSkillList.includes(skill),
												),
											);
										} else {
											setSubSkillSearchResults([]);
										}
									}}
								/>

								{subSkillSearchResults.length > 0 && (
									<div className="flex gap-2 flex-wrap mt-5">
										{subSkillSearchResults.map((skill, index) => (
											<p
												onClick={() => {
													setSubSkillList([...subSkillList, skill]);
													setSubSkillSearchResults([]);
												}}
												className="badge badge-primary"
												key={`skill_${index}`}
											>
												{skill} <FiPlus className="ml-2" />
											</p>
										))}
									</div>
								)}
							</div>

							{/* <div className="collapse">
                <input type="checkbox" />
                <div className="collapse-title justify-between flex">
                  Click to show and add other skills
                  <FiArrowDownCircle className="" />
                </div>
                <div className="collapse-content flex flex-wrap gap-5">
                  {
                    $schema_skills.filter(skill => !subSkillList.includes(skill)).map((skill, index) => (
                      <p className="badge badge-primary flex gap-3 cursor-pointer"
                        onClick={() => {
                          // sort the array
                          setSubSkillList([...subSkillList, skill].sort());

                        }}
                        key={`skillChoice_${index + 1}`} >
                        {skill} <FiPlus />
                      </p>
                    ))
                  }
                </div>
              </div> */}
						</div>
						{/* divider */}
						<div className="col-span-full divider my-0 h-2  opacity-0" />
						{/* submit */}
						<div className="col-span-full flex flex-col col-start-1">
							<button className="btn btn-primary" type="submit">
								Submit
							</button>
						</div>
					</form>
				</div>
			</motion.div>
		</motion.main>
	);
};

export default Hunter_SignUp_Page1;
