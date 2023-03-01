import { NextPage } from "next";

const TestPage: NextPage = () => {
	return (
		<>
			<div className="h-screen w-full flex items-center justify-center">
				<div
					style={{
						maskSize: "100vmin",
						maskRepeat: "no-repeat",
						maskPosition: "center",
						mask: "url(/logo/wicket-new-full-vector.svg)",
					}}
					className="h-96 w-96 bg-contain bg-center bg-no-repeat"
				/>
			</div>
		</>
	);
};

export default TestPage;
