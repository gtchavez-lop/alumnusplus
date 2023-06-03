import { IUserHunter, THunterBlogPost } from "./types";

import $supabase from "./supabase";

type H_FetchHunterFeedProps = {
	target: IUserHunter;
};
type H_FetchConnectionProps = {
	username: string;
	full_name: {
		first: string;
		last: string;
	};
	id: string;
	avatar_url: string;
};
type H_RecommendedHunters = {
	id: string;
	username: string;
	full_name: {
		first: string;
		last: string;
	};
	avatar_url: string;
};

const H_FetchHunterFeed = async ({
	target,
}: H_FetchHunterFeedProps): Promise<THunterBlogPost[]> => {
	const connections = [...target.connections, target.id];
	const { data, error } = await $supabase
		.from("public_posts")
		.select("*,uploader(username,full_name,avatar_url,id)")
		.in("uploader", connections)
		.order("createdAt", { ascending: false });

	if (error) {
		console.error(error);
		return [] as THunterBlogPost[];
	}

	return data as THunterBlogPost[];
};
const H_FetchHunterFeedPersonal = async ({
	target,
}: { target: string }): Promise<THunterBlogPost[]> => {
	const { data, error } = await $supabase
		.from("public_posts")
		.select("*,uploader(username,full_name,avatar_url,id)")
		.eq("uploader", target)
		.order("createdAt", { ascending: false });

	if (error) {
		console.error(error);
		return [] as THunterBlogPost[];
	}

	return data as THunterBlogPost[];
};
const H_FetchRecommendedHunters = async ({
	connections,
}: {
	connections: string[];
}): Promise<H_RecommendedHunters[]> => {
	// add parenthesis to the array
	const parsed = connections.map((id) => `(${id})`).join(",");
	const { data, error } = await $supabase
		.from("new_recommended_hunters")
		.select("*")
		.filter("id", "not.in", parsed)
		.limit(5);

	if (error) {
		console.error(error);
		return [] as H_RecommendedHunters[];
	}

	return data as H_RecommendedHunters[];
};
const H_FetchConnections = async ({
	target,
}: { target: string[] }): Promise<H_FetchConnectionProps[]> => {
	const { data, error } = await $supabase
		.from("user_hunters")
		.select("username,full_name,id,avatar_url")
		.in("id", target);

	if (error) {
		return [] as H_FetchConnectionProps[];
	}

	return data as H_FetchConnectionProps[];
};

export {
	H_FetchHunterFeed,
	H_FetchRecommendedHunters,
	H_FetchHunterFeedPersonal,
	H_FetchConnections,
};
