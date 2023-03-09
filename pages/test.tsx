import { FormEvent, useState } from "react";

import { $accountDetails } from "@/lib/globalStates";
import { IUserHunter } from "@/lib/types";
import { IsNationalId } from "@/lib/id_types";
import { NextPage } from "next";
import Tesseract from "tesseract.js";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { useStore } from "@nanostores/react";

const TestPage: NextPage = () => {
	const [progress, setProgress] = useState(0);
	const [text, setText] = useState("");
	const _currentUser = useStore($accountDetails) as IUserHunter;

	const checkOCR = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setProgress(0);
		const input = e.currentTarget[0] as HTMLInputElement;
		const file = input.files[0];

		// check if file is empty
		if (!file) return;

		toast.loading("Loading...");

		const {
			data: { text },
		} = await Tesseract.recognize(file, "eng", {
			logger: (m) => setProgress(m.progress * 100),
		});

		setText(text.toLowerCase());

		const res = IsNationalId(text, _currentUser, "hunter");

		toast.dismiss();
		if (res?.errorMessage === "" || res?.isNationalId) {
			toast.success("Success");
		} else {
			toast.error("Failed");
		}

		setProgress(100);
	};

	return (
		<>
			<div className="h-screen w-full flex flex-col pt-24">
				<progress
					className="progress progress-primary"
					value={progress}
					max={100}
				/>
				<form onSubmit={checkOCR} className="flex flex-col">
					<input
						type="file"
						accept="image/*"
						className="file-input w-full max-w-xs"
					/>
					<button type="submit" className="btn btn-primary">
						Submit
					</button>
				</form>
			</div>
		</>
	);
};

export default TestPage;
