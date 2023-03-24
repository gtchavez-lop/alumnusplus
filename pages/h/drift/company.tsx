import { GetServerSideProps, NextPage } from "next";
import { IUserHunter, IUserProvisioner, TProvJobPost } from "@/lib/types";
import { useEffect, useState } from "react";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import Image from "next/image";
import JobCard from "@/components/jobs/JobCard";
import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { id } = context.query as { id: string };

	const { data: company, error: company_error } = await supabase
		.from("user_provisioners")
		.select("*")
		.eq("id", id)
		.single();

	const { data: jobs, error: jobs_error } = await supabase
		.from("public_jobs")
		.select("*,uploader:uploader_id(legalName)")
		.eq("uploader_id", id);

	if (company_error || jobs_error) {
		console.error(company_error, jobs_error);
		return {
			props: {
				companyData: null,
				jobs: null,
			},
		};
	}

	return {
		props: {
			companyData: company as IUserProvisioner,
			jobs: jobs as TProvJobPost[],
		},
	};
};

const ProvisionerPage: NextPage<{
	companyData: IUserProvisioner;
	jobs: TProvJobPost[];
}> = ({ companyData, jobs }) => {
	const [tabSelected, setTabSelected] = useState<"about" | "jobs">("about");
	const [tabContents] = useAutoAnimate();
	const _currentUser = useStore($accountDetails) as IUserHunter;
	const [isFollowed, setIsFollowed] = useState(false);
	const router = useRouter();

	const handleFollowCompany = async () => {
		toast.loading("Following company...");
		let h_newList = _currentUser.followedCompanies.concat(companyData.id);
		let p_newList = [...companyData.followers, _currentUser.id];

		// update hunter
		const { error: h_error } = await supabase
			.from("user_hunters")
			.update({ followedCompanies: h_newList })
			.eq("id", _currentUser.id);

		// update provisioner
		const { error: p_error } = await supabase
			.from("user_provisioners")
			.update({ followers: p_newList })
			.eq("id", companyData.id);

		if (h_error || p_error) {
			console.log(h_error, p_error);
			toast.error("Failed to follow company");
			return;
		}

		toast.dismiss();
		toast.success("Followed company");
		router.reload();
	};

	const handleUnfollowCompany = async () => {
		toast.loading("Unfollowing company...");
		let h_newList = _currentUser.followedCompanies.filter(
			(id) => id !== companyData.id,
		);
		let p_newList = companyData.followers.filter(
			(id) => id !== _currentUser.id,
		);

		// update hunter
		const { error: h_error } = await supabase
			.from("user_hunters")
			.update({ followedCompanies: h_newList })
			.eq("id", _currentUser.id);

		// update provisioner
		const { error: p_error } = await supabase
			.from("user_provisioners")
			.update({ followers: p_newList })
			.eq("id", companyData.id);

		if (h_error || p_error) {
			console.log(h_error, p_error);
			toast.error("Failed to unfollow company");
			return;
		}

		toast.dismiss();
		toast.success("Unfollowed company");
		router.reload();
	};

	const checkIfFollowed = () => {
		if (companyData && _currentUser) {
			if (_currentUser.followedCompanies.includes(companyData.id)) {
				setIsFollowed(true);
			}
		}
	};

	useEffect(() => {
		checkIfFollowed();
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
										src={
											companyData.avatar_url ||
											`https://api.dicebear.com/5.x/shapes/png?seed=${companyData.legalName}`
										}
										alt="profile"
										width={100}
										height={100}
										priority
									/>
									<div>
										<p className="text-xl leading-tight font-bold">
											{companyData.legalName}
										</p>
										<p className="text-sm">
											{companyData.followers.length} followers
										</p>
									</div>
								</div>
								{!isFollowed ? (
									<button
										onClick={handleFollowCompany}
										className="btn btn-primary ml-auto"
									>
										Follow
									</button>
								) : (
									<label
										htmlFor="unfollowmodal"
										className="btn btn-warning ml-auto"
									>
										Unfollow
									</label>
								)}
							</div>
							<div className="divider bg-base-content h-[5px] rounded-full opacity-20 my-10" />
							{/* tabs */}
							<div className="tabs tabs-boxed justify-center lg:justify-start gap-2">
								<div
									className={`tab tab-lg lg:tab-md ${
										tabSelected === "about" ? "tab-active" : ""
									}`}
									onClick={() => setTabSelected("about")}
								>
									About
								</div>
								<div
									className={`tab tab-lg lg:tab-md ${
										tabSelected === "jobs" ? "tab-active" : ""
									}`}
									onClick={() => setTabSelected("jobs")}
								>
									Job Posts
								</div>
							</div>
							{/* content */}
							<div className="mt-10 overflow-hidden" ref={tabContents}>
								{tabSelected === "about" && (
									<div>
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
											<p className="text-lg font-bold text-primary">Industry</p>
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
											<p className="text-lg font-bold text-primary">Location</p>
											<p>
												{companyData.address.address},{" "}
												{companyData.address.city}
											</p>
										</div>
									</div>
								)}
								{tabSelected === "jobs" && (
									<div>
										{jobs.length === 0 && (
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
											{jobs.map((job, index) => (
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

											{jobs.length === 0 && (
												<div className="flex justify-center items-center flex-col py-16">
													<Image
														alt=""
														priority
														src="/file-search.png"
														width={200}
														height={200}
													/>
													<p>No job posts found for this company</p>
												</div>
											)}
										</div>
									</div>
								)}
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

			{/* unfollow warning modal */}
			<input
				type="checkbox"
				className="modal-toggle"
				name="unfollowmodal"
				id="unfollowmodal"
			/>
			<label htmlFor="unfollowmodal" className="modal">
				<label htmlFor="" className="modal-box">
					<h3 className="text-lg font-bold">
						Do you want to unfollow this company?
					</h3>
					<p>You will no longer receive updates from this company.</p>

					<div className="mt-10 flex justify-end gap-2">
						<label
							htmlFor="unfollowmodal"
							onClick={handleUnfollowCompany}
							className="btn btn-error"
						>
							Unfollow
						</label>
						<label className="btn" htmlFor="unfollowmodal">
							Cancel
						</label>
					</div>
				</label>
			</label>
		</>
	);
};

export default ProvisionerPage;
