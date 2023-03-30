import { AnimPageTransition } from "@/lib/animations";
import Footer from "@/components/Footer";
import Image from "next/image";
import { NextPage } from "next";
import { motion } from "framer-motion";

const thePeople = [
	{
		name: "Gabbie",
		img: "/profile/gab.jpg",
		position: "Project Manager",
	},
	{
		name: "Gerald",
		img: "/profile/gerald.jpg",
		position: "Principal Engineer (Wicket)",
	},
	{
		name: "Edz",
		img: "/profile/edz.jpg",
		position: "Principal Engineer (Metaverse)",
	},
	{
		name: "Carlo",
		img: "/profile/carlo.jpg",
		position: "Front-end Developer",
	},
	{
		name: "Trizha",
		img: "/profile/trizh.jpg",
		position: "Writer",
	},
	{
		name: "Kevin",
		img: "/profile/kevin.jpg",
		position: "UI/UX Designer",
	},
	{
		name: "Novie",
		img: "/profile/novie.jpg",
		position: "UI/UX Designer",
	},
	{
		name: "Jaymar",
		img: "/profile/jaymar.jpg",
		position: "Front-end Developer",
	},
	{
		name: "Efrhaim",
		img: "https://api.dicebear.com/5.x/lorelei-neutral/png?seed=Efrhaim",
		position: "Writer",
	},
	{
		name: "Lloyd",
		img: "/profile/lloyd.jpg",
		position: "Meta Developer",
	},
	{
		name: "Jaypee",
		img: "https://api.dicebear.com/5.x/lorelei-neutral/png?seed=Jaypee",
		position: "Multimedia Manager",
	},
	{
		name: "Miks",
		img: "/profile/miks.jpg",
		position: "Front-end Developer",
	},
];

const AboutPage: NextPage = () => {
	return (
		<>
			<motion.div
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-16 lg:pt-24 pb-36"
			>
				<div className="flex flex-col lg:flex-row justify-between gap-8">
					<div className="w-full lg:w-5/12 flex flex-col justify-center">
						<h1 className="text-3xl lg:text-4xl font-bold leading-9 text-primary pb-4">
							About Us
						</h1>
						<p className="font-normal text-base leading-6 text-base-content ">
							Come on in and discover what opportunities await you at Wicket—a
							progressive web career platform for Hunters and Provisioners (in
							Metro Manila). By establishing a platform where job providers and
							job seekers can interact with each other, Wicket aims to help the
							steady increase of the employment rate in the Philippines.
						</p>
					</div>
					<div className="w-full lg:w-8/12 relative">
						<Image
							className="w-full h-full object-cover rounded-btn"
							src="/profile/our-team.jpg"
							alt="A group of People"
							fill
						/>
					</div>
				</div>

				<div className="flex lg:flex-row flex-col justify-between gap-8 pt-12">
					<div className="w-full lg:w-5/12 flex flex-col justify-center">
						<h1 className="text-3xl lg:text-4xl font-bold leading-9 text-primary pb-4">
							Our Story
						</h1>
						<p className="font-normal text-base leading-6 text-base-content ">
							Wicket is developed by Wicket Journeys - a band of college
							students (from UCC) running on caffeine-injected three-hour
							sleeps, dreams of making it to the end of the semester, and hopes
							of alleviating employment issues in (Metro Manila/ the
							Philippines).
						</p>
					</div>
					<div className="w-full lg:w-8/12 lg:pt-8">
						<div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-2 lg:gap-2">
							{thePeople.map((person, key: number) => (
								<div
									key={`person-${key + 1}`}
									className="p-4 pb-6 flex justify-center flex-col items-center"
								>
									<Image
										className="md:block hidden object-cover object-center w-[100px] h-[100px] rounded-full"
										src={person.img}
										alt={person.name}
										width={100}
										height={100}
									/>
									<Image
										className="md:hidden block object-cover object-center w-[100px] h-[100px] rounded-full"
										src={person.img}
										alt={person.name}
										width={100}
										height={100}
									/>
									<p className="font-medium text-xl leading-5 mt-4 text-center">
										{person.name}
										<br />
										<span className="font-normal leading-none opacity-50 text-xs">
											{person.position}
										</span>
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</motion.div>
			<Footer />
		</>
	);
};

export default AboutPage;
