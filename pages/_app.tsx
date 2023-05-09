import "@/styles/globals.css";
// import "react-chatbot-kit/build/main.css";

import {
	$accountData,
	$accountDetails,
	$accountType,
	$hasAccount,
	$themeMode,
} from "@/lib/globalStates";
import {
	Hydrate,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { IUserHunter, IUserProvisioner } from "@/lib/types";
import { Toaster, toast } from "react-hot-toast";

import { AnimatePresence } from "framer-motion";
import type { AppProps } from "next/app";
import { FiLoader } from "react-icons/fi";
import Footer from "@/components/Footer";
import Head from "next/head";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { tanstackClient } from "@/lib/tanstack";
import { useEffect } from "react";
import { useStore } from "@nanostores/react";

const AppBar = dynamic(() => import("@/components/AppBar"), { ssr: true });
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: true });

export default function App({ Component, pageProps, router }: AppProps) {
	const _currentTheme = useStore($themeMode);

	useEffect(() => {
		const { data } = supabase.auth.onAuthStateChange((event, session) => {
			switch (event) {
				case "SIGNED_IN":
					const metadata = session?.user.user_metadata as
						| IUserHunter
						| IUserProvisioner;
					const type = metadata.type;
					$accountType.set(type);
					$accountData.set({
						created_at: session?.user?.created_at as string,
						email: session?.user?.email as string,
						email_confirmed_at: session?.user?.email_confirmed_at as string,
						id: session?.user?.id as string,
						phone: session?.user?.phone as string,
						raw_user_meta_data: metadata,
					});

					if (
						router.pathname === "/" ||
						router.pathname === "/login" ||
						router.pathname === "/register"
					) {
						if (type === "hunter") {
							// fetch hunter data
							supabase
								.from("user_hunters")
								.select("*")
								.eq("id", session?.user.id)
								.single()
								.then((res) => {
									if (!res.error) {
										$accountDetails.set(res.data);
										router.push("/h/feed");
									} else {
										$accountDetails.set(null);
										toast.error(res.error.message);
										router.push("/login");
									}
								});
						} else if (type === "provisioner") {
							// fetch provisioner data
							supabase
								.from("user_provisioners")
								.select("*")
								.eq("id", session?.user.id)
								.single()
								.then((res) => {
									if (!res.error) {
										$accountDetails.set(res.data);
										router.push("/p/dashboard");
									} else {
										$accountDetails.set(null);
										toast.error("Please try logging in again.");
										router.push("/login");
									}
								});
						}
					}
					break;
				case "SIGNED_OUT":
					$accountType.set(null);
					$accountDetails.set(null);
					$accountData.set(null);
					break;
			}
		});

		return () => {
			console.log("ALSKJDAKLSJDLKAJSDLKJ");
			supabase.auth
				.getUser()
				.then((user) => {
					const metadata = user.data.user?.user_metadata as
						| IUserHunter
						| IUserProvisioner;
					const type = metadata.type;
					$accountType.set(type);
					$accountData.set({
						created_at: user.data.user?.created_at as string,
						email: user.data.user?.email as string,
						email_confirmed_at: user.data.user?.email_confirmed_at as string,
						id: user.data.user?.id as string,
						phone: user.data.user?.phone as string,
						raw_user_meta_data: metadata,
					});

					if (type === "hunter") {
						// fetch hunter data
						supabase
							.from("user_hunters")
							.select("*")
							.eq("id", user.data.user?.id)
							.single()
							.then((res) => {
								if (!res.error) {
									$accountDetails.set(res.data);
									if (
										router.pathname === "/" ||
										router.pathname === "/login" ||
										router.pathname === "/register"
									) {
										router.push("/h/feed");
									}
								} else {
									$accountDetails.set(null);
									toast.error(res.error.message);
									router.push("/login");
								}
							});
					} else if (type === "provisioner") {
						// fetch provisioner data
						supabase
							.from("user_provisioners")
							.select("*")
							.eq("id", user.data.user?.id)
							.single()
							.then((res) => {
								if (!res.error) {
									$accountDetails.set(res.data);

									if (
										router.pathname === "/" ||
										router.pathname === "/login" ||
										router.pathname === "/register"
									) {
										router.push("/p/dashboard");
									}
								} else {
									$accountDetails.set(null);
									toast.error("Please try logging in again.");
									router.push("/login");
								}
							});
					}
				})
				.catch((error) => {
					console.log(error);
					return;
				});
			data.subscription.unsubscribe();
		};
	}, [supabase, router]);

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
				<Hydrate state={pageProps.dehydratedState}>
					<>
						<AppBar />
						<Navbar />

						<div className="flex justify-center bg-base-100 overflow-x-hidden">
							<div className="w-full max-w-5xl px-3 lg:px-0 min-h-screen pt-16 print:pt-0 lg:pt-0 ">
								<AnimatePresence mode="wait">
									<div className="min-h-screen">
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
					</>
				</Hydrate>
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
