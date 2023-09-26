import LazyFeedPage from "@/components/lazy/FeedPage";
import { NextPage } from "next";
import { Suspense } from "react";
import { FiLoader } from "react-icons/fi";

const HunterFeedPage: NextPage = () => {
	return (
		<Suspense fallback={<FiLoader className="animate-spin" />}>
			<LazyFeedPage />
		</Suspense>
	);
};

export default HunterFeedPage;
