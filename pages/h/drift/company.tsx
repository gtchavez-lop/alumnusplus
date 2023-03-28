import { GetServerSideProps, NextPage } from "next";
import { IUserHunter, IUserProvisioner, TProvJobPost } from "@/lib/types";
import { useEffect, useState } from "react";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import Image from "next/image";
import JobCard from "@/components/jobs/JobCard";
import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import Tabs from "@/components/Tabs";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQueries } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";

interface Job {
	id: string;
	job_title: string;
	job_location: string;
	short_description: string;
	created_at: string;
	job_type: string[];
	uploader: {
		legalName: string;
	};
}

const ProvisionerPage: NextPage = () => {
	const [tabSelected, setTabSelected] = useState("about");
	const [tabContents] = useAutoAnimate();
	const _currentUser = useStore($accountDetails) as IUserHunter;
	const [isFollowed, setIsFollowed] = useState(false);
	const router = useRouter();

	const fetchCompanyOpenJobs = async () => {
		const { id } = router.query as { id: string };
		const { data: jobs, error: jobs_error } = await supabase
			.from("public_jobs")
			.select("*,uploader:uploader_id(legalName)")
			.eq("uploader_id", id);

		if (jobs_error) {
			console.error(jobs_error);
			return [] as Job[];
		}

		return jobs as Job[];
	};

	const fetchCompanyData = async () => {
		const { id } = router.query as { id: string };
		const { data: company, error: company_error } = await supabase
			.from("user_provisioners")
			.select("*")
			.eq("id", id)
			.single();

		if (company_error) {
			console.error(company_error);
			return {} as IUserProvisioner;
		}

		return company as IUserProvisioner;
	};

	const [_companyData, _companyOpenJobs] = useQueries({
		queries: [
			{
				queryKey: ["companyData"],
				queryFn: fetchCompanyData,
				enabled: !!router.query.id,
				refetchOnWindowFocus: false,
			},
			{
				queryKey: ["companyOpenJobs"],
				queryFn: fetchCompanyOpenJobs,
				enabled: !!router.query.id,
				refetchOnWindowFocus: false,
			},
		],
	});

	const checkIfFollowed = () => {
		if (_companyData.isSuccess && _currentUser) {
			if (_currentUser.followedCompanies.includes(_companyData.data.id)) {
				setIsFollowed(true);
			}
		}
	};

	const handleFollowCompany = async () => {
		if (!_companyData.isSuccess) return;

		let h_newList = _currentUser.followedCompanies.concat(
			_companyData.data?.id,
		);
		let p_newList = [..._companyData.data?.followers, _currentUser.id];

		// update hunter
		const { error: h_error } = await supabase
			.from("user_hunters")
			.update({ followedCompanies: h_newList })
			.eq("id", _currentUser.id);

		// update provisioner
		const { error: p_error } = await supabase
			.from("user_provisioners")
			.update({ followers: p_newList })
			.eq("id", _companyData.data?.id);

		if (h_error || p_error) {
			console.log(h_error, p_error);
			toast.error("Failed to follow company");
			return;
		}

		toast.dismiss();
		toast.success("Followed company");
		setIsFollowed(true);
		_companyData.refetch();
	};

	const handleUnfollowCompany = async () => {
		if (!_companyData.isSuccess) return;

		let h_newList = _currentUser.followedCompanies.filter(
			(id) => id !== _companyData.data.id,
		);
		let p_newList = _companyData.data.followers.filter(
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
			.eq("id", _companyData.data.id);

		if (h_error || p_error) {
			console.log(h_error, p_error);
			toast.error("Failed to unfollow company");
			return;
		}

		toast.dismiss();
		toast.success("Unfollowed company");
		setIsFollowed(false);
		_companyData.refetch();
	};

	useEffect(() => {
		checkIfFollowed();
	});

	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				{!(_companyData.isLoading && _companyOpenJobs.isLoading) && (
					<div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
						<div className="col-span-full lg:col-span-3">
							{/* profile */}
							<div className="relative rounded-btn flex flex-col gap-3">
								<div className="absolute h-[250px] w-full">
									<div className="bg-gradient-to-t from-base-100 to-transparent w-full h-full absolute opacity-75" />
									<Image
										className="object-cover rounded-btn rounded-b-none object-center w-full h-full "
										src={`https://picsum.photos/seed/${
											_companyData.data?.legalName ?? Math.random() * 1000
										}/900/500`}
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
											_companyData.data?.avatar_url ||
											`https://api.dicebear.com/5.x/shapes/png?seed=${_companyData.data?.legalName}`
										}
										alt="profile"
										width={100}
										height={100}
										priority
									/>
									<div>
										<p className="text-xl leading-tight font-bold">
											{_companyData.data?.legalName}
										</p>
										<p className="text-sm">
											{_companyData.data?.followers.length} followers
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
							<Tabs
								tabs={[
									{ title: "About", value: "about" },
									{ title: "All Jobs", value: "jobs" },
								]}
								onTabChange={(tab) => setTabSelected(tab)}
								activeTab={tabSelected}
							/>
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
													{_companyData.data?.fullDescription ??
														"No description"}
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
													<span>
														{_companyData.data?.contactInformation.email}
													</span>
												</p>
												<p className="flex justify-between">
													<span>Phone</span>
													<span>
														{_companyData.data?.contactInformation.phone}
													</span>
												</p>
											</div>
										</div>
										<div className="mt-3 shadow-lg p-5 rounded-btn">
											<p className="text-lg font-bold text-primary">Industry</p>
											<p>{_companyData.data?.industryType}</p>
										</div>
										<div className="mt-3 shadow-lg p-5 rounded-btn">
											<p className="text-lg font-bold text-primary">
												Company Size
											</p>
											<p>{_companyData.data?.companySize} people</p>
										</div>
										<div className="mt-3 shadow-lg p-5 rounded-btn">
											<p className="text-lg font-bold text-primary">
												Founding Year
											</p>
											<p>{_companyData.data?.foundingYear}</p>
										</div>
										<div className="mt-3 shadow-lg p-5 rounded-btn">
											<p className="text-lg font-bold text-primary">Location</p>
											<p>
												{_companyData.data?.address.address},{" "}
												{_companyData.data?.address.city}
											</p>
										</div>
									</div>
								)}
								{tabSelected === "jobs" && (
									<div>
										{_companyOpenJobs.data?.length === 0 && (
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
											{_companyOpenJobs.data?.map((job, index) => (
												<JobCard job={job} key={`jobCard_${index}`} />
											))}
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
				)}
			</motion.main>

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
