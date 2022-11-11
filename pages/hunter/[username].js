import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { FiLoader } from "react-icons/fi";
import Image from "next/image";
import { __PageTransition } from "../../lib/animtions";
import __supabase from "../../lib/supabase";
import { useRouter } from "next/router";
import { useSelect } from "react-supabase";

export const getServerSideProps = async (context) => {
	const { username } = context.params;

	const { data: hunterData, error: hunterError } = await __supabase
		.from("user_hunters")
		.select("*")
		.single()
		.eq("username", username);

	if (hunterError) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			hunterData,
		},
	};
};

const HunterPage = ({ hunterData }) => {
	const [hunterPosts, setHunterPosts] = useState([]);
	const [tabSelected, setTabSelected] = useState("posts");

	const fetchHunterPosts = async () => {
		const { data: posts, error } = await __supabase
			.from("hunt_blog")
			.select("*")
			.eq("uploader_email", hunterData.email);

		if (error) {
			console.log(error);
			return;
		}
		console.log(posts);

		setHunterPosts(posts);
	};

	useEffect(() => {
		fetchHunterPosts();
	}, []);

	// const [
	//   { data: hunterData, loading: hunterLoading, error: hunterError },
	//   reexecuteHunter,
	// ] = useSelect("user_hunters", {
	//   columns: "*",
	//   filter: (query) => query.eq("username", username),
	//   options: { count: "exact" },
	// });

	// if (hunterLoading) {
	//   return (
	//     <>
	//       <main className="fixed top-0 left-0 w-full h-screen flex flex-col justify-center items-center">
	//         <FiLoader className="text-4xl animate-spin" />
	//       </main>
	//     </>
	//   );
	// }

	return (
		<>
			<motion.main
				variants={__PageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="pt-36 lg:pt-28 max-w-2xl mx-auto "
			>
				{/* profile highlights */}
				<div className="flex flex-col lg:flex-row ">
					<div className="flex gap-5">
						<Image
							src={`https://avatars.dicebear.com/api/bottts/${hunterData.username}.svg`}
							width={100}
							height={100}
							className="rounded-full border-4 border-primary p-2 border-opacity-10"
							alt="avatar"
						/>
						<div className="flex flex-col justify-between">
							<div className="flex gap-2">
								<h1 className="text-2xl font-semibold">{hunterData.username}</h1>
							</div>
							<div className="flex gap-2">
								<button className="btn btn-primary btn-sm ">Follow</button>
							</div>
						</div>
					</div>
					<div className="flex flex-col mt-5 lg:mt-0 lg:ml-10">
						<p className="text-lg lg:text-2xl">
							{hunterData.firstName} {hunterData.lastName}
						</p>
						<p className="text-sm opacity-30">{hunterData.email}</p>
					</div>
				</div>

				{/* tabs */}
				<div className="grid grid-cols-2 mt-16">
					<div
						onClick={() => setTabSelected("posts")}
						className={`flex justify-center items-center border-b-4 py-3 cursor-pointer ${
							tabSelected === "posts" ? "border-primary" : "border-transparent"
						}`}
					>
						<p className="text-lg font-semibold">Posts</p>
					</div>
					<div
						onClick={() => setTabSelected("connections")}
						className={`flex justify-center items-center border-b-4 py-3 cursor-pointer ${
							tabSelected === "connections" ? "border-primary" : "border-transparent"
						}`}
					>
						<p className="text-lg font-semibold">Connections</p>
					</div>
				</div>

				{/* posts */}
				<AnimatePresence mode="wait">
					{tabSelected === "posts" && (
						<div>
							{hunterPosts.length < 1 && (
								<motion.div
									variants={__PageTransition}
									initial="initial"
									animate="animate"
									exit="exit"
									className="flex flex-col justify-center items-center mt-10"
								>
									<p className="text-lg font-semibold">No posts yet</p>
								</motion.div>
							)}
						</div>
					)}
				</AnimatePresence>
			</motion.main>
		</>
	);
};

export default HunterPage;
