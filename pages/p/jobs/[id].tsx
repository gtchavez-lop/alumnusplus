import { FC, useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";

import { AnimPageTransition } from "@/lib/animations";
import { FiArrowDown } from "react-icons/fi";
import { GetServerSideProps } from "next";
import { IUserProvisioner } from "@/lib/types";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";

interface JobDetails {
	id: string;
	job_title: string;
	job_location: string;
	short_description: string;
	full_description: string;
	created_at: string;
	job_type: string[];
	uploader_id: IUserProvisioner;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { id } = context.query;

	const { data, error } = await supabase
		.from("public_jobs")
		.select("*,uploader_id(*)")
		.eq("id", id)
		.single();

	return {
		props: {
			jobData: data as unknown as JobDetails,
		},
	};
};

const JobPage: FC<{ jobData: JobDetails }> = ({ jobData }) => {
	const [scrollYValue, setScrollYValue] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			setScrollYValue(window.scrollY);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			<motion.img
				animate={{
					opacity: 0.4 - scrollYValue / 500,
					scale: 1 + scrollYValue / 2000,
				}}
				transition={{ duration: 0, ease: "linear" }}
				className="fixed top-0 left-0 w-full h-full object-cover opacity-40"
				src={`https://picsum.photos/seed/${jobData.id}/3000`}
			/>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full flex flex-col gap-10 pb-24"
			>
				<div className="relative flex flex-col gap-4 min-h-screen justify-center items-center">
					<p className="text-5xl font-bold">{jobData.job_title}</p>
					<p className="">{jobData.job_location}</p>
					<button className="btn btn-primary mt-10 w-full max-w-md">
						Apply for this job
					</button>
					<p className="text-sm opacity-20 lg:hidden">Swipe up to see more</p>
					<FiArrowDown className="absolute bottom-[70px] opacity-0 lg:opacity-100 lg:bottom-10 lg:animate-bounce text-4xl" />
				</div>
				<div className="flex flex-col gap-4 px-4 max-w-xl mx-auto">
					<div className="prose">
						<ReactMarkdown>{jobData.full_description}</ReactMarkdown>
					</div>
					<button className="btn btn-primary mt-10 w-full">
						Apply for this job
					</button>
				</div>
			</motion.main>
		</>
	);
};

export default JobPage;
