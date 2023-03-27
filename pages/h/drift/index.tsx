import { useEffect, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { IUserProvisioner } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { NextPage } from "next";
import Tabs from "@/components/Tabs";
import _PhLocation from "@/lib/ph_location.json";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useStore } from "@nanostores/react";

type TTabs = {
	title: string;
	value: string;
};

const _tabs: TTabs[] = [
	{
		title: "Nearby",
		value: "nearby",
	},
	{
		title: "All Companies",
		value: "all",
	},
];

const DriftPage: NextPage = () => {
	const [activeTab, setActiveTab] = useState<"nearby" | "all">("nearby");
	const [tabContentRef] = useAutoAnimate<HTMLDivElement>();
	const _currentUser = useStore($accountDetails);

	const getLocation = async () => {
		const location = await fetch(
			"https://api.bigdatacloud.net/data/reverse-geocode-client",
		);
		const locationData = await location.json();

		if (locationData) {
			return {
				city: locationData.city,
				latitude: locationData.latitude,
				longitude: locationData.longitude,
			};
		} else {
			return {
				city: "Caloocan City",
				latitude: 14.6572,
				longitude: 120.9822,
			};
		}
	};

	const currentLocation = useQuery({
		queryKey: ["currentLocation"],
		queryFn: getLocation,

		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});

	const fetchCompanyInLocation = async () => {
		if (!currentLocation.data) return [];

		const { data, error } = await supabase
			.from("user_provisioners")
			.select("*")
			.ilike("address->>city", `%${currentLocation.data?.city}%`);

		if (error) {
			console.log(error);
			return [];
		}

		return data;
	};

	const fetchAllCompanies = async () => {
		const { data, error } = await supabase
			.from("user_provisioners")
			.select("*")
			.limit(16);

		if (error) {
			toast.error(error.message);
			return [];
		}

		return data as IUserProvisioner[];
	};

	const [allCompanies, companyInLocation] = useQueries({
		queries: [
			{
				queryKey: ["driftData"],
				enabled: !!_currentUser as boolean,
				queryFn: fetchAllCompanies,
				refetchOnMount: true,
			},
			{
				queryKey: ["companiesInCity"],
				queryFn: fetchCompanyInLocation,
				enabled: currentLocation.isSuccess,

				refetchOnWindowFocus: false,
				refetchOnMount: true,
			},
		],
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
				<p className="text-3xl mb-2">
					Companies in{" "}
					{currentLocation.isLoading
						? "Location"
						: currentLocation.data?.city || "Caloocan City"}
				</p>

				<Tabs
					tabs={_tabs}
					activeTab={activeTab}
					onTabChange={(e) => setActiveTab(e as "all" | "nearby")}
				/>

				<div
					ref={tabContentRef}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full"
				>
					{activeTab === "nearby" && (
						<>
							{companyInLocation.isLoading &&
								Array(3)
									.fill(0)
									.map((_, index) => (
										<div
											key={`company-skeleton-${index}`}
											className="p-3 bg-slate-500/50 animate-pulse rounded-btn h-[224px]"
										/>
									))}

							{companyInLocation.isSuccess &&
								!companyInLocation.isLoading &&
								companyInLocation.data?.length > 0 &&
								companyInLocation.data?.map((item, index) => (
									<Link
										key={`company-${index}`}
										href={`/h/drift/company?id=${item.id}`}
										passHref
										className="p-3 hover:border-opacity-0 hover:bg-primary hover:text-primary-content border-2 border-primary transition border-opacity-50 rounded-btn flex flex-col justify-center h-[224px]"
									>
										<div className="flex flex-col items-center gap-2 cursor-pointer">
											<Image
												alt=""
												src={
													item.avatar_url ||
													`https://api.dicebear.com/5.x/shapes/png?backgroundType=solid&backgroundColor=C7485F&seed=${item.legalName}`
												}
												className="mask mask-squircle w-[100px] h-[100px]"
												width={100}
												height={100}
											/>
											<p>{item.legalName}</p>
										</div>
									</Link>
								))}

							{companyInLocation.isSuccess &&
								!companyInLocation.isLoading &&
								companyInLocation.data?.length === 0 && (
									<div className="col-span-full py-5">
										<p className="alert alert-info">
											No companies found in your area
										</p>
									</div>
								)}
						</>
					)}
					{activeTab === "all" && (
						<>
							{allCompanies.isLoading &&
								Array(3)
									.fill(0)
									.map((_, index) => (
										<div
											key={`company-skeleton-${index}`}
											className="p-3 bg-slate-500/50 animate-pulse rounded-btn h-[224px]"
										/>
									))}

							{allCompanies.isSuccess &&
								!allCompanies.isLoading &&
								allCompanies.data?.length > 0 &&
								allCompanies.data?.map((item, index) => (
									<Link
										key={`company-${index}`}
										href={`/h/drift/company?id=${item.id}`}
										passHref
										className="p-3 hover:border-opacity-0 hover:bg-primary hover:text-primary-content border-2 border-primary transition border-opacity-50 rounded-btn flex flex-col justify-center h-[224px]"
									>
										<div className="flex flex-col items-center gap-2 cursor-pointer">
											<Image
												alt=""
												src={
													item.avatar_url ||
													`https://api.dicebear.com/5.x/shapes/png?backgroundType=solid&backgroundColor=C7485F&seed=${item.legalName}`
												}
												className="mask mask-squircle w-[100px] h-[100px]"
												width={100}
												height={100}
											/>
											<p>{item.legalName}</p>
										</div>
									</Link>
								))}

							{allCompanies.isSuccess &&
								!allCompanies.isLoading &&
								allCompanies.data?.length === 0 && (
									<div className="col-span-full py-5">
										<p className="alert alert-info">No companies found</p>
									</div>
								)}
						</>
					)}
				</div>
			</motion.main>
		</>
	);
};

// {allCompanies.isLoading || companyInLocation.isLoading ? (
// 	<motion.main
// 		variants={AnimPageTransition}
// 		initial="initial"
// 		animate="animate"
// 		exit="exit"
// 		className="relative min-h-screen w-full pt-24 pb-36"
// 	>
// 		<h1 className="text-2xl lg:text-3xl mb-10 font-bold text-center">
// 			Companies near your area
// 		</h1>

// 		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
// 		</div>
// 	</motion.main>
// ) : (
// )}
export default DriftPage;
