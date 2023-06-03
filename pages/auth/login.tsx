import { $HunterAccountData, $SolidAccountType, $SolidHunterAccountData } from "@/lib/globalstore";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FormEvent, useState } from "react";

import $supabase from "@/lib/supabase";
import { IUserHunter } from "@/lib/types";
import Link from "next/link";
import { NextPage } from "next";
import { useRouter } from "next/router";

type LogInPageProps = {};

const LoginPage: NextPage<LogInPageProps> = () => {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		message: string;
	}>({
		message: "",
		type: "success",
	});
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const router = useRouter();

	const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formdata = new FormData(e.currentTarget);

		const email = formdata.get("email") as string;
		const password = formdata.get("password") as string;

		setIsLoggingIn(true);
		setMessage({
			message: "",
			type: "success",
		});

		const { data, error } = await $supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setMessage({
				message: error.message,
				type: "error",
			});
			setIsLoggingIn(false);
			return;
		}

		// check if user is hunter
		if (data.user?.user_metadata.type === "hunter") {
			const { data: hunterData, error: hunterError } = await $supabase
				.from("user_hunters")
				.select("*")
				.eq("id", data.user.id)
				.single();

			if (hunterError) {
				setMessage({
					message: hunterError.message,
					type: "error",
				});
				setIsLoggingIn(false);
				return;
			}

			setMessage({
				message: "Logged in successfully!",
				type: "success",
			});
			setIsLoggingIn(false);
			$SolidAccountType.set("hunter");
			$SolidHunterAccountData.set(hunterData as IUserHunter);
			setTimeout(() => {
				router.push("/hunter/feed");
			}, 1000);
		}

		// setMessage({
		// 	message: "Logged in successfully!",
		// 	type: "success",
		// });
		// setIsLoggingIn(false);
	};

	return (
		<main className="fixed top-0 left-0 min-h-screen w-full flex flex-col justify-center items-center">
			<h1 className="text-3xl font-bold text-center">Welcome to Wicket</h1>

			<form
				onSubmit={handleLogin}
				className="py-10 flex flex-col gap-2 w-full max-w-sm"
			>
				<label className="flex flex-col w-full">
					<span>Email Address</span>
					<input
						type="email"
						name="email"
						id="email"
						className="input input-primary"
						placeholder="johndoe@email.com"
					/>
				</label>
				<label className="flex flex-col w-full">
					<span>Password</span>
					<div className="join">
						<input
							type={isPasswordVisible ? "text" : "password"}
							name="password"
							id="password"
							className="input join-item input-primary flex-1"
							placeholder="********"
						/>
						<button
							type="button"
							className="btn btn-primary text-lg join-item"
							onClick={() => setIsPasswordVisible((prev) => !prev)}
						>
							{isPasswordVisible ? <FiEye /> : <FiEyeOff />}
						</button>
					</div>
				</label>

				<p className="mt-2 text-center">
					Don&apos;t have an account?{" "}
					<Link href="/auth/register" className="link link-primary">
						Sign up here
					</Link>
				</p>

				{isLoggingIn ? (
					<div className="loading loading-spinner mx-auto mt-5" />
				) : (
					<button type="submit" className="btn btn-primary mt-5">
						Log In
					</button>
				)}
				{message.message && (
					<>
						<div
							className={`alert ${message.type === "success" ? "alert-success" : "alert-error"
								}`}
						>
							{message.message}
						</div>
					</>
				)}
			</form>
		</main>
	);
};

export default LoginPage;
