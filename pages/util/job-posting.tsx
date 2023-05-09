import { AnimPageTransition } from "@/lib/animations";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function PostingPage() {
	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				<h1 className="text-4xl font-bold mb-5 text-primary">Job Posting</h1>
				<p className="mt-5 font-bold text-xl text-secondary">
					<strong>Overview:</strong>
				</p>

				<p className="mt-2">
					Choose from a plethora of job opportunities that await you in
					Wicket—from ones that might spark your interest to discover and
					experience new things, to the ones that are tailored and recommended
					just for you based on your currently possessed skills!
				</p>
				<p className="mt-2">
					Interested but not ready to commit just yet? You may also save the job
					posts that grabbed your attention and get back to them at a later time
					(as long as they are available still) when you are feeling more like
					your go-getter self.
				</p>

				<p className="mt-5 font-bold text-xl text-secondary">
					<strong>Filter:</strong>
				</p>

				<p className="mt-2">
					Finding jobs can be overwhelming not just for first-time job seekers,
					but also for those that continue to pursue more than just bill-paying
					jobs.
				</p>
				<p className="mt-2">
					Keep your head cool, your efforts given its deserved acknowledgement,
					and take advantage of Wicket&apos;s job search function. Search for
					the specific job vacancies you deem will serve as a cornerstone to
					your journey towards your goal, save time you might as well spend on
					practicing job interview scenarios, and take that first step (which
					might be a little scary but will definitely be worth the risk)!
				</p>
			</motion.main>
		</>
	);
}
