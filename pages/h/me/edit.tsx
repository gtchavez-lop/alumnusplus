import { AnimPageTransition } from "@/lib/animations";
import { NextPage } from "next";
import { motion } from "framer-motion";

const EditProfilePage: NextPage = () => {
	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				<h1 className="text-4xl font-bold">Edit Your Profile</h1>

				<div className="grid grid-cols-1 md:grid-cols-2">
					<div>
						<label>
							<span>First Name</span>
							<input type="text" />
						</label>
					</div>
				</div>
			</motion.main>
		</>
	);
};

export default EditProfilePage;
