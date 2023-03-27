import "@/styles/globals.css";

import {
	$accountData,
	$accountDetails,
	$accountType,
	$hasAccount,
	$themeMode,
} from "@/lib/globalStates";
import { IUserHunter, IUserProvisioner } from "@/lib/types";
import { MdCheckCircleOutline, MdHourglassTop } from "react-icons/md";
import { Toaster, toast } from "react-hot-toast";

import { AnimatePresence } from "framer-motion";
import type { AppProps } from "next/app";
import { FiLoader } from "react-icons/fi";
import Head from "next/head";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { tanstackClient } from "@/lib/tanstack";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect } from "react";
import { useStore } from "@nanostores/react";

const AppBar = dynamic(() => import("@/components/AppBar"), { ssr: true });
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: true });

export default function App({ Component, pageProps, router }: AppProps) {
	const _currentTheme = useStore($themeMode);

	const checkUser = async () => {
		const { data } = await supabase.auth.getUser();

		if (data.user) {
			let metadata = data.user?.user_metadata as IUserHunter | IUserProvisioner;

			if (metadata && metadata.type === "hunter") {
				$accountType.set("hunter");
				const { data: newData, error } = await supabase
					.from("user_hunters")
					.select("*")
					.eq("id", data.user?.id)
					.single();

				if (error) {
					console.log(error);
					return;
				} else {
					$accountDetails.set({
						...newData,
						id: data.user?.id as string,
					});
					$accountData.set({
						created_at: data.user?.created_at as string,
						email: data.user?.email as string,
						id: data.user?.id as string,
						email_confirmed_at: data.user?.email_confirmed_at as string,
						phone: data.user?.phone as string,
						raw_user_meta_data: metadata,
					});

					if (router.pathname === "/") {
						router.push("/h/feed");
						$hasAccount.set(true);
					}
				}
			} else if (metadata && metadata.type === "provisioner") {
				$accountType.set("provisioner");
				const { data: newData, error } = await supabase
					.from("user_provisioners")
					.select("*")
					.eq("id", data.user?.id)
					.single();

				if (error) {
					console.log(error);
					return;
				} else {
					$accountDetails.set({
						...newData,
						id: data.user?.id as string,
					});
					$accountData.set({
						created_at: data.user?.created_at as string,
						email: data.user?.email as string,
						id: data.user?.id as string,
						email_confirmed_at: data.user?.email_confirmed_at as string,
						phone: data.user?.phone as string,
						raw_user_meta_data: metadata,
					});

					if (router.pathname === "/") {
						router.push("/p/dashboard");
						$hasAccount.set(true);
					}
				}
			}

			// change route depending on account type
		}
	};

	useEffect(() => {
		// check for user
		checkUser();

		// get theme from localStorage
		const theme = localStorage.getItem("theme");

		// set to global theme state
		if (theme) {
			$themeMode.set(theme as "light" | "dark");
			document.documentElement.setAttribute("data-theme", theme);
		}
	});

	return (
		<>
			<Head>
				<title>Wicket - Web3 Career Platform</title>

				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta charSet="utf-8" />

				<link rel="icon" href="/logo/wicket-new-adaptive.png" />

				<link rel="manifest" href="/manifest.json" />
			</Head>

			<QueryClientProvider client={tanstackClient}>
				<>
					<AppBar />
					<Navbar />

					<div className="flex justify-center bg-base-100 overflow-x-hidden">
						<div className="w-full max-w-5xl px-3 lg:px-0 min-h-screen pt-16 lg:pt-0 ">
							<AnimatePresence mode="wait">
								<Component
									{...pageProps}
									rotuer={router}
									key={router.pathname}
								/>
							</AnimatePresence>
						</div>
					</div>

					<ReactQueryDevtools initialIsOpen={false} />
				</>
			</QueryClientProvider>

			<Toaster
				toastOptions={{
					style: {
						background: _currentTheme === "dark" ? "#3D4451" : "#3D4451",
						color: "#bec3ce", // _currentTheme === "dark" ? "#0d0d14" : "#bec3ce",
					},
					success: {
						icon: "✔️",
						style: {
							background: _currentTheme === "dark" ? "#22c55e" : "#bef264",
							color: _currentTheme === "dark" ? "#0d0d14" : "#bec3ce",
						},
					},
					error: {
						icon: "❌",
						style: {
							background: _currentTheme === "dark" ? "#f87171" : "#dc2626",
							color: _currentTheme === "dark" ? "#0d0d14" : "#bec3ce",
						},
					},
					loading: {
						icon: <FiLoader className="animate-spin text-lg" />,
					},
				}}
				position="bottom-right"
			/>
		</>
	);
}
