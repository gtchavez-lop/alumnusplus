import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { AnimPageTransition } from "@/lib/animations";
import { FiArrowDown } from "react-icons/fi";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { MdArrowDownward } from "react-icons/md";
import Pricing from "@/components/landing/Pricing";
import { useRouter } from "next/router";
import { useSession } from "@supabase/auth-helpers-react";

const jobList = [
	"Web Developer",
	"Software Engineer",
	"Frontend Developer",
	"Backend Developer",
	"Fullstack Developer",
	"Mobile Developer",
	"UI/UX Designer",
	"Graphic Designer",
	"Product Designer",
];

const Home = () => {
	const [activeJob, setActiveJob] = useState(jobList[0]);
	const [scrollYValue, setScrollYValue] = useState(0);

	const desktopImg_1 = useRef(null);
	const desktopImg_2 = useRef(null);
	const desktopImg_1_inview = useInView(desktopImg_1, {
		once: true,
		margin: "-200px",
	});
	const desktopImg_2_inview = useInView(desktopImg_2, {
		once: true,
		margin: "-200px",
	});

	useEffect(() => {
		// set scrollYValue to window.scrollY
		const handleScroll = () => {
			setScrollYValue(window.scrollY);
		};

		// add event listener
		window.addEventListener("scroll", handleScroll);

		// set interval for job list
		const interval = setInterval(() => {
			setActiveJob(jobList[Math.floor(Math.random() * jobList.length)]);
		}, 2000);

		return () => {
			clearInterval(interval);
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{
					opacity: 1,
					transition: { duration: 0.5, ease: "circOut" },
				}}
				exit={{ opacity: 0, transition: { duration: 0.2, ease: "circIn" } }}
				className="absolute top-0 left-0 w-full h-full"
			>
				<Image
					src="./mainbg.svg"
					className="absolute w-full min-h-[50vh] top-0 object-contain object-top  opacity-40"
					fill
					alt=""
				/>
			</motion.div>

			<motion.div
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative flex flex-col items-start justify-center min-h-screen px-2 lg:px-0 "
			>
				<Image
					src="/wicket-full.png"
					className="w-64 fill-primary"
					width={200}
					height={200}
					alt=""
				/>
				<p className="text-3xl flex flex-col lg:flex-row lg:justify-center mt-5">
					Job hunting for{" "}
					<span className="text-primary relative">
						<AnimatePresence>
							<motion.span
								key={activeJob}
								initial={{ opacity: 0, y: 20 }}
								animate={{
									opacity: 1,
									y: 0,
									transition: { duration: 0.5, ease: "circOut" },
								}}
								exit={{
									opacity: 0,
									y: -20,
									transition: { duration: 0.5, ease: "circOut" },
								}}
								transition={{ duration: 0.5 }}
								className="absolute top-0 lg:left-2 w-max font-bold text-primary"
							>
								{activeJob}?
							</motion.span>
						</AnimatePresence>
					</span>
				</p>

				<div className=" mt-10 w-full">
					{/* <Link href="/register" className="btn btn-primary w-[250px]">
						Sign up an account
					</Link>
					<Link href="/login" className="btn btn-ghost w-[250px]">
						Sign in your account
					</Link> */}
					<Link className="btn btn-primary w-full max-w-md" href="/login">
						Get started now!
					</Link>
				</div>

				{/* scroll down icon */}
				<motion.div
					animate={{
						y: [-10, 10],
					}}
					transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
					className="absolute bottom-0 w-full flex justify-center py-10"
				>
					<MdArrowDownward
						className={`text-3xl ${
							scrollYValue > 200 && "rotate-180"
						} duration-200`}
					/>
				</motion.div>
			</motion.div>

			<motion.div
				ref={desktopImg_1}
				className="relative grid grid-cols-1 lg:grid-cols-2 place-items-center place-content-center min-h-[50vh] px-2 lg:px-0 pb-16"
			>
				<motion.div
					animate={{
						opacity: desktopImg_1_inview ? 1 : 0,
						x: desktopImg_1_inview ? 0 : 100,
					}}
					transition={{ duration: 0.5, ease: "circOut" }}
					className="flex flex-col items-center lg:items-end justify-center text-center"
				>
					<Image
						src="/landing/Experts-cuate.svg"
						className="w-[500px] h-[300px] lg:hidden"
						alt=""
						width={500}
						height={300}
					/>
					<h4 className="text-2xl font-bold">
						Providing jobs for ordinary people.
					</h4>
					<p className="text-sm opacity-70">
						Today, in every way, I am capable of saying &apos;I can!&apos;
					</p>
				</motion.div>
				<div className="hidden lg:flex flex-col items-end justify-center ">
					<motion.img
						animate={{
							opacity: desktopImg_1_inview ? 1 : 0,
							x: desktopImg_1_inview ? 0 : -100,
						}}
						transition={{ duration: 0.5, ease: "circOut" }}
						src="/landing/Experts-cuate.svg"
						className="w-[500px] h-[500px]"
					/>
				</div>
			</motion.div>

			<motion.div
				ref={desktopImg_2}
				className="relative flex flex-col items-center min-h-[70vh] px-2 lg:px-0 mb-16"
			>
				<h2 className="text-center font-bold text-3xl">Platform Features</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
					<motion.div
						animate={{
							opacity: desktopImg_2_inview ? 1 : 0,
							y: desktopImg_2_inview ? 0 : 40,
						}}
						transition={{ duration: 0.5, ease: "circOut" }}
						className="flex flex-col items-center p-5"
					>
						<Image
							src="/landing/Connecting-teams-cuate.svg"
							className="w-[250px]"
							alt=""
							width={250}
							height={250}
						/>
						<p className="text-xl">Find a suitable work for you</p>
					</motion.div>
					<motion.div
						animate={{
							opacity: desktopImg_2_inview ? 1 : 0,
							y: desktopImg_2_inview ? 0 : 40,
						}}
						transition={{ duration: 0.5, ease: "circOut", delay: 0.2 }}
						className="flex flex-col items-center p-5"
					>
						<Image
							src="/landing/Marketing-cuate.svg"
							className="w-[250px]"
							alt=""
							width={250}
							height={250}
						/>
						<p className="text-xl">Share your activities</p>
					</motion.div>
					<motion.div
						animate={{
							opacity: desktopImg_2_inview ? 1 : 0,
							y: desktopImg_2_inview ? 0 : 40,
						}}
						transition={{ duration: 0.5, ease: "circOut", delay: 0.4 }}
						className="flex flex-col items-center p-5 justify-center col-span-full lg:col-span-1"
					>
						<Image
							src="/landing/Connected-world-cuate.svg"
							className="w-[250px]"
							alt=""
							width={250}
							height={250}
						/>
						<p className="text-xl">Connect to everyone</p>
					</motion.div>
				</div>
			</motion.div>

			<Pricing />

			<motion.div className="relative flex flex-col items-center justify-center min-h-[50vh] px-2 lg:px-0">
				{/* try this app now */}
				<div className="flex flex-col items-center justify-center">
					<h2 className="text-center font-bold text-3xl">
						Start your journey with us
					</h2>
					<p className="text-center text-sm opacity-70">
						Join us now and create your future with us
					</p>

					{/* button */}
					<div className="flex flex-col lg:flex-row lg:justify-center gap-4 lg:items-center mt-16 lg:mt-10">
						<Link href="/register" className="btn btn-primary w-[250px]">
							Sign up an account
						</Link>
						<Link href="/login" className="btn btn-ghost w-[250px]">
							Sign in your account
						</Link>
					</div>
				</div>
			</motion.div>

			<Footer />
		</>
	);
};

export default Home;
