import { GetServerSideProps, NextPage } from "next";

import { AnimPageTransition } from "@/lib/animations";
import { IUserHunter } from "@/lib/types";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useQueries } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";

const SearchPage = () => {
	const router = useRouter();

	const searchOnload = async () => {
		const { query } = router.query as { query: string };

		if (query !== undefined) {
			const { data, error } = await supabase
				.from("user_hunters")
				.select()
				.containedBy("full_name", ["gerald"]);

			if (error) {
				console.log(error);
				return [];
			}

			if (data) {
				return data as IUserHunter[];
			}
		}

		return [];
	};

	const [searchresults] = useQueries({
		queries: [
			{
				queryKey: ["searchresults"],
				queryFn: searchOnload,
				enabled: !!router.query,
			},
		],
	});

	return (
		searchresults.isSuccess && (
			<>
				<motion.main
					variants={AnimPageTransition}
					initial="initial"
					animate="animate"
					exit="exit"
					className="relative min-h-screen w-full pt-24 pb-36"
				>
					<p>{router.query.query}</p>
					{/* <p>{JSON.stringify(res_hunters, 0, 2)}</p> */}
				</motion.main>
			</>
		)
	);
};

export default SearchPage;
