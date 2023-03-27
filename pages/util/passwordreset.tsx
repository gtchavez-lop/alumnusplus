import { FormEvent, useEffect, useState } from "react";

import { $accountData } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { IAccountData } from "@/lib/types";
import { NextPage } from "next";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";

const PasswordResetScreen: NextPage = () => {
	const router = useRouter();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const emailInput = form.elements[0] as HTMLInputElement;

		// disable all inputs
		for (let i = 0; i < form.elements.length; i++) {
			const input = form.elements[i] as HTMLInputElement | HTMLButtonElement;
			input.disabled = true;
		}

		const { error } = await supabase.auth.resetPasswordForEmail(
			emailInput.value,
		);

		if (error) {
			toast.error(error.message);

			// enable all inputs
			for (let i = 0; i < form.elements.length; i++) {
				const input = form.elements[i] as HTMLInputElement | HTMLButtonElement;
				input.disabled = false;
			}

			return;
		} else {
			toast.success("Check your email for the link!");
			router.push("/");
		}
	};

	return (
		<>
			<motion.div
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-16 lg:pt-24 pb-36"
			>
				<div className="flex flex-col w-full max-w-lg mx-auto p-5 bg-base-200 rounded-btn mt-16">
					<p className="text-2xl font-bold text-center">Enter your Email</p>
					<p className="text-center">The one you used to register here</p>

					<form onSubmit={handleSubmit} className="mt-10">
						<input
							type="email"
							placeholder="You email address here"
							className="input w-full input-primary"
						/>

						<p className="my-5 text-center text-info">
							We will send you a link to access your account. If you don't see
							the email in your inbox, check your spam folder.
						</p>

						<button className="btn btn-primary w-full mt-5">
							Send Magic Link
						</button>
					</form>
				</div>
			</motion.div>
		</>
	);
};

export default PasswordResetScreen;
