import { MdVisibility, MdVisibilityOff } from "react-icons/md";

import { AnimPageTransition } from "@/lib/animations";
import { NextPage } from "next";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useState } from "react";

const ResetPasswordPage: NextPage = () => {
	const [passwords, setPasswords] = useState({
		password: "",
		confirmPassword: "",
	});
	const [passwordRevealed, setPasswordRevealed] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		const password = formData.get("password");
		const confirmPassword = formData.get("confirmPassword");

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		// disable all input and button elements
		form.querySelectorAll("input, button").forEach((el) => {
			el.setAttribute("disabled", "true");
		});

		const { error } = await supabase.auth.updateUser({
			password: password as string,
		});

		if (error) {
			toast.error(error.message);
			form.querySelectorAll("input, button").forEach((el) => {
				el.setAttribute("disabled", "false");
			});
			return;
		}

		toast.success("Password updated successfully!");
		// disable all input and button elements
		form.querySelectorAll("input, button").forEach((el) => {
			el.setAttribute("disabled", "false");
		});
	};

	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				<div className="flex flex-col w-full max-w-lg mx-auto p-5 bg-base-200 rounded-btn mt-16">
					<p className="text-2xl font-bold text-center">Reset your password</p>
					<p className="text-center">
						Enter your new password below and update your account.
					</p>

					<form
						onChange={(e) => {
							// validate password
							// must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character
							const password = e.currentTarget.querySelector(
								"#password",
							) as HTMLInputElement;
							const confirmPassword = e.currentTarget.querySelector(
								"#confirmPassword",
							) as HTMLInputElement;

							if (password.value !== confirmPassword.value) {
								confirmPassword.setCustomValidity("Passwords do not match");
							}

							if (password.value.length < 8) {
								password.setCustomValidity(
									"Password must be at least 8 characters long",
								);
							}

							if (!password.value.match(/[a-z]/)) {
								password.setCustomValidity(
									"Password must contain at least 1 lowercase letter",
								);
							}

							if (!password.value.match(/[A-Z]/)) {
								password.setCustomValidity(
									"Password must contain at least 1 uppercase letter",
								);
							}

							if (!password.value.match(/[0-9]/)) {
								password.setCustomValidity(
									"Password must contain at least 1 number",
								);
							}

							if (
								!password.value.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
							) {
								password.setCustomValidity(
									"Password must contain at least 1 special character",
								);
							}

							if (password.value === confirmPassword.value) {
								confirmPassword.setCustomValidity("");
							}
						}}
						onSubmit={handleSubmit}
						className="mt-10 flex flex-col gap-2"
					>
						<label className="input-group ">
							<input
								id="password"
								name="password"
								type={passwordRevealed ? "text" : "password"}
								className="input input-primary flex-1"
								onChange={(e) =>
									setPasswords({ ...passwords, password: e.target.value })
								}
							/>
							<button
								type="button"
								onClick={() => setPasswordRevealed(!passwordRevealed)}
								className="btn btn-primary text-lg"
							>
								{passwordRevealed ? <MdVisibilityOff /> : <MdVisibility />}
							</button>
						</label>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type={passwordRevealed ? "text" : "password"}
							className="input input-primary "
							onChange={(e) =>
								setPasswords({
									...passwords,
									confirmPassword: e.target.value,
								})
							}
						/>
						<div className="flex justify-end">
							<button
								onClick={() => setPasswordRevealed(!passwordRevealed)}
								className="btn btn-ghost text-lg"
							>
								{passwordRevealed ? <MdVisibilityOff /> : <MdVisibility />}
							</button>
						</div>

						<button
							disabled={
								passwords.password !== passwords.confirmPassword ||
								!passwords.password ||
								!passwords.confirmPassword
							}
							className="btn btn-primary w-full mt-5"
						>
							Update Password
						</button>
					</form>
				</div>
			</motion.main>
		</>
	);
};

export default ResetPasswordPage;
