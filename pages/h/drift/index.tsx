import { FormEvent, Fragment, useEffect, useState } from "react";
import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { IUserProvisioner } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { MdSearch } from "react-icons/md";
import { NextPage } from "next";
import Tabs from "@/components/Tabs";
import _PhLocation from "@/lib/ph_location.json";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useStore } from "@nanostores/react";

interface Location {
	longitude: number;
	latitude: number;
	city?: string;
}

type Distance = {
	lat1: number;
	lon1: number;
	lat2: number;
	lon2: number;
};
type GeoCodeResult = {
	lat: number;
	lng: number;
	city: string;
};
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

function deg2rad(deg: number): number {
	return deg * (Math.PI / 180);
}

const getDistance = ({ lat1, lon1, lat2, lon2 }: Distance) => {
	const R = 6371; // Radius of the earth in km
	const dLat = deg2rad(lat2 - lat1); // deg2rad below
	const dLon = deg2rad(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) *
			Math.cos(deg2rad(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c; // Distance in km
	return d;
};

const reverseGeocode = async (location: Location) => {
	const closestLocation: GeoCodeResult[] = [];
	const closestDistance: number | null = null;

	for (const loc of _PhLocation) {
		const distance = getDistance({
			lat1: location.latitude,
			lon1: location.longitude,
			lat2: parseFloat(loc.lat) - 0.1224928,
			lon2: parseFloat(loc.lng) - 0.045524,
		});

		if (closestDistance === null || distance < closestDistance) {
			if (distance <= 25) {
				if (loc.capital === "admin" || loc.capital === "primary") {
					closestLocation.push({
						lat: parseFloat(loc.lat) - 0.0824928,
						lng: parseFloat(loc.lng) - 0.045524,
						city: loc.city,
					});
				}
			}
		}
	}

	return closestLocation;
};

const DriftPage: NextPage = () => {
	const [activeTab, setActiveTab] = useState<"nearby" | "all">("nearby");
	const [tabContentRef] = useAutoAnimate<HTMLDivElement>();
	const _currentUser = useStore($accountDetails);
	const [searchResults, setSearchResults] = useState<IUserProvisioner[]>([]);
	const [userLocation, setUserLocation] = useState<GeoCodeResult[] | null>(
		null,
	);
	const [allResultsPage, setAllResultsPage] = useState(1);

	const getUserLocation = async () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				console.clear();

				// increase accuracy
				const location = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				};

				reverseGeocode(location).then((res) => {
					console.log(res);
					setUserLocation(res);
				});
			});
		}
	};

	const getNearbyJobs = async () => {
		if (userLocation !== null) {
			const { data, error } = await supabase
				.from("user_provisioners")
				.select()
				.in(
					"address->>city",
					userLocation.map((loc) => loc.city),
				)
				.limit(10);

			if (error) {
				toast.error(error.message);
				return [];
			}

			return data;
		}

		return [];
	};

	const getAllJobs = async ({ pageParam = 0 }) => {
		const { data, error } = await supabase
			.from("user_provisioners")
			.select()
			.range(pageParam * 6, (pageParam + 1) * 6 - 1);

		if (error) {
			toast.error(error.message);
			return [];
		}

		return data;
	};

	const [nearbyResults] = useQueries({
		queries: [
			{
				queryKey: ["h.drift.nearby_jobs"],
				queryFn: getNearbyJobs,
				refetchOnWindowFocus: false,
				refetchOnMount: false,
				enabled: userLocation !== null && !!_currentUser,
			},
		],
	});
	const allCompanies = useInfiniteQuery({
		queryKey: ["h.drift.all_companies"],
		queryFn: getAllJobs,
		refetchOnWindowFocus: false,
		enabled: !!_currentUser,
		getNextPageParam: (lastPage, pages) => {
			if (lastPage.length < 6) return false;
			return pages.length + 1;
		},
	});

	const handleSearchCompany = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const searchquery = e.currentTarget.searchquery as HTMLInputElement;
		console.log("searching for", searchquery.value);

		const { data, error } = await supabase
			.from("user_provisioners")
			.select()
			.ilike("legalName", `%${searchquery.value}%`)
			.limit(10);

		if (error) {
			toast.error(error.message);
			console.log(error);
			setSearchResults([]);
			return;
		}

		console.log(data);
		setSearchResults(data);
	};

	useEffect(() => {
		getUserLocation();
	}, []);

	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				{/* desktop tabs */}
				<Tabs
					tabs={_tabs}
					activeTab={activeTab}
					onTabChange={(e) => setActiveTab(e as "all" | "nearby")}
				/>
				{/* mobile select */}
				<select
					className="select select-primary w-full mb-5 lg:hidden"
					value={activeTab}
					onChange={(e) => setActiveTab(e.target.value as "all" | "nearby")}
				>
					{_tabs.map((tab, index) => (
						<option key={`tab-${index}`} value={tab.value}>
							{tab.title}
						</option>
					))}
				</select>

				<div
					ref={tabContentRef}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full"
				>
					{activeTab === "nearby" && (
						<>
							{nearbyResults.isLoading &&
								Array(3)
									.fill(0)
									.map((_, index) => (
										<div
											key={`company-skeleton-${index}`}
											className="p-3 bg-slate-500/50 animate-pulse rounded-btn h-[224px]"
										/>
									))}

							{nearbyResults.isSuccess && nearbyResults.data?.length === 0 && (
								<div className="col-span-full py-5">
									<p className="alert alert-info">
										No companies found in your area
									</p>
								</div>
							)}

							{nearbyResults.isSuccess &&
								nearbyResults.data?.map((item, index) => (
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
											<p className="truncate overflow-ellipsis max-w-full">
												{item.legalName}
											</p>
										</div>
									</Link>
								))}
						</>
					)}
					{activeTab === "all" && (
						<>
							<form
								onSubmit={handleSearchCompany}
								className="col-span-full flex justify-center"
							>
								<div className="form-control w-full max-w-md">
									<div className="input-group w-full">
										<input
											type="text"
											placeholder="Search for a company"
											onChange={(e) => {
												if (!e.currentTarget.value) {
													setSearchResults([]);
												}
											}}
											name="searchquery"
											className="input input-primary input-bordered w-full"
										/>
										<button
											type="submit"
											className="btn btn-primary btn-square"
										>
											<MdSearch className="text-lg" />
										</button>
									</div>
								</div>
							</form>

							{/* not searching results */}
							{searchResults.length === 0 && (
								<>
									{allCompanies.isFetched &&
										allCompanies.data?.pages.map((p, i) => (
											<Fragment key={`allcompany_page_${i + 1}`}>
												{p.map((c, j) => (
													<Link
														key={`company-${j}`}
														href={`/h/drift/company?id=${c.id}`}
														passHref
														className="p-3 hover:border-opacity-0 hover:bg-primary hover:text-primary-content border-2 border-primary transition border-opacity-50 rounded-btn flex flex-col justify-center h-[224px]"
													>
														<div className="flex flex-col items-center gap-2 cursor-pointer">
															<Image
																alt=""
																src={
																	c.avatar_url ||
																	`https://api.dicebear.com/5.x/shapes/png?backgroundType=solid&backgroundColor=C7485F&seed=${c.legalName}`
																}
																className="mask mask-squircle w-[100px] h-[100px]"
																width={100}
																height={100}
															/>
															<p>{c.legalName}</p>
														</div>
													</Link>
												))}
											</Fragment>
										))}

									{allCompanies.isFetching &&
										Array(6)
											.fill(0)
											.map((_, index) => (
												<div
													key={`company-skeleton-${index}`}
													className="p-3 bg-slate-500/50 animate-pulse rounded-btn h-[224px]"
												/>
											))}

									{/* load more */}
									{allCompanies.hasNextPage && (
										<div className="col-span-full flex justify-center">
											<button
												onClick={() => allCompanies.fetchNextPage()}
												className="btn btn-primary btn-block"
											>
												Load more
											</button>
										</div>
									)}
								</>
							)}

							{/* searching results */}
							<>
								{searchResults.length > 0 &&
									searchResults.map((item, index) => (
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
							</>
						</>
					)}
				</div>
			</motion.main>
		</>
	);
};

export default DriftPage;
