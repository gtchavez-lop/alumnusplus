import "@/styles/globals.css";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from "react";

import $supabase from "@/lib/supabase";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
	const checkUser = async () => {
		const { error } = await $supabase.auth.getSession();

		if (error) {
			console.error(error);

			// remove hunter and provisioner keys in localStorage
			localStorage.removeItem("data-hunter");
			localStorage.removeItem("data-provisioner");
			return;
		}
	};

	useEffect(() => {
		checkUser();
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<>
				<Navbar />
				<div className="w-full max-w-5xl mx-auto py-24 px-3 lg:px-0">
					<Component {...pageProps} />
				</div>
			</>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
