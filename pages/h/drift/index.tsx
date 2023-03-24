import { useEffect, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { FiLoader } from "react-icons/fi";
import { GetServerSideProps } from "next";
import { IUserProvisioner } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import _PhLocation from "@/lib/ph_location.json";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useStore } from "@nanostores/react";

const DriftPage = () => {
	const _currentUser = useStore($accountDetails);

	const getUserCity = async () => {
		const request = await fetch(
			"https://geolocation-db.com/json/0f761a30-fe14-11e9-b59f-e53803842572",
		);

		const response = await request.json();
		return response;
	};

	const currentLocation = useQuery({
		queryKey: ["currentLocation"],
		queryFn: getUserCity,

		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});

	const fetchData = async () => {
		const { data, error } = await supabase
			.from("user_provisioners")
			.select("*")
			.eq("address->>city", currentLocation.data?.city);

		if (error) {
			console.log(error);
			return [];
		}

		return data;
	};

	const usersInCity = useQuery({
		queryKey: ["usersInCity"],
		queryFn: fetchData,
		enabled: currentLocation.isSuccess,

		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});

	const fetchDriftData = async () => {
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

	const [driftData] = useQueries({
		queries: [
			{
				queryKey: ["driftData"],
				enabled: !!_currentUser as boolean,
				queryFn: fetchDriftData,
				refetchOnMount: true,
			},
		],
	});

	return (
		<>
			{driftData.isLoading ? (
				<motion.main
					variants={AnimPageTransition}
					initial="initial"
					animate="animate"
					exit="exit"
					className="relative min-h-screen w-full pt-24 pb-36"
				>
					<h1 className="text-2xl lg:text-3xl mb-10 font-bold text-center">
						Companies near your area
					</h1>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
						{Array(9)
							.fill(0)
							.map((_, index) => (
								<div
									key={`company-skeleton-${index}`}
									className="p-3 bg-base-300 rounded-btn h-[224px]"
								>
									<div className="flex flex-col items-center gap-2 cursor-pointer">
										<div className="w-[100px] h-[100px] bg-base-100 rounded-full animate-pulse" />
										<div className="w-[100px] h-[24px] bg-base-100 animate-pulse delay-75" />
										<div className="w-full rounded-btn h-[48px] mt-4 bg-base-100 animate-pulse delay-150" />
									</div>
								</div>
							))}
					</div>
				</motion.main>
			) : (
				<motion.main
					variants={AnimPageTransition}
					initial="initial"
					animate="animate"
					exit="exit"
					className="relative min-h-screen w-full pt-24 pb-36"
				>
					<h1 className="text-2xl lg:text-3xl mb-10 font-bold text-center">
						Companies near your area
					</h1>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
						{usersInCity.isFetched &&
							usersInCity.data?.map((item, index) => (
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
					</div>
				</motion.main>
			)}
		</>
	);
};

export default DriftPage;
