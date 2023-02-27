import {
	ChangeEvent,
	DOMAttributes,
	FormEvent,
	SyntheticEvent,
	useState,
} from "react";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import Fuse from "fuse.js";
import { IUserProvisioner } from "@/lib/types";
import { NextPage } from "next";
import _Industries from "@/lib/industryTypes.json";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";

const ProvisionerProfileEditPage: NextPage = () => {
	const router = useRouter();
	const _currentUser = useStore($accountDetails) as IUserProvisioner;
	const [tempUserDetails, setTempUserDetails] =
		useState<IUserProvisioner>(_currentUser);
	const [industryTypeSearchResults, setIndustryTypeSearchResults] = useState<
		string[]
	>([]);
	const f_industryType = new Fuse(_Industries, {
		threshold: 0.3,
	});

	const handleChanges = async () => {
		// check if there are no changes, toast and return
		if (JSON.stringify(_currentUser) === JSON.stringify(tempUserDetails)) {
			toast.error("No changes made");
			return;
		}

		// check if all required fields are filled
		if (
			!(
				tempUserDetails.legalName &&
				tempUserDetails.companyEmail &&
				tempUserDetails.foundingYear &&
				tempUserDetails.industryType &&
				tempUserDetails.shortDescription &&
				tempUserDetails.fullDescription
			)
		) {
			toast.error("Please fill all required fields");
			return;
		}

		// check if email is valid
		if (!tempUserDetails.companyEmail.includes("@")) {
			toast.error("Please enter a valid email");
			return;
		}

		// check if founding year is valid
		if (tempUserDetails.foundingYear > dayjs().year()) {
			toast.error("Please enter a valid founding year");
			return;
		}

		// update user details
		const { error } = await supabase
			.from("user_provisioners")
			.update(tempUserDetails)
			.eq("id", _currentUser.id);

		if (error) {
			toast.error(error.message);
			return;
		}

		// update global state
		$accountDetails.set(tempUserDetails);
		toast.success("Changes saved successfully");
		router.push("/p/me");
	};

	return (
		<>
			{_currentUser && tempUserDetails && (
				<motion.main
					variants={AnimPageTransition}
					initial="initial"
					animate="animate"
					exit="exit"
					className="relative min-h-screen w-full pt-24 pb-36"
				>
					<p className="text-4xl font-bold">Edit Your Profile</p>
					<div className="flex justify-end items-center mt-5 gap-2">
						<div onClick={handleChanges} className="btn btn-success">
							Save Changes
						</div>
						<div className="btn btn-ghost">Discard and Go Back</div>
					</div>

					{/* content */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
						{/* account information */}
						<div className="flex flex-col gap-3 bg-base-200 p-5 rounded-btn h-max">
							<p className="text-xl font-bold">Account Information</p>
							<label className="flex flex-col gap-3">
								<span>Profile Picture</span>
								<img
									src={`https://avatars.dicebear.com/api/bottts/${_currentUser.legalName}.svg`}
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
									value={tempUserDetails.contactInformation.email}
									type="email"
									readOnly
									disabled
								/>
							</label>
						</div>

						{/* company details */}
						<div className="flex flex-col gap-3 bg-base-200 p-5 rounded-btn h-max">
							<p className="text-xl font-bold">Company Details</p>

							<label className="flex flex-col">
								<span>Company Name</span>
								<input
									className="input input-primary"
									value={tempUserDetails.legalName}
									type="text"
									onChange={(e) => {
										setTempUserDetails({
											...tempUserDetails,
											legalName: e.target.value,
										});
									}}
								/>
							</label>
							<label className="flex flex-col">
								<span>Company Email</span>
								<input
									className="input input-primary"
									value={tempUserDetails.companyEmail}
									type="email"
									onChange={(e) => {
										setTempUserDetails({
											...tempUserDetails,
											companyEmail: e.target.value,
										});
									}}
								/>
							</label>
							<label className="flex flex-col">
								<span>Founding Year</span>
								<input
									className="input input-primary"
									value={tempUserDetails.foundingYear}
									type="number"
									max={dayjs().year()}
									onChange={(e) => {
										setTempUserDetails({
											...tempUserDetails,
											companyEmail: e.target.value,
										});
									}}
								/>
							</label>
							<label className="flex flex-col">
								<span>Industry Type</span>
								<input
									className="input input-primary"
									value={tempUserDetails.industryType}
									type="text"
									onChange={(e) => {
										setTempUserDetails({
											...tempUserDetails,
											industryType: e.target.value,
										});
										let res = f_industryType.search(e.target.value);
										let mappedRes = res.map((r) => r.item);
										let limited = mappedRes.slice(0, 5);
										setIndustryTypeSearchResults(limited);
									}}
								/>
								{industryTypeSearchResults.length > 0 && (
									<div className="flex flex-col gap-2 mt-4 bg-base-300 p-5 rounded-btn">
										{industryTypeSearchResults.map((res, index) => (
											<div
												key={`industryTypeSearchResults-${index}`}
												onClick={() => {
													setTempUserDetails({
														...tempUserDetails,
														industryType: res,
													});
													setIndustryTypeSearchResults([]);
												}}
												className="btn btn-ghost btn-block justify-start"
											>
												{res}
											</div>
										))}
									</div>
								)}
							</label>
							<label className="flex flex-col">
								<span>Search Tags (Optional)</span>
								<input
									className="input input-primary"
									type="text"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											setTempUserDetails({
												...tempUserDetails,
												tags: [...tempUserDetails.tags, e.currentTarget.value],
											});
											e.currentTarget.value = "";
										}
									}}
								/>
								{tempUserDetails.tags.length > 0 && (
									<p className="flex flex-wrap gap-2 mt-3">
										{tempUserDetails.tags.map((tag, index) => (
											<span
												key={`tag-${index}`}
												onClick={() => {
													setTempUserDetails({
														...tempUserDetails,
														tags: tempUserDetails.tags.filter((t) => t !== tag),
													});
												}}
												className="badge badge-primary"
											>
												{tag}
											</span>
										))}
									</p>
								)}
							</label>
							<label className="flex flex-col">
								<span>Short Description</span>
								<textarea
									className="textarea textarea-primary"
									rows={3}
									value={tempUserDetails.shortDescription}
									onChange={(e) => {
										setTempUserDetails({
											...tempUserDetails,
											shortDescription: e.target.value,
										});
									}}
								/>
							</label>
							<label className="flex flex-col">
								<span>Full Description</span>
								<textarea
									className="textarea textarea-primary"
									rows={5}
									value={tempUserDetails.fullDescription}
									onChange={(e) => {
										setTempUserDetails({
											...tempUserDetails,
											fullDescription: e.target.value,
										});
									}}
								/>
							</label>
						</div>

						{/* Social profiles */}
						<div className="flex flex-col gap-3 bg-base-200 p-5 rounded-btn h-max">
							<p className="text-xl font-bold">Social Profiles (Optional)</p>

							<label className="flex flex-col">
								<span>Website</span>
								<input
									className="input input-primary"
									value={tempUserDetails.website}
									type="text"
									onChange={(e) => {
										setTempUserDetails({
											...tempUserDetails,
											website: e.target.value,
										});
									}}
								/>
							</label>
							<label className="flex flex-col">
								<span>Facebook</span>
								<input
									className="input input-primary"
									value={tempUserDetails.socialProfiles.facebook}
									type="text"
									onChange={(e) => {
										setTempUserDetails({
											...tempUserDetails,
											socialProfiles: {
												...tempUserDetails.socialProfiles,
												facebook: e.target.value,
											},
										});
									}}
								/>
							</label>
							<label className="flex flex-col">
								<span>Twitter</span>
								<input
									className="input input-primary"
									value={tempUserDetails.socialProfiles.twitter}
									type="text"
									onChange={(e) => {
										setTempUserDetails({
											...tempUserDetails,
											socialProfiles: {
												...tempUserDetails.socialProfiles,
												twitter: e.target.value,
											},
										});
									}}
								/>
							</label>
							<label className="flex flex-col">
								<span>Instagram</span>
								<input
									className="input input-primary"
									value={tempUserDetails.socialProfiles.instagram}
									type="text"
									onChange={(e) => {
										setTempUserDetails({
											...tempUserDetails,
											socialProfiles: {
												...tempUserDetails.socialProfiles,
												instagram: e.target.value,
											},
										});
									}}
								/>
							</label>
							<label className="flex flex-col">
								<span>LinkedIn</span>
								<input
									className="input input-primary"
									value={tempUserDetails.socialProfiles.linkedin}
									type="text"
									onChange={(e) => {
										setTempUserDetails({
											...tempUserDetails,
											socialProfiles: {
												...tempUserDetails.socialProfiles,
												linkedin: e.target.value,
											},
										});
									}}
								/>
							</label>
							<label className="flex flex-col">
								<span>Youtube</span>
								<input
									className="input input-primary"
									value={tempUserDetails.socialProfiles.youtube}
									type="text"
									onChange={(e) => {
										setTempUserDetails({
											...tempUserDetails,
											socialProfiles: {
												...tempUserDetails.socialProfiles,
												youtube: e.target.value,
											},
										});
									}}
								/>
							</label>
							<label className="flex flex-col">
								<span>Github</span>
								<input
									className="input input-primary"
									value={tempUserDetails.socialProfiles.github}
									type="text"
									onChange={(e) => {
										setTempUserDetails({
											...tempUserDetails,
											socialProfiles: {
												...tempUserDetails.socialProfiles,
												github: e.target.value,
											},
										});
									}}
								/>
							</label>
						</div>
					</div>
				</motion.main>
			)}
		</>
	);
};

export default ProvisionerProfileEditPage;
