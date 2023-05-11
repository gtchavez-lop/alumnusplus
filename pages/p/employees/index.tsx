import { IUserProvisioner, TProvJobPost } from "@/lib/types";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { motion } from "framer-motion";
import { useStore } from "@nanostores/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const EmployeesPage = () => {
	const currentProvisioner = useStore($accountDetails) as IUserProvisioner;
	const supabase = useSupabaseClient();

	const fetchAllJob = async () => {
		const { data, error } = await supabase
			.from("public_jobs")
			.select(
				"id,job_title,short_description,job_type,created_at,job_skills,draft",
			)
			.eq("uploader_id", currentProvisioner.id);

		if (error) {
			console.log(error);
			return [] as unknown as TProvJobPost[];
		}

		return data as unknown as TProvJobPost[];
	};

	const fetchAllHunterOnJobId = async (jobId: string) => {};

	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full flex flex-col gap-10 pt-24 pb-36"
			>
				<p className="text-3xl mb-2">Your Employees</p>
			</motion.main>
		</>
	);
};

export default EmployeesPage;