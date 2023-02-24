import { useEffect, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";

import { AnimPageTransition } from "@/lib/animations";
import { FiLoader } from "react-icons/fi";
import { GetServerSideProps } from "next";
import { IUserProvisioner } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const DriftPage = () => {
	const fetchDriftData = async () => {
		const { data, error } = await supabase
			.from("user_provisioners")
			.select("*")
			.limit(9);

		if (error) {
			toast.error(error.message);
		}

		return data;
	};

	const driftData = useQuery({
		queryKey: ["drift-data"],
		queryFn: fetchDriftData,
		refetchOnMount: false,
	});

	// const [driftData] = useQueries({
	//   queries: [
	//     {
	//       queryKey: ["drift-data"],
	//       queryFn: async () => {
	//         const { data, error } = await supabase
	//           .from("user_provisioners")
	//           .select("*")
	//           .limit(9);

	//         if (error) {
	//           toast.error(error.message);
	//         }

	//         return data;
	//       },
	//     },
	//   ],
	// });

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
				<motion.main className="relative min-h-screen w-full pt-24 pb-36">
					<h1 className="text-2xl lg:text-3xl mb-10 font-bold text-center">
						Companies near your area
					</h1>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
						{driftData.data!.map((company, index) => (
							<Link
								key={`company-${index}`}
								href={`/p/${company.id}`}
								passHref
								className="p-3 bg-base-300 rounded-btn h-[224px]"
							>
								<div className="flex flex-col items-center gap-2 cursor-pointer">
									<img
										alt=""
										src={`https://avatars.dicebear.com/api/bottts/${company.legalName}.svg`}
										className="rounded-full w-[100px] h-[100px]"
									/>
									<p>{company.legalName}</p>
								</div>

								<div className="btn btn-primary btn-block mt-5">See more</div>
							</Link>
						))}
					</div>
				</motion.main>
			)}
		</>
	);
};

export default DriftPage;
