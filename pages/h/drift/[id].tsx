import { AnimPageTransition, AnimTabTransition } from "@/lib/animations";
import { AnimatePresence, motion } from "framer-motion";
import { GetServerSideProps, NextPage } from "next";
import { IUserProvisioner, TProvJobPost } from "@/lib/types";

import { $accountDetails } from "@/lib/globalStates";
import Footer from "@/components/Footer";
import Image from "next/image";
import JobCard from "@/components/jobs/JobCard";
import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { supabase } from "@/lib/supabase";
import { useQueries } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { useStore } from "@nanostores/react";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { id } = context.params as { id: string };

	const { data, error } = await supabase
		.from("user_provisioners")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		console.log(error);
	}

	return {
		props: {
			companyData: data as IUserProvisioner,
		},
	};
};

const ProvisionerPage: NextPage<{ companyData: IUserProvisioner }> = ({
	companyData,
}) => {
	const [tabSelected, setTabSelected] = useState<"about" | "jobs">("about");

	const fetchAllJobs = async () => {
		const { data, error } = await supabase
			.from("public_jobs")
			.select("*,uploader:uploader_id(legalName)")
			.eq("uploader_id", companyData.id);

		if (error) {
			console.log(error);
		}

		return data as TProvJobPost[];
	};

	const [allJobPosts] = useQueries({
		queries: [
			{
				queryKey: ["driftData", companyData.legalName],
				queryFn: fetchAllJobs,
				refetchOnMount: false,
				refetchOnWindowFocus: false,
				enabled: !!companyData,
			},
		],
	});

	return (
		<>
			{companyData && (
				<motion.main
					variants={AnimPageTransition}
					initial="initial"
					animate="animate"
					exit="exit"
					className="relative min-h-screen w-full pt-24 pb-36"
				>
					<div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
						<div className="col-span-full lg:col-span-3">
							{/* profile */}
							<div className="relative rounded-btn flex flex-col gap-3">
								<div className="absolute h-[250px] w-full">
									<div className="bg-gradient-to-t from-base-100 to-transparent w-full h-full absolute opacity-75" />
									<Image
										className="object-cover rounded-btn rounded-b-none object-center w-full h-full "
										src={`https://picsum.photos/seed/${companyData.legalName}/900/500`}
										alt="background"
										width={900}
										height={500}
										priority
									/>
								</div>
								<div className="z-10 mt-[200px] px-5 flex items-end gap-5">
									<Image
										className="mask mask-squircle bg-primary"
										src={`https://api.dicebear.com/5.x/shapes/png?seed=${companyData.legalName}`}
										alt="profile"
										width={100}
										height={100}
										priority
									/>
									<div>
										<p className="text-xl leading-tight font-bold">
											{companyData.legalName}
										</p>
										<p className="text-sm">0 followers</p>
									</div>
									<button className="btn btn-primary ml-auto">Follow</button>
								</div>
							</div>
							<div className="divider bg-base-content h-[5px] rounded-full opacity-20 my-10" />
							{/* tabs */}
							<div className="grid grid-cols-2 gap-2">
								<div
									className={`btn btn-block ${
										tabSelected === "about" ? "btn-primary" : "btn-ghost"
									}`}
									onClick={() => setTabSelected("about")}
								>
									About
								</div>
								<div
									className={`btn btn-block ${
										tabSelected === "jobs" ? "btn-primary" : "btn-ghost"
									}`}
									onClick={() => setTabSelected("jobs")}
								>
									Job Posts
								</div>
							</div>
							{/* content */}
							<div className="mt-10">
								<AnimatePresence mode="wait">
									{tabSelected === "about" && (
										<motion.div
											key={"about_tab"}
											variants={AnimTabTransition}
											initial="initial"
											animate="animate"
											exit="exit"
										>
											<p className="text-2xl font-bold mb-5">
												About this company
											</p>

											<div className="mt-3 shadow-lg p-5 rounded-btn">
												<p className="text-lg font-bold text-primary">
													Full Description
												</p>
												<div>
													<ReactMarkdown>
														{companyData.fullDescription}
													</ReactMarkdown>
												</div>
											</div>
											<div className="mt-3 shadow-lg p-5 rounded-btn">
												<p className="text-lg font-bold text-primary">
													Contact information
												</p>
												<div>
													<p className="flex justify-between">
														<span>Email</span>
														<span>{companyData.contactInformation.email}</span>
													</p>
													<p className="flex justify-between">
														<span>Phone</span>
														<span>{companyData.contactInformation.phone}</span>
													</p>
												</div>
											</div>
											<div className="mt-3 shadow-lg p-5 rounded-btn">
												<p className="text-lg font-bold text-primary">
													Industry
												</p>
												<p>{companyData.industryType}</p>
											</div>
											<div className="mt-3 shadow-lg p-5 rounded-btn">
												<p className="text-lg font-bold text-primary">
													Company Size
												</p>
												<p>{companyData.companySize} people</p>
											</div>
											<div className="mt-3 shadow-lg p-5 rounded-btn">
												<p className="text-lg font-bold text-primary">
													Founding Year
												</p>
												<p>{companyData.foundingYear} people</p>
											</div>
											<div className="mt-3 shadow-lg p-5 rounded-btn">
												<p className="text-lg font-bold text-primary">
													Location
												</p>
												<p>
													{companyData.address.address},{" "}
													{companyData.address.city}
												</p>
											</div>
										</motion.div>
									)}
									{tabSelected === "jobs" && (
										<motion.div
											key={"jobs_tab"}
											variants={AnimTabTransition}
											initial="initial"
											animate="animate"
											exit="exit"
										>
											{!allJobPosts.isSuccess && (
												<div className="flex justify-center items-center flex-col py-16">
													<Image
														alt=""
														priority
														src="/file-search.png"
														width={200}
														height={200}
													/>
													<div className="text-center flex flex-col items-center">
														<p className="font-bold text-xl">
															This User haven&apos;t posted anything
														</p>
													</div>
												</div>
											)}
											<div className="flex flex-col gap-2">
												{allJobPosts.isSuccess &&
													allJobPosts.data.map((job, index) => (
														<JobCard
															job={{
																...job,
																uploader: {
																	legalName: companyData.legalName,
																},
															}}
															key={`jobCard_${index}`}
														/>
													))}
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</div>
						<div className="col-span-full lg:col-span-2">
							<div className="divider col-span-full" />
							<div className="grid grid-cols-2 mt-5 font-light text-sm opacity-75">
								<div className="flex flex-col">
									<p className="font-bold text-lg">Features</p>
									<Link
										href="/util/features#blogging"
										className="link link-hover"
									>
										Mini Blogging
									</Link>
									<Link
										href="/util/features#companyhunting"
										className="link link-hover"
									>
										Geo-Company Hunting
									</Link>
									<Link
										href="/util/features#jobposting"
										className="link link-hover"
									>
										Job Posting
									</Link>
									<Link
										href="/util/features#metaverse"
										className="link link-hover"
									>
										Metaverse
									</Link>
								</div>
								<div>
									<p className="font-bold text-lg">Wicket Journeys</p>
									<p className="link link-hover">About Us</p>
									<p className="link link-hover">Contact Us</p>
									<p className="link link-hover">Terms of use</p>
									<p className="link link-hover">Privacy policy</p>
									<p className="link link-hover">Cookie policy</p>
								</div>
							</div>
						</div>
					</div>
				</motion.main>
			)}
		</>
	);
};

export default ProvisionerPage;
