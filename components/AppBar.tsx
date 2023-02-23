import {
	MdEvent,
	MdHome,
	MdMap,
	MdNotifications,
	MdOutlineEvent,
	MdOutlineMap,
	MdOutlineNotifications,
	MdOutlinePerson,
	MdOutlineWork,
	MdPerson,
	MdPersonAdd,
	MdWork,
} from "react-icons/md";

import { $accountType } from "@/lib/globalStates";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStore } from "@nanostores/react";

const AppBarAnimation = {
	initial: { y: -100, opacity: 0 },
	animate: {
		y: 0,
		opacity: 1,
		transition: { duration: 0.5, easing: "circOut" },
	},
};

const AppBar = () => {
	const _accountType = useStore($accountType);

	return (
		<>
			{_accountType === null && (
				<div className="fixed py-5 flex justify-between items-center w-full z-50 bg-base-100">
					<div className="mx-auto max-w-5xl w-full px-5 flex justify-between items-center">
						<p className="text-lg text-primary font-bold">Wicket</p>
						<div className="flex gap-1">
							<Link href='/register' className='btn btn-primary w-full gap-2'>
								<MdPersonAdd className="text-lg" />
								<span>Sign Up</span>
							</Link>
							<Link href="/login" className='btn btn-secondary w-full gap-2'>
								<MdPerson className="text-lg" />
								<span>Sign In</span>
							</Link>
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
					className="fixed pt-5 flex justify-between items-center bg-base-100 w-full z-50"
				>
					<div className="mx-auto max-w-5xl w-full px-5 flex flex-col justify-center">
						<div className="flex justify-between items-center">
							<p className="text-lg font-bold">Wicket</p>
							<div className="flex items-center gap-1">
								<Link href="/h/notifications" className='btn btn-ghost'>
									<MdNotifications className="text-lg" />
								</Link>
								<Link href="/h/me" className='btn btn-ghost'>
									<MdPerson className="text-lg" />
								</Link>
							</div>
						</div>
						<div className="flex justify-evenly md:justify-center gap-3 py-2 pt-4 w-full">
							<Link href="/h/feed" className='btn btn-ghost w-full'>
								<MdHome className="text-lg" />
							</Link>
							<Link href="/h/drift" className='btn btn-ghost w-full'>
								<MdMap className="text-lg" />
							</Link>
							<Link href='/h/jobs' className='btn btn-ghost w-full'>
								<MdWork className="text-lg" />
							</Link>
							<Link href="/h/events" className='btn btn-ghost w-full'>
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
					className="fixed py-5 flex justify-between items-center bg-base-100 w-full z-50"
				>
					<div className="mx-auto max-w-5xl w-full px-5 flex flex-col justify-center">
						<div className="flex justify-between items-center">
							<p className="text-lg font-bold">Wicket</p>
							<div className="flex items-center gap-1">
								<button className='btn btn-ghost'>
									<MdOutlineNotifications className="text-lg" />
								</button>
								<button className='btn btn-ghost'>
									<MdOutlinePerson className="text-lg" />
								</button>
							</div>
						</div>
						<div className="flex justify-evenly md:justify-center gap-3 py-5 w-full">
							<button className='btn btn-ghost w-full'>
								<MdHome className="text-lg" />
							</button>
							<button className='btn btn-ghost w-full'>
								<MdOutlineWork className="text-lg" />
							</button>
							<button className='btn btn-ghost w-full'>
								<MdOutlineEvent className="text-lg" />
							</button>
						</div>
					</div>
				</motion.div>
			)}
		</>
	);
};

export default AppBar;
