import {
	$accountData,
	$accountDetails,
	$accountType,
} from "@/lib/globalStates";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { IAccountData, IUserHunter, IUserProvisioner } from "@/lib/types";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

import { AnimPageTransition } from "@/lib/animations";
import { FiLoader } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const LogInPage = () => {
	const router = useRouter();
	const [isPasswordRevealed, setIsPasswordRevealed] = useState<boolean>(false);
	const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

	const handleLogIn = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoggingIn(true);
		toast.dismiss();

		let inputForms = [e.currentTarget.email, e.currentTarget.password];

		const loginData = {
			email: e.currentTarget.email.value as string,
			password: e.currentTarget.password.value as string,
		};

		// make the missing input field have a class of "input-error"
		if (!(loginData.email && loginData.password)) {
			toast.error("Please fill in all fields");

			inputForms.forEach((input) => {
				if (!input.value) {
					input.classList.add("input-error");
				} else {
					input.classList.remove("input-error");
				}
			});

			return;
		}

		// remove the "input-error" class from all input fields if they are filled
		inputForms.forEach((input) => {
			if (!input.value) {
				input.classList.add("input-error");
			} else {
				input.classList.remove("input-error");
			}
		});

		const { data: userData, error } = await supabase.auth.signInWithPassword({
			email: loginData.email,
			password: loginData.password,
		});

		if (error) {
			toast.error(error.message);
			return;
		}

		const metadata = userData.user?.user_metadata as
			| IUserHunter
			| IUserProvisioner;

		const accountData: IAccountData = {
			created_at: userData.user?.created_at as string,
			email: userData.user?.email as string,
			id: userData.user?.id as string,
			email_confirmed_at: userData.user?.email_confirmed_at as string,
			phone: userData.user?.phone as string,
			raw_user_meta_data: metadata,
		};

		$accountType.set(metadata.type);
		$accountDetails.set(metadata);
		$accountData.set(accountData);

		toast.success("Welcome back!");

		if (metadata.type === "hunter") {
			router.push("/h/feed");
		} else if (metadata.type === "provisioner") {
			router.push("/p/dashboard");
		}
	};

	return (
		<>
			<AnimatePresence mode="wait">
				{isLoggingIn && (
					<motion.div
						variants={AnimPageTransition}
						initial="initial"
						animate="animate"
						exit="exit"
						className="fixed z-50 top-0 left-0 bg-base-100/80 select-none w-screen h-full flex flex-col justify-center items-center"
					>
						<FiLoader className="text-2xl animate-spin" />
						<p>Logging you in</p>
					</motion.div>
				)}
			</AnimatePresence>

			<motion.div
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
			>
				<div className="lg:grid lg:min-h-screen lg:grid-cols-12 pb-10 lg:pb-0">
					<div className="relative flex h-52 items-end  lg:col-span-5 lg:h-full xl:col-span-6">
						<Image
							alt="Night"
							src="https://images.unsplash.com/photo-1444210971048-6130cf0c46cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=873&q=80"
							className="absolute inset-0 h-full w-full object-cover opacity-80"
							fill
						/>

						<div className="hidden lg:relative lg:block lg:p-12">
							<Link
								className="avatar w-16 h-16 relative bg-primary-content rounded-full"
								href="/"
							>
								<Image
									src="/logo/wicket-new-adaptive.png"
									fill
									className="p-1"
									alt=""
								/>
							</Link>

							<h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
								Welcome to Wicket
							</h2>

							<p className="mt-4 leading-relaxed text-white/90">
								Let&apos;s get started by logging in to your account. And find a
								perfect job, suitable for you.
							</p>
						</div>
					</div>

					<div className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:py-12 lg:px-16 xl:col-span-6">
						<div className="w-full">
							<div className="relative -mt-16 block lg:hidden">
								<Link
									className="avatar w-16 h-16 relative bg-primary-content rounded-full"
									href="/"
								>
									<Image
										src="/logo/wicket-new-adaptive.png"
										fill
										className="p-1"
										alt=""
									/>
								</Link>

								<h1 className="mt-2 text-2xl font-bold  sm:text-3xl md:text-4xl">
									Welcome to Wicket
								</h1>

								<p className="mt-4 leading-relaxed text-gray-500">
									Let&apos;s get started by logging in to your account. And find
									a perfect job, suitable for you.
								</p>
							</div>

							<form
								onSubmit={handleLogIn}
								className="mt-8 grid grid-cols-6 gap-6"
							>
								<label className="col-span-full">
									<span className="block text-sm font-medium text-opacity-70 w-full">
										Email
									</span>

									<input
										type="email"
										id="Email"
										name="email"
										className="input input-primary input-bordered w-full"
									/>
								</label>

								<div className="col-span-full">
									<p className="block text-sm font-medium text-opacity-70">
										Password
									</p>

									<div className="flex gap-2 items-center">
										{!isPasswordRevealed ? (
											<input
												type="password"
												id="Password"
												name="password"
												className="input input-primary input-bordered w-full"
											/>
										) : (
											<input
												type="text"
												id="Password"
												name="password"
												className="input input-primary input-bordered w-full"
											/>
										)}
										<div
											onClick={() => {
												setIsPasswordRevealed(!isPasswordRevealed);
											}}
											className="btn btn-ghost text-lg"
										>
											{isPasswordRevealed ? (
												<MdVisibilityOff />
											) : (
												<MdVisibility />
											)}
										</div>
									</div>
								</div>

								<div className="col-span-full ">
									<button type="submit" className="btn btn-primary mb-5">
										Log in Account
									</button>

									<p className="mt-4 text-sm text-gray-500 sm:mt-0 flex gap-2">
										Don&apos;t have an account?
										<Link href="/register" className="link link-secondary">
											Sign up
										</Link>
										.
									</p>
									<p className="mt-4 text-sm text-gray-500 sm:mt-0 flex gap-2">
										Forgot your password?
										<Link
											href="/util/passwordreset"
											className="link link-secondary"
										>
											Recover here
										</Link>
										.
									</p>
								</div>
							</form>
						</div>
					</div>
				</div>
			</motion.div>
		</>
	);
};

export default LogInPage;
