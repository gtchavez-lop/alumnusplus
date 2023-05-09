import { AnimPageTransition } from "@/lib/animations";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MetaversePage() {
	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				<h1 className="text-4xl font-bold mb-5 text-primary">Metaverse</h1>
				<p className="mt-5 font-bold text-xl text-secondary">
					<strong>Overview:</strong>
				</p>

				<p className="mt-2">
					Immerse yourself inside Wicket&apos;s metaverse—dress (your
					metaverse-self) to impress, explore the different venues selected for
					a scheduled event, seize your moment to appeal to employers during
					initial assessments, and land that job you have always been dreaming
					of!
				</p>
				<p className="mt-2">
					Forget about ruining your perfectly pressed business attires and
					slicked-back hairstyles to hot and humid and, often, sweaty trips to
					job fair venues; or standing in line among long queue of candidates,
					never quite sure if you&apos;ll get your chance before the
					event&apos;s cut-off time; or, even with a slightly lower possibility
					but is for sure the worst of them all, getting lost on your way to the
					venue.
				</p>
				<p className="mt-2">
					Right where you would be most comfortable at, plop down, stretch,
					prepare your note-taking and &qout;taking-care-of-myself&qout; kits,
					and participate in the virtual job fairs and other events happening in
					Wicket&apos;s metaverse (plus you would not even have to ask random
					people where the comfort room is anymore)!
				</p>
			</motion.main>
		</>
	);
}
