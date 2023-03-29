import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { AnimPageTransition } from "@/lib/animations";
// import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { MdArrowDownward } from "react-icons/md";
import dynamic from "next/dynamic";

// import Pricing from "@/components/landing/Pricing";

const Pricing = dynamic(() => import("@/components/landing/Pricing"), {
	ssr: false,
});
const Footer = dynamic(() => import("@/components/Footer"), {
	ssr: false,
});

const jobList = [
	"Web Developer",
	"Graphic Designer",
	"Copywriter",
	"Social Media Manager",
	"Video Editor",
	"Content Writer",
	"Mobile App Developer",
	"SEO Specialist",
	"Photographer",
	"UI/UX Designer",
	"Illustrator",
	"Animator",
	"Data Analyst",
	"Virtual Assistant",
	"Marketing Consultant",
	"Project Manager",
	"Transcriptionist",
	"Voice Actor",
	"Online Tutor",
	"Customer Service Representative",
];
const landingWords = ["Provide.", "Hunt.", "Connect."];

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
		}, 1500);

		return () => {
			clearInterval(interval);
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<>
			{/* <motion.div
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
			</motion.div> */}
			{/* bg background */}
			<div
				style={{
					opacity: scrollYValue > 50 ? 0 : 1,
				}}
				className="absolute transition-opacity w-full h-screen inset-0 flex justify-center items-end"
			>
				<motion.div
					animate={{
						background: [
							"radial-gradient(rgba(199,72,95,1) 0%, rgba(199,72,95,0) 70%)",
							"radial-gradient(rgba(51,78,199,1) 0%, rgba(51,78,199,0) 70%)",
							"radial-gradient(rgba(199,157,32,1) 0%, rgba(199,157,32,0) 70%)",
						],
						transition: {
							ease: "linear",
							duration: 5,
							repeat: Infinity,
							repeatType: "mirror",
						},
					}}
					style={{
						background:
							"radial-gradient(rgba(199,72,95,1) 0%, rgba(199,72,95,0) 70%)",
					}}
					className="w-[200vw] h-[200px] opacity-100 -mb-[100px]"
				/>
			</div>

			<motion.div
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative flex flex-col items-center justify-center min-h-screen px-2 -mt-16 lg:mt-0 lg:px-0 "
			>
				<p className="text-center text-7xl font-black flex flex-col lg:flex-row">
					{landingWords.map((word, index) => (
						<motion.span
							key={`word-${index}`}
							className={`
								bg-clip-text text-transparent bg-gradient-to-r
								${index === 0 && "from-pink-500 to-pink-700"}
								${index === 1 && "from-blue-500 to-blue-700"}
								${index === 2 && "from-yellow-500 to-yellow-700"}
							`}
							animate={{
								opacity: [0, 1],
							}}
							transition={{
								duration: 2,
								ease: "circOut",
								delay: index * 1,
							}}
						>
							{word}
						</motion.span>
					))}
				</p>
				{/* <div className="relative w-[500px] h-[75px]">
					<Image
						src="/logo/wicket-new-full-vector.svg"
						className="w-64 fill-primary z-10"
						fill
						alt=""
					/>
				</div> */}
				<p className="text-3xl flex flex-col justify-center w-full text-center mt-5 z-10">
					<span>Job hunting as</span>
					<AnimatePresence mode="wait">
						<motion.span
							initial={{ opacity: 0, x: 10 }}
							animate={{
								opacity: 1,
								x: 0,
								transition: { duration: 0.5, easings: "circIn" },
							}}
							exit={{
								opacity: 0,
								x: -10,
								transition: { duration: 0.5, easings: "circOut" },
							}}
							key={activeJob}
							className="font-bold text-primary w-full"
						>
							{activeJob}?
						</motion.span>
					</AnimatePresence>
				</p>

				<div className="flex justify-center mt-10 w-full z-10">
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
