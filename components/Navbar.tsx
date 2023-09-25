import { $accountDetails, $accountType, $themeMode } from "@/lib/globalStates";
import { IUserHunter, IUserProvisioner } from "@/lib/types";
import {
	MdCalendarMonth,
	MdDarkMode,
	MdDashboard,
	MdLightMode,
	MdLogout,
	MdMap,
	MdNotes,
	MdPerson,
	MdWork,
} from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

import { supabase } from "@/lib/supabase";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useStore } from "@nanostores/react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { Button } from "./ui/button";

const Navbar = () => {
	const _accountType = useStore($accountType);
	const _globalTheme = useStore($themeMode);
	const router = useRouter();
	const [navbarContainer] = useAutoAnimate();
	const cacheQueryClient = useQueryClient();

	const _currentUser = useStore($accountDetails);
	const _currentHunter = useStore($accountDetails) as IUserHunter;
	const _currentProvisioner = useStore($accountDetails) as IUserProvisioner;

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

	return (
		<>
			<div className="fixed top-0 left-0 py-5 px-3 bg-background flex justify-between sage w-full z-[20] h-auto print:invisible">
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
							<Link href="/login">
								<Button type="button">
									<MdPerson className="text-lg mr-2" />
									<span>Log In</span>
								</Button>
							</Link>
						</div>
					</div>
				)}

				{_accountType === "provisioner" && _currentProvisioner && (
					<div
						ref={navbarContainer}
						className="mx-auto max-w-5xl w-full flex items-center justify-between"
					>
						<Link href="/p/dashboard">
							<Image
								alt="logo"
								src="/logo/wicket-new-adaptive.png"
								width={40}
								height={40}
							/>
						</Link>
						<div className="flex gap-1 items-center">
							{_currentProvisioner.is_live && (
								<p className="text-success font-bold mr-5 animate-bounce">
									LIVE
								</p>
							)}
							<div className="tooltip tooltip-bottom" data-tip="Dashboard">
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
							</div>

							<div className="tooltip tooltip-bottom" data-tip="Blog & Events">
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
							</div>

							<div className="tooltip tooltip-bottom" data-tip="Job Posting">
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
							</div>

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
										<p>
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

				{_accountType === "hunter" && _currentHunter && (
					<div
						ref={navbarContainer}
						className="mx-auto max-w-5xl w-full flex items-center justify-between"
					>
						<Link href="/h/feed">
							<Image
								alt="logo"
								src="/logo/wicket-new-adaptive.png"
								width={40}
								height={40}
							/>
						</Link>
						<div className="flex gap-1 items-center">
							{/* feed */}
							<Tooltip>
								<TooltipTrigger>
									<Link href="/h/feed">
										<Button type="button" variant="ghost" size="icon">
											<MdDashboard className="text-lg" />
										</Button>
									</Link>
								</TooltipTrigger>
								<TooltipContent>Content Feed</TooltipContent>
							</Tooltip>

							{/* companies */}
							<Tooltip>
								<TooltipTrigger>
									<Link href="/h/drift">
										<Button type="button" variant="ghost" size="icon">
											<MdMap className="text-lg" />
										</Button>
									</Link>
								</TooltipTrigger>
								<TooltipContent>Find Companies</TooltipContent>
							</Tooltip>

							{/* jobs */}
							<Tooltip>
								<TooltipTrigger>
									<Link href="/h/jobs">
										<Button type="button" variant="ghost" size="icon">
											<MdWork className="text-lg" />
										</Button>
									</Link>
								</TooltipTrigger>
								<TooltipContent>Find Jobs</TooltipContent>
							</Tooltip>

							{/* events */}
							<Tooltip>
								<TooltipTrigger>
									<Link href="/h/events">
										<Button type="button" variant="ghost" size="icon">
											<MdCalendarMonth className="text-lg" />
										</Button>
									</Link>
								</TooltipTrigger>
								<TooltipContent>Events</TooltipContent>
							</Tooltip>

							{/* profile */}
							<Link href="/h/me" className="ml-2">
								<Avatar>
									<AvatarImage src={_currentHunter.avatar_url} />
									<AvatarFallback>
										<MdPerson className="text-lg" />
									</AvatarFallback>
								</Avatar>
							</Link>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Navbar;
