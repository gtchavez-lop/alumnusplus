import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { IUserHunter } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { MdSearch } from "react-icons/md";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useQueries } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";

const SearchPage = () => {
	const router = useRouter();
	const _currentUser = useStore($accountDetails) as IUserHunter;

	const searchOnload = async () => {
		const { query } = router.query as { query: string };
		const pattern = `%${query}%`;

		const supabasequery = supabase
			.from("user_hunters")
			.select("id,username,full_name,email,avatar_url");

		const { data, error } = await supabasequery.ilike(
			"full_name->>first,full_name->>last,full_name->>middle,email,username",
			pattern,
		);

		if (error) {
			console.log(error);
			return [];
		}

		if (data) {
			return data as IUserHunter[];
		}
	};

	const [searchresults] = useQueries({
		queries: [
			{
				queryKey: ["searchresults"],
				queryFn: searchOnload,
				enabled: router.query.query !== undefined,
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
					<form
						onSubmit={(e) => {
							e.preventDefault();
							const formData = new FormData(e.currentTarget);

							const searchQuery = formData.get("searchQuery");

							if (!searchQuery) {
								toast.error("Search query is required");
							}

							router.query.query = searchQuery as string;
						}}
						className="mb-5 flex gap-2 items-center"
					>
						<input
							disabled
							type="text"
							className="input input-primary w-full items-center"
							name="searchQuery"
							placeholder="In-page search feautre is not yet available"
						/>
						<button
							disabled
							className="btn btn-primary gap-2 items-center hidden md:inline-flex"
						>
							<MdSearch className="text-lg" />
							Search
						</button>
					</form>

					<p className="text-3xl">
						Search results for &apos;
						<span className="font-bold">{router.query.query}</span>&apos;
					</p>

					{searchresults?.data!.length > 0 ? (
						<div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
							{searchresults.data?.map((hunter, index) => (
								<Link
									key={`hunter-${index}`}
									href={
										hunter.username === _currentUser?.username
											? "/h/me"
											: `/h/${hunter.username}`
									}
									passHref
									className="p-3 hover:border-opacity-0 group hover:bg-primary hover:text-primary-content border-2 border-primary transition border-opacity-50 rounded-btn flex flex-col justify-center h-[224px]"
								>
									<div className="flex flex-col items-center gap-2 cursor-pointer">
										<Image
											alt=""
											src={hunter.avatar_url}
											className="mask mask-squircle w-[100px] h-[100px]"
											width={100}
											height={100}
										/>
										<p className="leading-none">
											{hunter.full_name.first} {hunter.full_name.last}
										</p>
										<p className="leading-none text-sm text-primary group-hover:text-primary-content transition">
											@{hunter.username}
										</p>
									</div>

									<div className="btn btn-primary lg:hidden btn-block mt-5">
										See more
									</div>
								</Link>
							))}
						</div>
					) : (
						<p className="mt-4">No results found</p>
					)}
				</motion.main>
			</>
		)
	);
};

export default SearchPage;
