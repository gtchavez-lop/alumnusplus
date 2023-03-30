import { AnimPageTransition } from "@/lib/animations";
import { NextPage } from "next";
import RegisterHunterSubPage from "@/components/register/hunter";
import RegisterProvisionerSubPage from "@/components/register/provisioner";
import Tabs from "@/components/Tabs";
import { motion } from "framer-motion";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";

type TTab = {
	title: string;
	value: string;
};

const _tabs: TTab[] = [
	{
		title: "Register as Job Seeker",
		value: "hunter",
	},
	{
		title: "Register as Company",
		value: "provisioner",
	},
];

const NewRegistrationPage: NextPage = () => {
	const [activeTab, setActiveTab] = useState(_tabs[0].value);

	const [tabContentRef] = useAutoAnimate();
	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				<Tabs tabs={_tabs} activeTab={activeTab} onTabChange={setActiveTab} />

				<div ref={tabContentRef}>
					{activeTab === "hunter" && <RegisterHunterSubPage />}
					{activeTab === "provisioner" && <RegisterProvisionerSubPage />}
				</div>
			</motion.main>
		</>
	);
};

export default NewRegistrationPage;
