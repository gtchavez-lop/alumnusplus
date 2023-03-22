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
	const [isPasswordRevealed, setIsPasswordRevealed] = useState<boolean>(false);
	const [isVerified, setIsVerified] = useState<boolean>(false);
	const _currentUser = useStore($accountData) as IAccountData;
	const router = useRouter();

	const checkForAccessToken = async () => {
		// split the url hash into an array
		const urlHash = window.location.hash.slice(1).split("&");

		// make urlHash into an object
		const urlHashObj = urlHash.reduce((acc, curr) => {
			const [key, value] = curr.split("=");
			acc[key] = value;
			// if there is an error_description, replace + with spaces
			if (key === "error_description") {
				acc[key] = value.replace(/\+/g, " ");
			}
			return acc;
		}, {} as Record<string, string>);

		// if there is an error, show the error_description
		if (
			urlHashObj.error ||
			urlHashObj.error_description ||
			!urlHashObj.access_token
		) {
			toast.error(urlHashObj.error_description);
			return;
		}

		// if there is an access_token, verify the user
		if (urlHashObj.access_token) {
			setIsVerified(true);
		}
	};

	const sendPasswordResetEmail = async (e: FormEvent) => {
		e.preventDefault();

		// console.log(
		// 	"sendPasswordResetEmail",
		// 	`${window.location.origin}/util/passwordreset`,
		// );

		const form = e.currentTarget as HTMLFormElement;
		const emailInput = form.email as HTMLInputElement;

		// disable all input fields
		form.email.disabled = true;
		form.submitbutton.disabled = true;

		const { error } = await supabase.auth.resetPasswordForEmail(
			emailInput.value,
			{
				redirectTo: "http://localhost:4000/util/passwordreset",
			},
		);

		if (error) {
			toast.error(error.message);

			// enable all input fields
			form.email.disabled = false;
			form.submitbutton.disabled = false;
			return;
		}

		toast.success("Password reset email sent");

		// enable all input fields
		form.email.disabled = false;
		form.submitbutton.disabled = false;
	};

	const changePassword = async (e: FormEvent) => {
		e.preventDefault();

		const form = e.currentTarget as HTMLFormElement;
		const passwordInput = form.password as HTMLInputElement;

		// disable all input fields
		form.password.disabled = true;
		form.submitbutton.disabled = true;

		// update the user's password
		const { error } = await supabase.auth.updateUser({
			password: passwordInput.value,
		});

		if (error) {
			toast.error(error.message);
			return;
		}

		toast.success("Password reset successful");
		router.push("/");
	};

	useEffect(() => {
		checkForAccessToken();
	}, []);

	return (
		<>
			<motion.div
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-16 lg:pt-24 pb-36"
			>
				<p className="text-3xl font-bold">Password Recovery</p>

				{!isVerified ? (
					<form onSubmit={sendPasswordResetEmail} className="mt-10">
						<label className="flex flex-col">
							<span>Your email address</span>
							<input
								name="email"
								type="email"
								className="input input-primary"
							/>
						</label>

						<button
							name="submitbutton"
							type="submit"
							className="btn btn-primary mt-5"
						>
							Send Password Reset Email
						</button>
					</form>
				) : (
					<form onSubmit={changePassword} className="mt-10">
						<label className="flex flex-col">
							<span>Your New Password</span>
							{!isPasswordRevealed ? (
								<input
									name="password"
									type="password"
									className="input input-primary"
								/>
							) : (
								<input
									name="password"
									type="text"
									className="input input-primary"
								/>
							)}
						</label>

						<button
							name="submitbutton"
							type="submit"
							className="btn btn-primary mt-5"
						>
							Submit New Password
						</button>
					</form>
				)}
			</motion.div>
		</>
	);
};

export default PasswordResetScreen;
