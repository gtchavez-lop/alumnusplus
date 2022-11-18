import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";

import { $schema_hunter } from "../../schemas/user";
import Link from "next/link";
import { __PageTransition } from "../../lib/animtions";
import { __firebaseApp } from "../../lib/firebase";
import __supabase from "../../lib/supabase";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useAuth } from "../../components/AuthContext";
import { useRouter } from "next/router";

const LogInPage = (e) => {
	const [hasUser, setHasUser] = useState(false);
	const router = useRouter();
	const firebaseAuth = getAuth(__firebaseApp);
	const { $userAuth, $set_userAuth, $userData, $set_userData } = useAuth();

	const writeUserMetaData = async () => {
		const user = await __supabase.auth.user();
		const data = user.user_metadata;

		console.log(data ? "User Metadata detected" : "User Metadata not found");

		__supabase
			.from("user_hunters")
			.upsert({
				id: __supabase.auth.user().id,
				username: data.username,
				gender: data.gender,
				email: user.email,
				phone: data.phone,
				birthdate: data.birthdate,
				connections: data.connections,
				address: data.address,
				birthplace: data.birthplace,
				education: data.education,
				fullname: data.fullname,
				skillPrimary: data.skillPrimary,
				skillSecondary: data.skillSecondary,
			})
			.then(({ error }) => {
				if (error) {
					toast.error(error.message);
					return;
				} else {
					toast.dismiss();
					toast.success("Signed in!");
					router.push("/feed");
				}
			});
	};

	const signInAccount = async (e) => {
		e.preventDefault();

		const email = e.target.user_email.value;
		const password = e.target.user_password.value;

		toast.loading("Signing in...");

		__supabase.auth.signIn({ email, password }).then((data) => {
			if (data.error) {
				toast.dismiss();
				if (data.error.message === "Email not confirmed") {
					toast.error("Please check your email for a confirmation link.");
				} else {
					toast.error(data.error.message);
				}
			} else {
				writeUserMetaData();
			}
		});
	};

	const f_signInWithPassword = async (e) => {
		e.preventDefault();

		const email = e.target.user_email.value;
		const password = e.target.user_password.value;

		toast.loading("Signing in...");

		signInWithEmailAndPassword(firebaseAuth, email, password)
			.then((userCredential) => {
				const { user } = userCredential;

				toast.dismiss();
				toast.success("Signed in!");
				$set_userAuth(user);
			})
			.catch((error) => {
				toast.dismiss();
				const { code, message } = error;
				console.log(code, message);
				toast.error(message);
			});
	};

	useEffect(() => {
		const token = localStorage.getItem("supabase.auth.token");
		if (token) {
			setHasUser(true);
		}
	}, []);

	return (
		<>
			<motion.main
				variants={__PageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="flex flex-col items-center py-28"
			>
				<p className="text-3xl">Sign in to your account</p>

				{!hasUser && (
					<form className="form-control mt-28 w-full max-w-md gap-3" onSubmit={(e) => signInAccount(e)}>
						<label className="flex flex-col">
							<span className="ml-4">Your email address</span>
							<input
								type="email"
								placeholder="Email"
								name="user_email"
								className="input input-primary input-bordered"
							/>
						</label>
						<label className="flex flex-col">
							<span className="ml-4">Password</span>
							<input
								type="password"
								placeholder="**********"
								name="user_password"
								className="input input-primary input-bordered"
							/>
						</label>

						{/* submit button */}
						<button className="btn btn-primary mt-10">Sign in</button>

						{/* dont have account? */}
						<p className="text-center mt-5">
							Don&apos;t have an account?{" "}
							<Link href={"/register"} className="text-primary cursor-pointer">
								Sign up
							</Link>
						</p>
					</form>
				)}

				{hasUser && (
					<div className="flex flex-col items-center mt-28">
						<p className="text-3xl">You are signed in</p>
						<Link href={"/feed"} legacyBehavior={true}>
							<button className="btn btn-primary mt-10">Go to feed</button>
						</Link>
					</div>
				)}
			</motion.main>
		</>
	);
};

export default LogInPage;
