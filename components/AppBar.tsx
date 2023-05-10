import { $accountDetails, $accountType, $themeMode } from "@/lib/globalStates";
import { IUserHunter, IUserProvisioner } from "@/lib/types";
import {
	MdEvent,
	MdHome,
	MdMap,
	MdNotes,
	MdNotifications,
	MdOutlineDarkMode,
	MdOutlineEvent,
	MdOutlineNotifications,
	MdOutlinePerson,
	MdOutlineWork,
	MdPerson,
	MdPersonAdd,
	MdWork,
} from "react-icons/md";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";

const AppBarAnimation = {
	initial: { y: -40, opacity: 0 },
	animate: {
		y: 0,
		opacity: 1,
		transition: { duration: 0.4, easing: "circOut" },
	},
};

const AppBar = () => {
	const _accountType = useStore($accountType);
	const router = useRouter();
	const _globalTheme = useStore($themeMode);

	const _currentUser = useStore($accountDetails);
	const _currentHunter = useStore($accountDetails) as IUserHunter;
	const _currentProvisioner = useStore($accountDetails) as IUserProvisioner;

	return (
		<>
			{!($accountType && _currentUser) && (
				<div className="fixed py-5 flex lg:hidden justify-between items-center w-full z-[20] bg-base-100">
					<div className="mx-auto max-w-5xl w-full px-5 flex justify-between items-center">
						{/* <p className="text-lg text-primary font-bold">Wicket</p> */}
						<Link href="/" className="relative w-8 h-8 md:hidden">
							<Image alt="logo" fill src="/logo/wicket-new-adaptive.png" />
						</Link>
						<Link href="/" className="hidden md:block">
							<Image
								alt="logo"
								width={75}
								height={75}
								src="/logo/wicket-new-full-vector.svg"
							/>
						</Link>
						<div className="flex gap-1">
							{/* <Link href="/register" className='btn btn-primary btn-sm gap-2'>
								<MdPersonAdd className="text-lg" />
							</Link> */}
							<Link href="/login" className='btn btn-ghost btn-sm gap-2'>
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
								className='btn btn-ghost btn-sm gap-2'
							>
								<MdOutlineDarkMode className="text-lg" />
							</div>
						</div>
					</div>
				</div>
			)}
			{/* hunter appbar */}
			{_accountType === "hunter" && _currentHunter && (
				<div className="fixed pt-5 flex lg:hidden justify-between items-center bg-base-100 w-full z-[20] print:invisible">
					<div className="mx-auto max-w-5xl w-full px-5 flex flex-col justify-center">
						<div className="flex justify-between items-center">
							<Link href="/h/feed" className="relative w-9 h-9 lg:hidden">
								<Image alt="logo" fill src="/logo/wicket-new-adaptive.png" />
							</Link>
							<div className="flex items-center gap-1">
								<Link
									href="/h/me"
									className={`btn btn-circle ${
										router.pathname.includes("/h/me")
											? "btn-primary"
											: "btn-ghost"
									}`}
								>
									<MdPerson className="text-lg" />
								</Link>
							</div>
						</div>
						<div className="grid grid-cols-4 py-2 pt-4 w-full gap-1">
							<Link
								href="/h/feed"
								className={`btn btn-sm ${
									router.pathname.includes("/h/feed")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdHome className="text-lg" />
							</Link>
							<Link
								href="/h/drift"
								className={`btn btn-sm ${
									router.pathname.includes("/h/drift")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdMap className="text-lg" />
							</Link>
							<Link
								href='/h/jobs'
								className={`btn btn-sm ${
									router.pathname.includes("/h/jobs")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdWork className="text-lg" />
							</Link>
							<Link
								href="/h/events"
								className={`btn btn-sm  ${
									router.pathname.includes("/h/events")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdEvent className="text-lg" />
							</Link>
						</div>
					</div>
				</div>
			)}
			{/* provisioner appbar */}
			{_accountType === "provisioner" && _currentProvisioner && (
				<div className="fixed py-5 flex lg:hidden justify-between items-center bg-base-100 w-full z-[20]">
					<div className="mx-auto max-w-5xl w-full px-5 flex flex-col justify-center">
						<div className="flex justify-between items-center">
							<Link href="/" className="relative w-7 h-7 md:hidden">
								<Image alt="logo" fill src="/logo/wicket-new-adaptive.png" />
							</Link>
							<div className="flex items-center gap-1">
								{/* <Link
									href={"/p/notifications"}
									className={`btn btn-sm ${
										router.pathname.includes("/p/notifications")
											? "btn-primary"
											: "btn-ghost"
									}`}
								>
									<MdOutlineNotifications className="text-lg" />
								</Link> */}
								<Link
									href={"/p/me"}
									className={`btn btn-sm ${
										router.pathname.includes("/p/me")
											? "btn-primary"
											: "btn-ghost"
									}`}
								>
									<MdOutlinePerson className="text-lg" />
								</Link>
							</div>
						</div>
						<div className="grid grid-cols-3 gap-3 py-5 w-full">
							<Link
								href={"/p/dashboard"}
								className={`btn btn-sm  ${
									router.pathname.includes("/p/dashboard")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdHome className="text-lg" />
							</Link>
							<Link
								href={"/p/blog"}
								className={`btn btn-sm  ${
									router.pathname.includes("/p/blog")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdNotes className="text-lg" />
							</Link>
							<Link
								href={"/p/jobs"}
								className={`btn btn-sm  ${
									router.pathname.includes("/p/jobs")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdOutlineWork className="text-lg" />
							</Link>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default AppBar;
