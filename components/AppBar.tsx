import { $accountType, $themeMode } from "@/lib/globalStates";
import {
	MdEvent,
	MdHome,
	MdMap,
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

	return (
		<>
			{_accountType === null && (
				<div className="fixed py-5 flex justify-between items-center w-full z-50 bg-base-100">
					<div className="mx-auto max-w-5xl w-full px-5 flex justify-between items-center">
						<p className="text-lg text-primary font-bold">Wicket</p>
						<div className="flex gap-1">
							<Link href="/register" className='btn btn-primary w-full gap-2'>
								<MdPersonAdd className="text-lg" />
								<span>Sign Up</span>
							</Link>
							<Link href="/login" className='btn btn-ghost w-full gap-2'>
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
								className='btn btn-ghost w-full gap-2'
							>
								<MdOutlineDarkMode className="text-lg" />
							</div>
						</div>
					</div>
				</div>
			)}
			{/* hunter appbar */}
			{_accountType === "hunter" && (
				<motion.div
					variants={AppBarAnimation}
					initial="initial"
					animate="animate"
					className="fixed pt-5 flex lg:hidden justify-between items-center bg-base-100 w-full z-50"
				>
					<div className="mx-auto max-w-5xl w-full px-5 flex flex-col justify-center">
						<div className="flex justify-between items-center">
							<p className="text-lg font-bold">Wicket</p>
							<div className="flex items-center gap-1">
								<Link
									href="/h/notifications"
									className={`btn ${
										router.pathname.includes("/h/notifications")
											? "btn-primary"
											: "btn-ghost"
									}`}
								>
									<MdNotifications className="text-lg" />
								</Link>
								<Link
									href="/h/me"
									className={`btn ${
										router.pathname.includes("/h/me")
											? "btn-primary"
											: "btn-ghost"
									}`}
								>
									<MdPerson className="text-lg" />
								</Link>
							</div>
						</div>
						<div className="flex justify-evenly md:justify-center gap-3 py-2 pt-4 w-full">
							<Link
								href="/h/feed"
								className={`btn ${
									router.pathname.includes("/h/feed")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdHome className="text-lg" />
							</Link>
							<Link
								href="/h/drift"
								className={`btn ${
									router.pathname.includes("/h/drift")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdMap className="text-lg" />
							</Link>
							<Link
								href='/h/jobs'
								className={`btn ${
									router.pathname.includes("/h/jobs")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdWork className="text-lg" />
							</Link>
							<Link
								href="/h/events"
								className={`btn ${
									router.pathname.includes("/h/events")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdEvent className="text-lg" />
							</Link>
						</div>
					</div>
				</motion.div>
			)}
			{/* provisioner appbar */}
			{_accountType === "provisioner" && (
				<motion.div
					variants={AppBarAnimation}
					initial="initial"
					animate="animate"
					className="fixed py-5 flex lg:hidden justify-between items-center bg-base-100 w-full z-50"
				>
					<div className="mx-auto max-w-5xl w-full px-5 flex flex-col justify-center">
						<div className="flex justify-between items-center">
							<p className="text-lg font-bold">Wicket</p>
							<div className="flex items-center gap-1">
								<Link
									href={"/p/notifications"}
									className={`btn ${
										router.pathname.includes("/p/notifications")
											? "btn-primary"
											: "btn-ghost"
									}`}
								>
									<MdOutlineNotifications className="text-lg" />
								</Link>
								<Link
									href={"/p/me"}
									className={`btn ${
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
								className={`btn btn-block ${
									router.pathname.includes("/p/dashboard")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdHome className="text-lg" />
							</Link>
							<Link
								href={"/p/jobs"}
								className={`btn btn-block ${
									router.pathname.includes("/p/jobs")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdOutlineWork className="text-lg" />
							</Link>
							<Link
								href={"/p/events"}
								className={`btn btn-block ${
									router.pathname.includes("/p/events")
										? "btn-primary"
										: "btn-ghost"
								}`}
							>
								<MdOutlineEvent className="text-lg" />
							</Link>
						</div>
					</div>
				</motion.div>
			)}
		</>
	);
};

export default AppBar;
