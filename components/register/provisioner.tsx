import { AnimatePresence, motion } from "framer-motion";
import { FC, FormEvent, useState } from "react";
import {
	MdArrowBack,
	MdArrowForward,
	MdVisibility,
	MdVisibilityOff,
} from "react-icons/md";

import { AnimPageTransition } from "@/lib/animations";
import Fuse from "fuse.js";
import { IUserProvisioner } from "@/lib/types";
import { NextPage } from "next";
import _CompanyTypeList from "@/lib/industryTypes.json";
import _PHCities from "@/lib/ph_location.json";
import dayjs from "dayjs";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRouter } from "next/router";

const RegisterProvisionerSubPage: FC = () => {
	const [formPage, setFormPage] = useState(1);
	const [localRegData, setLocalRegData] = useState<IUserProvisioner>({
		address: {
			address: "",
			city: "",
		},
		banner_url: "",
		avatar_url: "",
		alternativeNames: [],
		companyEmail: "",
		companySize: "",
		companyType: "",
		contactInformation: {
			email: "",
			phone: "",
		},
		is_live: false,
		foundingYear: 0,
		fullDescription: "",
		followers: [],
		id: "",
		industryType: "",
		jobPostings: [],
		legalName: "",
		shortDescription: "",
		socialProfiles: {
			facebook: "",
			instagram: "",
			linkedin: "",
			twitter: "",
			github: "",
			youtube: "",
		},
		tags: [],
		type: "provisioner",
		totalVisits: 0,
		website: "",
	});
	const [localPassword, setLocalPassword] = useState("");
	const [isPasswordRevealed, setIsPasswordRevealed] = useState<boolean>(false);
	const [citiesSearchResults, setCitiesSearchResults] = useState<
		{ city: string; admin_name: string }[]
	>([]);
	const PhCities = new Fuse(_PHCities, {
		keys: ["city", "admin_name"],
		threshold: 0.3,
	});
	const [formInputRef] = useAutoAnimate<HTMLDivElement>();
	const router = useRouter();

	return (
		<>
			<div className="flex flex-col items-center py-5">
				<h1 className="text-3xl font-bold text-secondary text-center w-full">
					Register as a Company (Job Seeker)
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
									const password = document.getElementById(
										"password",
									) as HTMLInputElement;

									if (password.value !== form.value) {
										form.classList.add("input-error");
										password.classList.add("input-error");
									} else {
										if (
											!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/.test(
												form.value,
											) ||
											form.value.length < 8 ||
											form.value.length > 20
										) {
											form.classList.add("input-error");
											password.classList.add("input-error");
										} else {
											form.classList.remove("input-error");
											password.classList.remove("input-error");
										}
									}
									break;
							}
						}}
						onSubmit={async (e: FormEvent<HTMLFormElement>) => {
							e.preventDefault();
							toast.dismiss();
							toast.loading("Checking if email is available");

							const form = e.target as HTMLFormElement;
							const emailInput = form["email"] as HTMLInputElement;
							const passwordInput = form["password"] as HTMLInputElement;

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

							const { data, error } = await supabase
								.from("user_provisioners")
								.select("id")
								.eq("contactInformation->>email", emailInput.value);

							if (error) {
								toast.dismiss();
								toast.error(error.message);
								return;
							}

							if (data.length > 0) {
								toast.dismiss();
								toast.error("Email is already taken");
								return;
							}

							toast.dismiss();
							setLocalRegData({
								...localRegData,
								contactInformation: {
									...localRegData.contactInformation,
									email: emailInput.value,
								},
								companyEmail: emailInput.value,
							});
							setLocalPassword(passwordInput.value);

							setFormPage(2);
						}}
					>
						<h2 className="text-2xl font-bold">Account Information</h2>

						<div className="flex flex-col gap-2 mt-5">
							<label className="flex flex-col">
								<span>
									Email
									<span className="text-red-500 ml-1">*</span>
								</span>
								<input
									type="email"
									className="input input-primary"
									id="email"
									name="email"
									required
									value={localRegData.contactInformation.email}
									onChange={(e) =>
										setLocalRegData({
											...localRegData,
											contactInformation: {
												...localRegData.contactInformation,
												email: e.target.value,
											},
										})
									}
								/>
							</label>
							<label className="flex flex-col">
								<span>
									Password
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
									Confirm Password
									<span className="text-red-500 ml-1">*</span>
								</span>
								<input
									type={!isPasswordRevealed ? "password" : "text"}
									id="confirmPassword"
									name="confirmPassword"
									required
									className="input input-primary"
								/>
							</label>
						</div>

						<div className="flex justify-end mt-10">
							<button type="submit" className="btn btn-primary">
								Next
							</button>
						</div>
					</form>
				)}
				{formPage === 2 && (
					<form
						onSubmit={async (e: FormEvent<HTMLFormElement>) => {
							e.preventDefault();
							toast.dismiss();

							const form = e.target as HTMLFormElement;
							const cityInput = form["city"] as HTMLInputElement;

							let cityExists = false;
							for (const city of _PHCities) {
								if (city.city === cityInput.value) {
									cityExists = true;
									break;
								}
							}

							if (!cityExists) {
								toast.dismiss();
								cityInput.classList.add("input-error");
								toast.error("Please enter a valid city");
								return;
							} else {
								cityInput.classList.remove("input-error");
							}

							// check if company name is available
							toast.loading("Checking if company name is available");
							const { data, error } = await supabase
								.from("user_provisioners")
								.select("id")
								.eq("legalName", form["companyName"].value);

							if (error) {
								toast.dismiss();
								toast.error(error.message);
								return;
							}

							if (data.length > 0) {
								toast.dismiss();
								toast.error("Company name is already taken");
								return;
							}

							toast.dismiss();
							setLocalRegData({
								...localRegData,
								address: {
									address: form["companyAddress"].value,
									city: cityInput.value,
								},
								legalName: form["companyName"].value,
								companyType: form["companyType"].value,
								companySize: form["companySize"].value,
								foundingYear: form["foundingYear"].value,
							});

							setFormPage(3);
						}}
					>
						<h2 className="text-2xl font-bold">Company Information</h2>

						<div className="flex flex-col gap-2 mt-5">
							<label className="flex flex-col">
								<span>
									Company Name
									<span className="text-red-500 ml-1">*</span>
								</span>
								<input
									type="text"
									className="input input-primary"
									id="companyName"
									name="companyName"
									required
									value={localRegData.legalName}
									onChange={(e) =>
										setLocalRegData({
											...localRegData,
											legalName: e.target.value,
										})
									}
								/>
							</label>
							<label className="flex flex-col">
								<span>
									Company Type
									<span className="text-red-500 ml-1">*</span>
								</span>
								<select
									id="companyType"
									value={localRegData.companyType}
									className="select select-primary"
									required
									onChange={(e) =>
										setLocalRegData({
											...localRegData,
											companyType: e.currentTarget.value,
										})
									}
								>
									<option value="" disabled>
										Select Company Type
									</option>
									<option value="Companies Limited by Shares">
										Companies Limited by Shares
									</option>
									<option value="Companies Limited by Guarantee">
										Companies Limited by Guarantee
									</option>
									<option value="Unlimited Companies">
										Unlimited Companies
									</option>
									<option value="One Person Companies (OPC)">
										One Person Companies (OPC)
									</option>
									<option value="Private Companies">Private Companies</option>
									<option value="Public Companies">Public Companies</option>
									<option value="Holding and Subsidiary Companies">
										Holding and Subsidiary Companies
									</option>
									<option value="Associate Companies">
										Associate Companies
									</option>
									<option value="Companies in terms of Access to Capital">
										Companies in terms of Access to Capital
									</option>
									<option value="Government Companies">
										Government Companies
									</option>
									<option value="Foreign Companies">Foreign Companies</option>
									<option value="Charitable Companies">
										Charitable Companies
									</option>
									<option value="Dormant Companies">Dormant Companies</option>
									<option value="Nidhi Companies">Nidhi Companies</option>
									<option value="Public Financial Institutions">
										Public Financial Institutions
									</option>
								</select>
							</label>
							<label className="flex flex-col">
								<span>
									Industry Type
									<span className="text-red-500 ml-1">*</span>
									<select
										id="industryType"
										value={localRegData.industryType}
										className="select select-primary"
										required
										onChange={(e) =>
											setLocalRegData({
												...localRegData,
												industryType: e.currentTarget.value,
											})
										}
									>
										<option value="" disabled>
											Select Industry Type
										</option>
										<option value="Agriculture, Forestry, Fishing and Hunting">
											Agriculture, Forestry, Fishing and Hunting
										</option>
										<option value="Mining, Quarrying, and Oil and Gas Extraction">
											Mining, Quarrying, and Oil and Gas Extraction
										</option>
										<option value="Utilities">Utilities</option>
										<option value="Construction">Construction</option>
										<option value="Manufacturing">Manufacturing</option>
										<option value="Wholesale Trade">Wholesale Trade</option>
										<option value="Retail Trade">Retail Trade</option>
										<option value="Transportation and Warehousing">
											Transportation and Warehousing
										</option>
										<option value="Information">Information</option>
										<option value="Finance and Insurance">
											Finance and Insurance
										</option>
										<option value="Real Estate and Rental and Leasing">
											Real Estate and Rental and Leasing
										</option>
										<option value="Professional, Scientific, and Technical Services">
											Professional, Scientific, and Technical Services
										</option>
										<option value="Management of Companies and Enterprises">
											Management of Companies and Enterprises
										</option>
										<option value="Administrative and Support and Waste Management and Remediation Services">
											Administrative and Support and Waste Management and
											Remediation Services
										</option>
										<option value="Educational Services">
											Educational Services
										</option>
										<option value="Health Care and Social Assistance">
											Health Care and Social Assistance
										</option>
										<option value="Arts, Entertainment, and Recreation">
											Arts, Entertainment, and Recreation
										</option>
										<option value="Accommodation and Food Services">
											Accommodation and Food Services
										</option>
										<option value="Other Services (except Public Administration)">
											Other Services (except Public Administration)
										</option>
										<option value="Public Administration">
											Public Administration
										</option>
									</select>
								</span>
							</label>
							<label className="flex flex-col">
								<span>
									Company Size
									<span className="text-red-500 ml-1">*</span>
								</span>

								<select
									name="companySize"
									id="companySize"
									className="select select-primary w-full"
									value={localRegData.companySize}
									required
									onChange={(e) =>
										setLocalRegData({
											...localRegData,
											companySize: e.currentTarget.value,
										})
									}
								>
									<option value="" disabled>
										Select Company Size
									</option>
									<option value="1-10">1-10</option>
									<option value="11-50">11-50</option>
									<option value="51-200">51-200</option>
									<option value="201-500">201-500</option>
									<option value="501-1000">501-1000</option>
									<option value="1001-5000">1001-5000</option>
									<option value="5001-10000">5001-10000</option>
									<option value="10001-50000">10001-50000</option>
									<option value="50001-100000">50001-100000</option>
									<option value="100001-500000">100001-500000</option>
									<option value="50000+">50000+</option>
								</select>
							</label>
							<label className="flex flex-col">
								<span>
									Company Address
									<span className="text-red-500 ml-1">*</span>
								</span>

								<input
									type="text"
									name="companyAddress"
									id="companyAddress"
									className="input input-primary"
									required
									value={localRegData.address.address || ""}
									onChange={(e) =>
										setLocalRegData({
											...localRegData,
											address: {
												...localRegData.address,
												address: e.currentTarget.value,
											},
										})
									}
								/>
							</label>
							<label className="flex flex-col">
								<span>
									City
									<span className="text-red-500 ml-1">*</span>
								</span>

								<input
									type="text"
									name="city"
									id="city"
									className="input input-primary"
									value={localRegData.address.city || ""}
									required
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
							<label className="flex flex-col">
								<span>
									Founding Year
									<span className="text-red-500 ml-1">*</span>
								</span>

								<input
									type="number"
									name="foundingYear"
									id="foundingYear"
									className="input input-primary"
									min={new Date().getFullYear() - 150}
									max={new Date().getFullYear()}
									required
									value={localRegData.foundingYear || dayjs().year()}
									onChange={(e) =>
										setLocalRegData({
											...localRegData,
											foundingYear: e.currentTarget.value as unknown as number,
										})
									}
								/>
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
				{formPage === 3 && (
					<form
						onSubmit={async (e: FormEvent<HTMLFormElement>) => {
							e.preventDefault();
							const form = e.target as HTMLFormElement;
							toast.loading("Registering...");

							const { error } = await supabase.auth.signUp({
								email: localRegData.contactInformation.email,
								password: localPassword,
								options: {
									data: localRegData,
								},
							});

							if (error) {
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
						<h2 className="text-2xl font-bold">Company Description</h2>

						<div className="flex flex-col gap-4 mt-4">
							<label className="flex flex-col">
								<span>
									Short Description
									<span className="text-red-500 ml-1">*</span>
								</span>
								<textarea
									name="shortDescription"
									id="shortDescription"
									required
									className="textarea textarea-primary h-24"
									value={localRegData.shortDescription || ""}
									onChange={(e) =>
										setLocalRegData({
											...localRegData,
											shortDescription: e.currentTarget.value,
										})
									}
								/>
							</label>
							<label className="flex flex-col">
								<span>
									Full Description
									<span className="text-red-500 ml-1">*</span>
								</span>
								<textarea
									name="fullDescription"
									id="fullDescription"
									required
									className="textarea textarea-primary h-24"
									value={localRegData.fullDescription || ""}
									onChange={(e) =>
										setLocalRegData({
											...localRegData,
											fullDescription: e.currentTarget.value,
										})
									}
								/>
								<span className="ml-auto opacity-50">Markdown</span>
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
			</div>
		</>
	);
};

export default RegisterProvisionerSubPage;
