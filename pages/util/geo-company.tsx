import { AnimPageTransition } from "@/lib/animations";
import { motion } from "framer-motion";
import Link from "next/link";

export default function GeoCompanyPage() {
	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				<h1 className="text-4xl font-bold mb-5 text-primary">
					Geo-Company Hunting
				</h1>
				<p className="mt-5 font-bold text-xl text-secondary">
					<strong>Overview:</strong>
				</p>

				<p className="mt-2">
					&qout;Find jobs wherever you are!&qout; has never been so true until
					Wicket&apos;s company finder—Drift!
				</p>
				<p className="mt-2">
					Drift uses geolocation technology to match and recommend companies to
					a Hunter based on their approximate location proximity. Get to know
					businesses near you and be updated on upcoming job opportunities with
					Wicket&apos;s Drift.
				</p>
			</motion.main>
		</>
	);
}
