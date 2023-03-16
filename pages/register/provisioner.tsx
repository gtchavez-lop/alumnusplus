import { AnimatePresence, motion } from "framer-motion";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

import { AnimPageTransition } from "@/lib/animations";
import Fuse from "fuse.js";
import { IUserProvisioner } from "@/lib/types";
import { NextPage } from "next";
import _CompanyTypeList from "@/lib/industryTypes.json";
import _PHCities from "@/lib/ph_location.json";
import dayjs from "dayjs";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useState } from "react";

const ProvisionerPage: NextPage = () => {
	const [formPage, setFormPage] = useState(1);
	const [localRegData, setLocalRegData] = useState<IUserProvisioner>({
		address: {
			address: "",
			city: "",
			postalCode: "",
		},
		avatar_url: "",
		alternativeNames: [],
		companyEmail: "",
		companySize: "",
		companyType: "",
		contactInformation: {
			email: "",
			phone: "",
		},
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
	const [localPassword, setLocalPassword] = useState({
		password: "",
		confirmPassword: "",
	});
	const [passwordMatched, setPasswordMatched] = useState(true);
	const [citiesSearchResults, setCitiesSearchResults] = useState<
		{ city: string; admin_name: string }[]
	>([]);
	const PhCities = new Fuse(_PHCities, {
		keys: ["city", "admin_name"],
		threshold: 0.3,
	});

	const router = useRouter();

	const handleSignUp = async () => {
		const { error } = await supabase.auth.signUp({
			email: localRegData.contactInformation.email,
			password: localPassword.password,
			options: {
				data: {
					...localRegData,
					avatar_url: `https://api.dicebear.com/5.x/shapes/png?seed=${localRegData.legalName}`,
					created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
					updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
				} as IUserProvisioner,
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
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				<div className="flex flex-col items-center py-5">
					<h1 className="text-3xl font-bold text-secondary">
						Register as a Provisioner (Company)
					</h1>
					<p>Fill out the forms below to create your account.</p>
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
										<span>Email</span>
										<input
											type="email"
											id="email"
											value={localRegData.contactInformation.email || ""}
											className="input input-primary"
											onChange={(e) =>
												setLocalRegData({
													...localRegData,
													contactInformation: {
														...localRegData.contactInformation,
														email: e.currentTarget.value,
													},
												})
											}
										/>
									</label>

									<label className="flex flex-col">
										<span>Password</span>
										<input
											type="password"
											id="password"
											value={localPassword.password}
											className={`input input-primary ${
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
									</label>

									<label className="flex flex-col">
										<span>Confirm Password</span>
										<input
											type="password"
											id="confirmPassword"
											value={localPassword.confirmPassword}
											className={`input input-primary ${
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
									</label>

									<div className="flex justify-end mt-10">
										<button
											className="btn btn-primary btn-block"
											disabled={
												!(
													passwordMatched &&
													localRegData.contactInformation.email &&
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
								<h2 className="text-2xl font-bold">Company Basic Details</h2>

								<div className="mt-5 flex flex-col gap-3">
									<label className="flex flex-col">
										<span>Company Name</span>
										<input
											type="text"
											id="companyName"
											value={localRegData.legalName}
											className="input input-primary"
											onChange={(e) =>
												setLocalRegData({
													...localRegData,
													legalName: e.currentTarget.value,
												})
											}
										/>
									</label>

									<label className="flex flex-col">
										<span>Company Type</span>
										<select
											id="companyType"
											value={localRegData.companyType}
											className="select select-primary"
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
											<option value="Private Companies">
												Private Companies
											</option>
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
											<option value="Foreign Companies">
												Foreign Companies
											</option>
											<option value="Charitable Companies">
												Charitable Companies
											</option>
											<option value="Dormant Companies">
												Dormant Companies
											</option>
											<option value="Nidhi Companies">Nidhi Companies</option>
											<option value="Public Financial Institutions">
												Public Financial Institutions
											</option>
										</select>
									</label>

									<label className="flex flex-col">
										<span>Industry Type</span>
										<select
											id="industryType"
											value={localRegData.industryType}
											className="select select-primary"
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
									</label>

									<label className="flex flex-col">
										<span>Company Size</span>
										<select
											name="companySize"
											id="companySize"
											className="select select-primary w-full"
											value={localRegData.companySize}
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
										<span>Physical Company Address</span>
										<input
											type="text"
											name="companyAddress"
											id="companyAddress"
											className="input input-primary"
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
										<span>City</span>
										<input
											type="text"
											name="city"
											id="city"
											className="input input-primary"
											value={localRegData.address.city || ""}
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
										<span>Founding Year</span>
										<input
											type="number"
											name="foundingYear"
											id="foundingYear"
											className="input input-primary"
											min={1000}
											max={dayjs().year()}
											value={localRegData.foundingYear || dayjs().year()}
											onChange={(e) =>
												setLocalRegData({
													...localRegData,
													foundingYear:
														(e.currentTarget.value as unknown as number) ||
														1000,
												})
											}
										/>
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
													localRegData.legalName &&
													localRegData.companyType &&
													localRegData.industryType &&
													localRegData.companySize &&
													localRegData.address.address &&
													localRegData.address.city &&
													localRegData.foundingYear &&
													localRegData.contactInformation.email &&
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
								<div className="flex flex-col gap-2">
									<h1 className="text-2xl font-bold">Company Description</h1>

									<label className="flex flex-col">
										<span>Short Description</span>
										<textarea
											name="shortDescription"
											id="shortDescription"
											className="textarea textarea-primary"
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
										<span>Full Description</span>
										<textarea
											name="fullDescription"
											id="fullDescription"
											className="textarea textarea-primary min-h-[150px]"
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
													localRegData.shortDescription &&
													localRegData.fullDescription &&
													localRegData.contactInformation.email &&
													localPassword.password
												)
											}
											onClick={() => {
												setFormPage(4);
												handleSignUp();
											}}
										>
											<span>Submit Registration</span>
											<MdArrowForward />
										</button>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</motion.main>
		</>
	);
};

export default ProvisionerPage;
