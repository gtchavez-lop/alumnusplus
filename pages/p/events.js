import ProtectedPageContainer from "@/components/ProtectedPageContainer";
import { __PageTransition } from "../../lib/animation";
import { motion } from "framer-motion";

const EventsPage = () => {
	return (
		<>
			<ProtectedPageContainer>
				<motion.main
					variants={__PageTransition}
					initial="initial"
					animate="animate"
					exit="exit"
					className="relative min-h-screen w-full flex flex-col pt-24 pb-36"
				>
					<h1 className="text-center text-2xl">Events</h1>
					<p className="text-center text-lg font-bold text-warning">
						This page is under construction. Please check back later.
					</p>
				</motion.main>
			</ProtectedPageContainer>
		</>
	);
};

export default EventsPage;
