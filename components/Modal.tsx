import { FC, useState } from "react";

import { motion } from "framer-motion";

interface Props {
	children: React.ReactNode;
	// onClick?: () => void;
	isVisible?: boolean;
	setIsVisible?: (value: boolean) => void;
}

const Modal: FC<Props> = (props) => (
	<>
		{/* overlay */}
		<motion.div
			initial={{ opacity: 0 }}
			animate={{
				opacity: 1,
				transition: { duration: 0.2, easings: "circOut" },
			}}
			onClick={(e) => {
				// only close modal if the overlay is clicked
				if (e.target === e.currentTarget) {
					// trigger this block if setIsVisible is defined
					if (props.setIsVisible) {
						props.setIsVisible(false);
					}
				}
			}}
			className="fixed z-50 inset-0 w-full h-screen bg-base-100/75 flex justify-center lg:items-center items-end "
		>
			{/* bottom modal */}
			<div className="lg:hidden">
				<motion.div
					initial={{ opacity: 0, translateY: 100 }}
					animate={{
						opacity: 1,
						translateY: 0,
						transition: { duration: 0.2, easings: "circOut", delay: 0.2 },
					}}
					className="flex flex-col gap-10 bg-base-200 w-screen max-w-xl pt-10 pb-16 px-5 rounded-btn rounded-b-none"
				>
					{/* slot */}
					{props.children}
				</motion.div>
			</div>
			<div className="hidden lg:block">
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{
						opacity: 1,
						scale: 1,
						transition: { duration: 0.2, easings: "circOut", delay: 0.1 },
					}}
					className="flex flex-col gap-10 bg-base-200 w-screen max-w-xl py-6 px-7 rounded-btn rounded-b-none"
				>
					{/* slot */}
					{props.children}
				</motion.div>
			</div>
		</motion.div>
	</>
);

export default Modal;
