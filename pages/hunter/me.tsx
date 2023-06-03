import { H_FetchConnections, H_FetchHunterFeedPersonal } from "@/lib/helpers";

import { $SolidHunterAccountData } from "@/lib/globalstore";
import { NextPage } from "next";
import ProfilePageShell from "@/components/hunter/ProfilePageShell";
import TabConnections from "@/components/hunter/me/TabConnections";
import TabFeed from "@/components/hunter/me/TabFeed";
import TabProfile from "@/components/hunter/me/TabProfile";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";

type PageProps = {};
const HunterProfilePage: NextPage<PageProps> = () => {
	const [activeTab, setActiveTab] = useState<
		"feed" | "profile" | "connections"
	>("feed");

	return (
		<ProfilePageShell
			tabs={["feed", "connections", "profile"]}
			activeTab={activeTab}
			setActiveTab={setActiveTab}
		>
			{activeTab === "feed" && <TabFeed />}
			{activeTab === "profile" && <TabProfile />}
			{activeTab === "connections" && <TabConnections />}
		</ProfilePageShell>
	);
};

export default HunterProfilePage;
