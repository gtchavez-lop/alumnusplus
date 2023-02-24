import { __PageTransition } from "@/lib/animation";
import { __supabase } from "@/supabase";
import { useSession } from "@supabase/auth-helpers-react";
import { useUser } from "@supabase/auth-helpers-react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiUser } from "react-icons/fi";
const ConnectionsPage = () => {
	const currentSession = useSession();
	const fetchUserDetails = async () => {
		const { data, error } = await __supabase
			.from("user_hunters")
			.select("*")
			.eq("id", currentSession.user?.id)
			.single();

		if (error) {
			toast.error(error.message);
			return;
		}

		return data;
	};

	const fetchUserConnections = async () => {
		const thisUserConnection = userDetails.data.connections;

		const { data, error } = await __supabase
			.from("user_hunters")
			.select("id,email,full_name,username,birthdate")
			.in("id", thisUserConnection);

		if (error) {
			console.log(error);
			return null;
		}

		return data;
	};

	const fetchRecommendedUsers = async () => {
		const thisUserConnections = userDetails.data.connections;

		const reqString = `(${thisUserConnections.concat(currentSession.user.id)})`;

		const { data, error } = await __supabase
			.from("recommended_hunters")
			.select("*")
			.filter("id", "not.in", reqString)
			.limit(2);

		if (error) {
			console.log(error);
			return;
		}

		return data;
	};

	const userDetails = useQuery({
		queryKey: ["userDetails"],
		queryFn: fetchUserDetails,
		enabled: !!currentSession,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});

	const [userConnections, recommendedUsers] = useQueries({
		queries: [
			{
				queryKey: ["userConnections"],
				queryFn: fetchUserConnections,
				enabled: userDetails.isFetched,
				refetchOnMount: false,
				refetchOnWindowFocus: false,
				refetchInterval: 180*1000,
			},

			{
				queryKey: ["recommendedUsers"],
				queryFn: fetchRecommendedUsers,
				enabled: userDetails.isFetched,
				refetchOnMount: false,
				refetchOnWindowFocus: false,
			}
		]
	})

	// const userConnections = useQuery({
	// 	queryKey: ["userConnections"],
	// 	queryFn: fetchUserConnections,
	// 	enabled: userDetails.isFetched,
	// });

	// const recommendedUsers = useQuery({
	// 	queryKey: ["recommendedUsers"],
	// 	queryFn: fetchRecommendedUsers,
	// 	enabled: userDetails.isFetched,
	// });

	return (
		<>
			{userDetails.isFetched &&
				userConnections.isFetched &&
				recommendedUsers.isFetched && (
					<motion.main
						variants={__PageTransition}
						initial="initial"
						animate="animate"
						exit="exit"
						className="relative min-h-screen w-full pt-24 pb-36"
					>

						<section className="items-center grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
							<div className="col-span-3 flex flex-col gap-3">
								<div className="flex items-center gap-2 flex-col sm:flex-row bg-base-200 rounded-btn p-5">
									<img
										src={`https://avatars.dicebear.com/api/bottts/${userDetails.data.username}.svg`}
										alt="avatar"
										className="w-32 h-32 bg-primary p-2 mask mask-squircle"
									/>
									<div>
										<p className="text-3xl font-bold">
											{userDetails.data.full_name.first}{" "}
											{userDetails.data.full_name.last}
										</p>

										<p className="font-semibold opacity-75">
											@{userDetails.data.username}
										</p>
									</div>
								</div>
							</div>

							<div className="col-span-2 flex flex-col gap-5">
								<p className="text-2xl font-bold">Suggested Connections</p>

								<div className="flex flex-col gap-2">
									{recommendedUsers.data.length > 0 ? (
										<>
											{recommendedUsers.data.map((item, index) => (
												<Link href={`/h/${item.username}`} key={`recommendedUsers_${index}`} className="flex gap-2 items-center hover:bg-base-300 py-2 px-3 rounded-btn">
													<img
														src={`https://avatars.dicebear.com/api/bottts/${item.username}.svg`}
														alt="avatar"
														className="w-12 h-12 mask mask-squircle bg-primary "
													/>
													<div>
														<h4>
															{item.fullname.first} {item.fullname.last}
														</h4>
														<p>{item.username}</p>
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
							{userConnections.data.map((item, index) => (
								<div key={`userConnections${index}`} className="bg-base-200 p-4 rounded-btn flex gap-2 flex-col">
									<div className="flex gap-2 items-center">
										<img
											src={`https://avatars.dicebear.com/api/bottts/${item.username}.svg`}
											alt="avatar"
											className="w-12 h-12 mask mask-squircle bg-primary "
										/>
										<div>
											<h4>
												{item.full_name.first} {item.full_name.last}
											</h4>
											<p>{item.username}</p>
										</div>
									</div>
									<div className="flex flex-col gap-2 w-full">
										<Link
											href={`/h/${item.username}`}
											className="btn btn-primary self-end"
										>
											Visit Profile
										</Link>
									</div>
								</div>
							))}
						</div>
					</motion.main>
				)}
		</>
	);
};
export default ConnectionsPage;