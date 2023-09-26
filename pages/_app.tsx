import "@/styles/globals.css";

import {
	$accountData,
	$accountDetails,
	$accountType,
	$hasAccount,
	$themeMode,
} from "@/lib/globalStates";
import { IUserHunter, IUserProvisioner } from "@/lib/types";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import Footer from "@/components/Footer";
import NavbarNew from "@/components/NavbarNew";
import NextThemeProvider from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabase";
import { tanstackClient } from "@/lib/tanstack";
import { useStore } from "@nanostores/react";
import { Poppins } from "@next/font/google";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AnimatePresence } from "framer-motion";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { FiLoader } from "react-icons/fi";

const fontLoader = Poppins({
	subsets: ["latin"],
	weight: "500",
});

export default function App({ Component, pageProps, router }: AppProps) {
	const _currentTheme = useStore($themeMode);
	const [supabaseClient] = useState(() => createBrowserSupabaseClient());

	const checkUser = async () => {
		const { data } = await supabase.auth.getSession();

		if (data.session?.user) {
			const metadata = data.session?.user?.user_metadata as
				| IUserHunter
				| IUserProvisioner;

			if (metadata && metadata.type === "hunter") {
				$accountType.set("hunter");
				const { data: newData, error } = await supabase
					.from("user_hunters")
					.select("*")
					.eq("id", data.session?.user?.id)
					.single();

				if (error) {
					console.log(error);
					return;
				} else {
					$accountDetails.set({
						...newData,
						id: data.session?.user?.id as string,
					});
					$accountData.set({
						created_at: data.session?.user?.created_at as string,
						email: data.session?.user?.email as string,
						id: data.session?.user?.id as string,
						email_confirmed_at: data.session?.user
							?.email_confirmed_at as string,
						phone: data.session?.user?.phone as string,
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
					.eq("id", data.session?.user?.id)
					.single();

				if (error) {
					console.log(error);
					return;
				} else {
					$accountDetails.set({
						...newData,
						id: data.session?.user?.id as string,
					});
					$accountData.set({
						created_at: data.session?.user?.created_at as string,
						email: data.session?.user?.email as string,
						id: data.session?.user?.id as string,
						email_confirmed_at: data.session?.user
							?.email_confirmed_at as string,
						phone: data.session?.user?.phone as string,
						raw_user_meta_data: metadata,
					});

					if (router.pathname === "/") {
						router.push("/p/dashboard");
						$hasAccount.set(true);
					}
				}
			}
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
	}, []);

	return (
		<>
			<Head>
				<title>Wicket - Web3 Career Platform</title>

				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta charSet="utf-8" />

				<link rel="icon" href="/logo/wicket-new-adaptive.png" />

				<link rel="manifest" href="/manifest.json" />
			</Head>

			<SessionContextProvider
				supabaseClient={supabaseClient}
				initialSession={pageProps.initialSession}
			>
				<QueryClientProvider client={tanstackClient}>
					<Hydrate state={pageProps.dehydratedState}>
						<NextThemeProvider
							attribute="class"
							defaultTheme="dark"
							enableSystem
						>
							<TooltipProvider>
								<>
									{/* <AppBar /> */}
									{/* <Navbar /> */}
									<NavbarNew />

									<div
										className={`${fontLoader.className} flex justify-center bg-background overflow-x-hidden`}
									>
										<div className="w-full max-w-5xl px-3 lg:px-0 min-h-screen pt-16 print:pt-0 lg:pt-0 ">
											<AnimatePresence mode="wait">
												<div className="min-h-screen" vaul-drawer-wrapper="">
													<Component
														{...pageProps}
														rotuer={router}
														key={router.pathname}
													/>
												</div>
											</AnimatePresence>
											<Footer />
										</div>
									</div>

									<ReactQueryDevtools initialIsOpen={false} />
									<Toaster
										toastOptions={{
											style: {
												background:
													_currentTheme === "dark" ? "#3D4451" : "#3D4451",
												color: "#bec3ce", // _currentTheme === "dark" ? "#0d0d14" : "#bec3ce",
											},
											success: {
												icon: "✔️",
												style: {
													background:
														_currentTheme === "dark" ? "#22c55e" : "#bef264",
													color:
														_currentTheme === "dark" ? "#0d0d14" : "#bec3ce",
												},
											},
											error: {
												icon: "❌",
												style: {
													background:
														_currentTheme === "dark" ? "#f87171" : "#dc2626",
													color:
														_currentTheme === "dark" ? "#0d0d14" : "#bec3ce",
												},
											},
											loading: {
												icon: <FiLoader className="animate-spin text-lg" />,
											},
										}}
										position="bottom-right"
									/>
								</>
							</TooltipProvider>
						</NextThemeProvider>
					</Hydrate>
				</QueryClientProvider>
			</SessionContextProvider>
		</>
	);
}
