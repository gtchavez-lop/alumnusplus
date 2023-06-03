import { $HunterAccountData, $SolidHunterAccountData } from "@/lib/globalstore";
import { FC, FormEvent, MouseEvent, useEffect, useState } from "react";
import { FiArrowDown, FiArrowRight, FiMenu } from "react-icons/fi";

import $supabase from "@/lib/supabase";
import Cities from "@/lib/cities.json";
import Fuse from "fuse.js";
import { IUserHunter } from "@/lib/types";
import Link from "next/link";
import PersonalTab from "./SubTab_Personal";
import Skills from "@/lib/skills.json";
import { useRouter } from "next/router";

type TabProfileProps = {};
const TabProfile: FC<TabProfileProps> = () => {
	const tabs = ["personal", "education", "experiences",];
	const [activeTab, setActiveTab] = useState<
		"personal" | "education" | "experiences"
	>("personal");

	return (
		<div className="flex flex-col gap-2">
			{/* title */}
			<div className="flex items-center gap-2 z-10">
				<div className="dropdown">
					<label tabIndex={0} className="btn btn-primary btn-square">
						<FiMenu className="text-lg" />
					</label>
					<ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
						{tabs.map(item => (
							// rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
							<li onClick={() => setActiveTab(item as "personal" | "education" | "experiences")}>
								<p className="capitalize">{item}</p>
							</li>
						))}
					</ul>
				</div>
				<h2 className="capitalize text-xl font-bold">{activeTab}</h2>
			</div>

			{/* content */}
			<div className="mt-5">
				{activeTab === "personal" && <PersonalTab />}
			</div>
		</div>
	);
};

export default TabProfile;
