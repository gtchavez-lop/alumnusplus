import { FC, useEffect, useRef } from "react";
import { FiArrowDown, FiArrowRight } from "react-icons/fi";

import autoAnimate from "@formkit/auto-animate";

type ComponentProps = {
	children: React.ReactNode;
	tabs: ["feed", "profile", "connections"] | string[];
	activeTab: "feed" | "profile" | "connections";
	setActiveTab: (tab: "feed" | "profile" | "connections") => void;
};
const ProfilePageShell: FC<ComponentProps> = ({
	children,
	tabs = ["feed", "profile", "connections"],
	activeTab,
	setActiveTab,
}) => {
	const contentRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		contentRef.current && autoAnimate(contentRef.current);
	}, [contentRef]);

	return (
		<div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
			<div className="col-span-full lg:col-span-2 sticky top-[90px] h-max z-10">
				{/* mobile top tabs */}
				<ul className="lg:hidden menu menu-horizontal gap-2 w-full bg-base-100 rounded-box rounded-t-none">
					{tabs.map((tab, i) => (
						// rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<li
							className="flex-1 font-semibold"
							onClick={() =>
								setActiveTab(tab as "feed" | "profile" | "connections")
							}
						>
							<p
								className={
									activeTab === tab
										? "text-primary border-primary border-2"
										: "text-primary-content border-2 border-transparent"
								}
							>
								{tab === activeTab && <FiArrowDown />}
								{tab.charAt(0).toUpperCase() + tab.slice(1)}
							</p>
						</li>
					))}
				</ul>

				{/* desktop menu */}
				<ul className="hidden lg:flex menu bg-base-200/50 rounded-box ">
					{tabs.map((tab, i) => (
						// rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<li
							onClick={() =>
								setActiveTab(tab as "feed" | "profile" | "connections")
							}
						>
							<p
								className={
									activeTab === tab ? "text-primary" : "text-primary-content"
								}
							>
								{tab === activeTab && <FiArrowRight />}
								{tab.charAt(0).toUpperCase() + tab.slice(1)}
							</p>
						</li>
					))}
				</ul>
			</div>
			<div ref={contentRef} className="col-span-full lg:col-span-5">
				{/* content */}
				{children}
			</div>
		</div>
	);
};

export default ProfilePageShell;
