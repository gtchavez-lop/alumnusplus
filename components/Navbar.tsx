import { $accountDetails, $accountType, $themeMode } from "@/lib/globalStates";
import { FiMoon, FiSun } from "react-icons/fi";
import { IUserHunter, IUserProvisioner } from "@/lib/types";
import {
	MdApps,
	MdDarkMode,
	MdDashboard,
	MdEvent,
	MdHome,
	MdLightMode,
	MdLogout,
	MdMap,
	MdNotes,
	MdNotifications,
	MdOutlineDarkMode,
	MdPerson,
	MdPersonAdd,
	MdPostAdd,
	MdWork,
} from "react-icons/md";

import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";

const Navbar = () => {
	const _accountType = useStore($accountType);
	const _globalTheme = useStore($themeMode);
	const router = useRouter();
	const [navbarContainer] = useAutoAnimate();
	const cacheQueryClient = useQueryClient();
	
	const _currentUser = useStore($accountDetails);
	const _currentHunter = useStore($accountDetails) as IUserHunter;
	const _currentProvisioner = useStore($accountDetails) as IUserProvisioner;

	const getTheme = () => {
		if (typeof window !== "undefined" && window.localStorage) {
			const storedPrefs = window.localStorage.getItem("theme");
			if (typeof storedPrefs === "string") {
				return storedPrefs;
			}

			const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
			if (userMedia.matches) {
				return "dark";
			}
		}

		return "light";
	};

	const toggleTheme = () => {
		if (_globalTheme === "dark") {
			// set to light mode
			$themeMode.set("light");
			document.body.setAttribute("data-theme", "light");
			localStorage.setItem("theme", "light");
		} else {
			// set to dark mode
			$themeMode.set("dark");
			document.body.setAttribute("data-theme", "dark");
			localStorage.setItem("theme", "dark");
		}
	};

	const handleLogOut = async () => {
		toast.loading("Logging out...");

		const { error } = await supabase.auth.signOut();
		if (error) {
			toast.error(error.message);
			toast.dismiss();
			toast.error("Failed to log out");
			return;
		}

		$accountType.set(null);
		$accountDetails.set(null);
		cacheQueryClient.clear();

		toast.dismiss();
		router.push("/login");
	};

	useEffect(() => {
		const localTheme = getTheme();
		if (localTheme) {
			$themeMode.set(localTheme as "light" | "dark");
			document.body.setAttribute("data-theme", localTheme);
		}
	}, []);

	return (
		<>
			<div className="fixed top-0 left-0 py-5 hidden lg:flex justify-between bg-base-100 w-full z-[20] h-auto print:invisible">
				{!(_accountType && _currentUser) && (
					<div className="mx-auto max-w-5xl w-full flex items-center justify-between">
						<Link href="/" className="text-lg font-bold">
							<Image
								alt="logo"
								src="/logo/wicket-new-adaptive.png"
								width={40}
								height={40}
							/>
						</Link>
						<div className="flex gap-1">
							<Link href="/login" className='btn btn-ghost gap-2'>
								<MdPerson className="text-lg" />
								<span>Log In</span>
							</Link>
							<div
								onClick={() => {
									// check if dark mode is enabled
									if (_globalTheme === "dark") {
										// set to light mode
										$themeMode.set("light");
										document.body.setAttribute("data-theme", "light");
										localStorage.setItem("theme", "light");
									} else {
										// set to dark mode
										$themeMode.set("dark");
										document.body.setAttribute("data-theme", "dark");
										localStorage.setItem("theme", "dark");
									}
								}}
								className='btn btn-ghost btn-square gap-2'
							>
								{_globalTheme === "dark" ? (
									<FiSun className="text-lg" />
								) : (
									<FiMoon className="text-lg" />
								)}
							</div>
						</div>
					</div>
				)}
				{_accountType === "hunter" && _currentHunter && (
					<div
						ref={navbarContainer}
						className="mx-auto max-w-5xl w-full flex items-center justify-between"
					>
						<Image
							alt="logo"
							src="/logo/wicket-new-adaptive.png"
							width={40}
							height={40}
						/>
						<div className="flex gap-1">
							<Link
								href="/h/feed"
								className={`btn btn-square ${
									router.pathname.includes("/h/feed")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdHome className="text-lg" />
							</Link>
							<Link
								href="/h/drift"
								className={`btn btn-square ${
									router.pathname.includes("/h/drift")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdMap className="text-lg" />
							</Link>
							<Link
								href="/h/jobs"
								className={`btn btn-square ${
									router.pathname.includes("/h/jobs")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdWork className="text-lg" />
							</Link>
							<Link
								href="/h/events"
								className={`btn btn-square ${
									router.pathname.includes("/h/events")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdEvent className="text-lg" />
							</Link>
						</div>
						<div className="flex gap-2 items-center">
							<p className="font-semibold opacity-75">
								{_currentHunter.full_name.first}{" "}
								{_currentHunter.full_name.last || ""}
							</p>
							<div className="dropdown dropdown-hover dropdown-end">
								<button
									tabIndex={0}
									className={`avatar h-10 w-10 rounded-full justify-center items-center
								${_currentHunter.activeJob && "online"}
								${
									router.pathname.includes("/h/me")
										? "btn-primary"
										: "btn-ghost"
								}`}
								>
									{_currentHunter.avatar_url ? (
										<Image
											alt="avatar"
											src={_currentHunter.avatar_url}
											width={40}
											height={40}
											className="mask mask-circle"
										/>
									) : (
										<MdPerson className="text-lg" />
									)}
								</button>
								<ul className="dropdown-content menu p-3 shadow bg-base-200 rounded-btn w-52">
									<li>
										<p onClick={toggleTheme}>
											{_globalTheme === "dark" ? (
												<MdLightMode className="text-lg" />
											) : (
												<MdDarkMode className="text-lg" />
											)}
											{_globalTheme === "dark" ? "Light Mode" : "Dark Mode"}
										</p>
									</li>
									<li>
										<Link href="/h/me">
											<MdPerson className="text-lg" />
											<span>Go to Profile</span>
										</Link>
									</li>
									<div className="divider" />
									<li>
										<p onClick={handleLogOut} className="text-error">
											<MdLogout className="text-lg" />
											<span>Log Out</span>
										</p>
									</li>
								</ul>
							</div>
						</div>
					</div>
				)}
				{_accountType === "provisioner" && _currentProvisioner && (
					<div
						ref={navbarContainer}
						className="mx-auto max-w-5xl w-full flex items-center justify-between"
					>
						<Image
							alt="logo"
							src="/logo/wicket-new-adaptive.png"
							width={40}
							height={40}
						/>
						<div className="flex gap-1 items-center">
							{_currentProvisioner.is_live && (
								<p className="text-success font-bold mr-5 animate-bounce">
									LIVE
								</p>
							)}
							<Link
								href="/p/dashboard"
								className={`btn btn-square ${
									router.pathname.includes("/p/dashboard")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdDashboard className="text-lg" />
							</Link>
							<Link
								href="/p/blog"
								className={`btn btn-square ${
									router.pathname.includes("/p/blog")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdNotes className="text-lg" />
							</Link>
							<Link
								href="/p/jobs"
								className={`btn btn-square ${
									router.pathname.includes("/p/jobs")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdWork className="text-lg" />
							</Link>

							<div className="dropdown dropdown-hover dropdown-end">
								<button
									tabIndex={0}
									className={`btn btn-square  ${
										router.pathname.includes("/p/me")
											? "btn-primary"
											: "btn-ghost"
									}`}
								>
									<MdPerson className="text-lg" />
								</button>
								<ul className="dropdown-content menu p-3 shadow bg-base-200 rounded-btn w-52">
									<li>
										<p onClick={toggleTheme}>
											{_globalTheme === "dark" ? (
												<MdLightMode className="text-lg" />
											) : (
												<MdDarkMode className="text-lg" />
											)}
											{_globalTheme === "dark" ? "Light Mode" : "Dark Mode"}
										</p>
									</li>
									<li>
										<Link href="/p/me">
											<MdPerson className="text-lg" />
											<span>My Profile</span>
										</Link>
									</li>
									<div className="divider" />
									<li>
										<p onClick={handleLogOut} className="text-error">
											<MdLogout className="text-lg" />
											<span>Log Out</span>
										</p>
									</li>
								</ul>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Navbar;
