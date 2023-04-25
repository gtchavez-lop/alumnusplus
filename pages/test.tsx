import { useEffect, useState } from "react";

import { $accountDetails } from "@/lib/globalStates";
import { IUserHunter } from "@/lib/types";
import Link from "next/link";
import { NextPage } from "next";
import PH_Locations from "@/lib/ph_locations.new.json";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@nanostores/react";

const TestPage: NextPage = () => {
		const _currentUser = useStore($accountDetails) as IUserHunter;

	const fetchAllConnectionPosts = async () => {
		const { data, error } = await supabase
			.from("public_posts")
			.select("*")
			.in("uploader", [_currentUser.id, ..._currentUser.connections])
			.order("createdAt", { ascending: false })
			.eq("draft", false);

		if (error) {
			console.log("error", error);
			return [];
		}

		return data;
	};

	const posts = useQuery({
		queryKey: ["posts"],
		queryFn: fetchAllConnectionPosts,
		enabled: !!_currentUser,
		networkMode: "offlineFirst",
	});

	return (
		<>
			<div className="py-24">
				<Link href={"/h/feed/post?id=1"}>Go to page</Link>
			</div>
		</>
	);
};

export default TestPage;
