import { $accountDetails, $accountType, $themeMode } from "@/lib/globalStates";
import {
	MdApps,
	MdDashboard,
	MdEvent,
	MdHome,
	MdMap,
	MdNotes,
	MdNotifications,
	MdOutlineDarkMode,
	MdPerson,
	MdPersonAdd,
	MdPostAdd,
	MdWork,
} from "react-icons/md";

import { IUserHunter } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";

const Navbar = () => {
	const _accountType = useStore($accountType);
	const _globalTheme = useStore($themeMode);
	const router = useRouter();
	const [navbarContainer] = useAutoAnimate();

	const _currentUser = useStore($accountDetails) as IUserHunter;

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
					<div
						// ref={navbarContainer}
						className="mx-auto max-w-5xl w-full flex items-center justify-between"
					>
						<Link href="/" className="text-lg font-bold">
							<Image
								alt="logo"
								src="/logo/wicket-new-adaptive.png"
								width={40}
								height={40}
							/>
						</Link>
						<div className="flex gap-1">
							{/* <Link href="/register" className='btn btn-primary gap-2'>
								<MdPersonAdd className="text-lg" />
								<span>Sign Up</span>
							</Link> */}
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
								<MdOutlineDarkMode className="text-lg" />
							</div>
						</div>
					</div>
				)}
				{_accountType === "hunter" && _currentUser && (
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
							{/* <div className="dropdown dropdown-end dropdown-hover hidden">
								<Link
									href="/h/notifications"
									tabIndex={0}
									className={`btn btn-square  ${
										router.pathname.includes("/h/notifications")
											? "btn-primary"
											: "btn-ghost"
									}`}
								>
									<MdNotifications className="text-lg" />
								</Link>
								<ul
									tabIndex={0}
									className="dropdown-content menu p-4 shadow-lg bg-base-200 rounded-btn btn-square w-[400px] gap-1 mt-1"
								>
									<li className="mb-2 text-lg font-bold">Notifications</li>
									{Array(5)
										.fill("placeholder")
										.map((_, i) => (
											<li key={`notifskeleton_${i}`}>
												<p
													style={{ animationDelay: `${i * 100}ms` }}
													className="bg-zinc-500 bg-opacity-40 animate-pulse text-transparent"
												>
													Placeholder notification
												</p>
											</li>
										))}
									<li className="self-center text-center w-full">
										<Link href="/h/notifications" className="text-center">
											See all notifications
										</Link>
									</li>
								</ul>
							</div> */}
							<p className="font-semibold opacity-75">
								{_currentUser.full_name.first} {_currentUser.full_name.last}
							</p>
							<Link
								href="/h/me"
								className={`btn btn-circle ${
									router.pathname.includes("/h/me")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								{_currentUser.avatar_url ? (
									<Image
										alt="avatar"
										src={_currentUser.avatar_url}
										width={40}
										height={40}
										className="rounded-full"
									/>
								) : (
									<MdPerson className="text-lg" />
								)}
							</Link>
						</div>
					</div>
				)}
				{_accountType === "provisioner" && _currentUser && (
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
								href="/p/dashboard"
								className={`btn ${
									router.pathname.includes("/p/dashboard")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdDashboard className="text-lg" />
							</Link>
							<Link
								href="/p/blog"
								className={`btn ${
									router.pathname.includes("/p/blog")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdNotes className="text-lg" />
							</Link>
							<Link
								href="/p/jobs"
								className={`btn ${
									router.pathname.includes("/p/jobs")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdWork className="text-lg" />
							</Link>
							<Link
								href="/p/me"
								className={`btn ${
									router.pathname.includes("/p/me")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdPerson className="text-lg" />
							</Link>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Navbar;
