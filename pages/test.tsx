import { NextPage } from "next";
import { motion } from "framer-motion";
import { useState } from "react";
import { useStore } from "@nanostores/react";
import { $accountDetails } from "@/lib/globalStates";
import { IUserHunter } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

const TestPage: NextPage = () => {
	return (
		<>
			<div className="py-24">
				<p>asdasdkljasdjkladljkasdkl</p>
			</div>
		</>
	);
};

export default TestPage;
