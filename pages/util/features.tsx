import { IUserHunter, IUserProvisioner } from "@/lib/types";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useStore } from "@nanostores/react";

const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export default function FeaturesPage() {
	const _accountDetails = useStore($accountDetails) as
		| IUserHunter
		| IUserProvisioner;

	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				<div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8">
					<div className="items-end justify-between sm:flex">
						<div className="max-w-xl">
							<h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
								See what Wicket can do for you
							</h2>

							<p className="mt-8 max-w-lg opacity-50">
								Wicket is a career platform that allows you to connect
								professionals in your area. Providing you with the tools to
								succeed.
							</p>
						</div>

						{_accountDetails && _accountDetails.type === "hunter" && (
							<Link
								href="/h/feed"
								className="mt-8 btn btn-primary sm:mt-0 lg:mt-8"
							>
								Get started today
								<FiArrowRight className="ml-4" />
							</Link>
						)}
						{_accountDetails && _accountDetails.type === "provisioner" && (
							<Link
								href="/p/dashboard"
								className="mt-8 btn btn-primary sm:mt-0 lg:mt-8"
							>
								Get started today
								<FiArrowRight className="ml-4" />
							</Link>
						)}
						{!_accountDetails && (
							<Link
								href="/login"
								className="mt-8 btn btn-primary sm:mt-0 lg:mt-8"
							>
								Get started today
								<FiArrowRight className="ml-4" />
							</Link>
						)}
					</div>

					<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
						<blockquote
							id="blogging"
							className="flex h-full flex-col justify-between p-0 lg:p-4"
						>
							<div className="mt-4">
								<h3 className="text-xl font-bold text-secondary sm:text-2xl">
									Mini-blogging
								</h3>

								<p className="mt-4 opacity-60">
									This mini-blogging feature allows you to share your thoughts
									with your followers. You can also share your thoughts with
									other users.
								</p>
							</div>
						</blockquote>

						<blockquote
							id="companyhunting"
							className="flex h-full flex-col justify-between p-0 lg:p-4"
						>
							<div className="mt-4">
								<h3 className="text-xl font-bold text-secondary sm:text-2xl">
									Geo-Company Hunting
								</h3>

								<p className="mt-4 opacity-60">
									Hunters can search for companies in their current location.
									Without the hassle of searching for companies on other sites.
								</p>
							</div>
						</blockquote>

						<blockquote
							id="jobposting"
							className="flex h-full flex-col justify-between p-0 lg:p-4"
						>
							<div className="mt-4">
								<h3 className="text-xl font-bold text-secondary sm:text-2xl">
									Job Posting
								</h3>

								<p className="mt-4 opacity-60">
									As a company, you can post jobs for other users to apply for.
									Providing other users with the opportunity to work for your
									company.
								</p>
							</div>
						</blockquote>

						<blockquote
							id="metaverse"
							className="flex h-full flex-col justify-between p-0 lg:p-4"
						>
							<div className="mt-4">
								<h3 className="text-xl font-bold text-secondary sm:text-2xl">
									Metaverse
								</h3>

								<p className="mt-4 opacity-60">
									The metaverse is a virtual world that allows you to connect
									with other users as well as interact with the companies you
									follow.
								</p>
							</div>
						</blockquote>
					</div>
				</div>
			</motion.main>

			<Footer />
		</>
	);
}
