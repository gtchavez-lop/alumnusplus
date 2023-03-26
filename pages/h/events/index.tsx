import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { IUserHunter } from "@/lib/types";
import { NextPage } from "next";
import ProvFeedCardGrid from "@/components/feed/ProvFeedCardGrid";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useQueries } from "@tanstack/react-query";
import { useStore } from "@nanostores/react";

const HunterEventPage: NextPage = () => {
	const _currentUser = useStore($accountDetails) as IUserHunter;

	const fetchEvents = async () => {
		const { data, error } = await supabase
			.from("public_provposts")
			.select("*,uploader(*)")
			.eq("type", "event")
			.order("createdAt", { ascending: false })
			.limit(10);

		if (error) {
			console.log(error);
			return [];
		}

		return data;
	};

	const [publicEvents] = useQueries({
		queries: [
			{
				queryKey: ["publicEvents"],
				queryFn: fetchEvents,
				refetchOnWindowFocus: false,
				refetchOnReconnect: true,
				enabled: !!_currentUser,
			},
		],
	});

	console.log(publicEvents);

	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				<p className="text-3xl mb-2">Public Event Announcements</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
					{publicEvents.isLoading &&
						Array(4)
							.fill("")
							.map((_, i) => (
								<div
									key={`eventcardloader_${i}`}
									style={{
										animationDelay: `${i * 0.15}s`,
									}}
									className="h-[200px] bg-slate-500/50 animate-pulse rounded-btn"
								/>
							))}

					{publicEvents.data && publicEvents.data.length > 0 ? (
						publicEvents.data.map((event) => (
							<ProvFeedCardGrid key={event.id} item={event} />
						))
					) : (
						<p className="text-xl text-slate-500">No events found</p>
					)}
				</div>
			</motion.main>
		</>
	);
};

export default HunterEventPage;
