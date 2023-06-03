import $supabase from "@/lib/supabase";
import { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";

// rome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface PageProps {}

const Home: NextPage<PageProps> = () => {
	const router = useRouter();
	// check if user is logged in
	// if the user is logged in and is a hunter, redirect to /hunter/feed
	// if the user is logged in and is a provisioner, redirect to /prov/dashboard
	const checkUser = async () => {
		const {
			data: { session },
			error,
		} = await $supabase.auth.getSession();

		if (error) {
			console.error(error);
			return;
		}

		if (session) {
			if (session.user.user_metadata.type === "hunter") {
				router.push("/hunter/feed");
			}
			if (session.user.user_metadata.type === "provisioner") {
				router.push("/prov/dashboard");
			}
		}
	};

	useEffect(() => {
		checkUser();
	}, []);

	return (
		<div>
			<h1>Home</h1>
		</div>
	);
};

export default Home;
