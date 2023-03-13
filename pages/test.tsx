import { FormEvent, useState } from "react";
import Rive, { useRive } from "@rive-app/react-canvas";

import GabCVTemplate_1 from "@/components/resume_template/gab_1";
import { NextPage } from "next";

const TestPage: NextPage = () => {
	const { rive: riveLoadingState, RiveComponent: RiveLoadingComponent } =
		useRive({
			src: "/loading_feed.riv",
			autoplay: true,
		});

	return (
		<>
			<div className="h-screen w-full flex flex-col pt-24">
				<div className="w-32 h-32 object-cover">
					<RiveLoadingComponent />
				</div>
			</div>
		</>
	);
};

export default TestPage;
