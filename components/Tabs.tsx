import { FC, useState } from "react";

import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

type TabContent = {
	title: string;
	value: string;
};

interface TabComponent {
	tabs: TabContent[];
	activeTab: string;
	onTabChange: (tab: string) => void;
}

const Tabs: FC<TabComponent> = ({ tabs, activeTab, onTabChange }) => {
	const [tabSelected, setTabSelected] = useState<string>(activeTab);

	return (
		<ul className="hidden lg:flex gap-2 justify-center my-4 py-2 rounded-full w-full bg-base-200">
			{tabs.map((tab, index) => (
				<li
					key={`tab-${index}`}
					onClick={() => {
						setTabSelected(tab.value);
						onTabChange(tab.value);
					}}
					className="flex items-center justify-center gap-2 relative px-3 py-1 cursor-pointer"
				>
					<span className="z-10">{tab.title}</span>
					{tabSelected === tab.value && (
						<motion.span
							layoutId="underline"
							className="z-0 absolute w-full h-full inset-0 bg-primary rounded-full"
						/>
					)}
				</li>
			))}
		</ul>
	);
};

export default Tabs;
