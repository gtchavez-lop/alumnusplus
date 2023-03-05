import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { IUserHunter } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useQueries } from "@tanstack/react-query";
import { useStore } from "@nanostores/react";

const ConnectionsPage = () => {
	const currentUser = useStore($accountDetails) as IUserHunter;

	const fetchUserConnections = async () => {
		const thisUserConnection = currentUser.connections;

		const { data, error } = await supabase
			.from("user_hunters")
			.select("id,email,full_name,username,birthdate,avatar_url")
			.in("id", thisUserConnection);

		if (error) {
			console.log(error);
			return null;
		}

		return data;
	};

	const fetchRecommendedUsers = async () => {
		const thisUserConnections = currentUser.connections;

		const reqString = `(${thisUserConnections.concat(currentUser.id)})`;

		const { data, error } = await supabase
			.from("new_recommended_hunters")
			.select("*")
			.filter("id", "not.in", reqString)
			.limit(2);

		if (error) {
			console.log(error);
			return;
		}

		const limitedData = data?.slice(0, 2);
		return limitedData;
	};

	const [userConnections, recommendedUsers] = useQueries({
		queries: [
			{
				queryKey: ["userConnections"],
				queryFn: fetchUserConnections,
				enabled: !!currentUser,
				refetchOnMount: false,
				refetchOnWindowFocus: false,
				refetchInterval: 180 * 1000,
			},

			{
				queryKey: ["recommendedUsers"],
				queryFn: fetchRecommendedUsers,
				enabled: !!currentUser,
				refetchOnMount: false,
				refetchOnWindowFocus: false,
			},
		],
	});

	return (
		<>
			{currentUser &&
				userConnections.isFetched &&
				recommendedUsers.isFetched && (
					<motion.main
						variants={AnimPageTransition}
						initial="initial"
						animate="animate"
						exit="exit"
						className="relative min-h-screen w-full pt-24 pb-36"
					>
						<section className="items-center grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
							<div className="col-span-3 flex flex-col gap-3">
								<div className="flex items-center gap-2 flex-col sm:flex-row bg-base-200 rounded-btn p-5">
									<Image
										src={currentUser.avatar_url}
										alt="avatar"
										className="w-32 h-32 bg-primary mask mask-squircle"
										width={128}
										height={128}
									/>
									<div>
										<h4 className="text-3xl font-bold leading-tight">
											{currentUser.full_name.first} {currentUser.full_name.last}
										</h4>
										<p className="opacity-50 leading-none">
											@{currentUser.username}
										</p>
									</div>
								</div>
							</div>

							<div className="col-span-2 flex flex-col gap-2">
								<p className="text-2xl font-bold leading-tight">
									Suggested Connections
								</p>

								<div className="flex flex-col">
									{recommendedUsers.data!.length > 0 ? (
										<>
											{recommendedUsers.data!.map((item, index) => (
												<Link
													href={`/h/${item.username}`}
													key={`recommendedUsers_${index}`}
													className="flex gap-2 items-center hover:bg-base-300 py-2 px-3 rounded-btn transition"
												>
													<Image
														src={item.avatar_url}
														alt="avatar"
														className="w-12 h-12 mask mask-squircle bg-primary"
														width={48}
														height={48}
													/>
													<div>
														<h4 className="leading-tight">
															{item.full_name.first} {item.full_name.last}
														</h4>
														<p className="text-sm opacity-50 leading-none">
															@{item.username}
														</p>
													</div>
												</Link>
											))}
										</>
									) : (
										<p>
											We do not have any suggestions for you right now. Try
											connecting to more people to get more suggestions.
										</p>
									)}
								</div>
							</div>
						</section>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
							<p className="col-span-full text-xl font-bold">
								Your Connections
							</p>
							{userConnections.data!.map((item, index) => (
								<Link
									href={`/h/${item.username}`}
									key={`userConnections${index}`}
									className="bg-base-200 p-4 rounded-btn flex gap-2 flex-col hover:bg-base-300 transition"
								>
									<div className="flex gap-2 items-center">
										<Image
											src={item.avatar_url}
											alt="avatar"
											className="w-12 h-12 mask mask-squircle bg-primary"
											width={48}
											height={48}
										/>
										<div>
											<h4 className="leading-tight">
												{item.full_name.first} {item.full_name.last}
											</h4>
											<p className="text-sm opacity-50 leading-none">
												@{item.username}
											</p>
										</div>
									</div>
								</Link>
							))}
						</div>
					</motion.main>
				)}
		</>
	);
};
export default ConnectionsPage;
