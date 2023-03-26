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
	const [hoveredTab, setHoveredTab] = useState<string>(activeTab);

	return (
		<ul className="hidden lg:flex gap-2 justify-center my-4 py-2 rounded-btn w-full bg-base-300">
			{tabs.map((tab, index) => (
				<li
					key={`tab-${index}`}
					onMouseEnter={() => setHoveredTab(tab.value)}
					onClick={() => {
						setTabSelected(tab.value);
						onTabChange(tab.value);
					}}
					className="flex items-center justify-center gap-2 relative px-3 py-1 cursor-pointer group"
				>
					<span className="z-10">{tab.title}</span>
					{tabSelected === tab.value && (
						<motion.span
							layoutId="underline"
							className="z-[5] absolute w-full h-full inset-0 bg-primary rounded-btn"
						/>
					)}
					{hoveredTab === tab.value && (
						<motion.span
							layoutId="underline_hover"
							className="z-0 absolute w-full opacity-0 transition-opacity group-hover:opacity-100 h-full inset-0 bg-primary/20 rounded-btn"
						/>
					)}
				</li>
			))}
		</ul>
	);
};

export default Tabs;
