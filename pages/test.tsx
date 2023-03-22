import { FC, useEffect, useState } from "react";

import { NextPage } from "next";
import __web3storage from "@/lib/web3Storage";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const TestPage: NextPage = () => {
	const [activeID, setActiveID] = useState("");

	const [imageUrl, setImageUrl] = useState("");

	const fetchImage = async () => {
		const res = await __web3storage.get(activeID);
		const files = await res?.files();

		if (files) {
			// https://w3s.link/ipfs/bafybeid4gwmvbza257a7rx52bheeplwlaogshu4rgse3eaudfkfm7tx2my/hi-gateway.txt
			const link = `https://w3s.link/ipfs/${activeID}/${
				// replace spaces with %20
				files[0].name.replace(/ /g, "%20")
			}`;

			console.log(link);

			setImageUrl(link);
			// if (files?.length > 0) {
			// }
		}
	};

	useEffect(() => {
		if (activeID) {
			fetchImage();
		}
	}, [activeID]);

	return (
		<>
			<div className="py-24">
				<img src={imageUrl} alt="" />

				<form
					onSubmit={(e) => {
						toast.loading("Uploading to web 3...");
						e.preventDefault();
						const form = e.target as HTMLFormElement;
						const fileInput = form.elements.namedItem(
							"fileInput",
						) as HTMLInputElement;

						if (fileInput.files) {
							const file = fileInput?.files[0];
							if (file) {
								__web3storage
									.put([file])
									.then((cid) => {
										setActiveID(cid);
										toast.dismiss();
										toast.success("Uploaded to web 3!");
									})
									.catch((err) => {
										toast.dismiss();
										toast.error("Error uploading to web 3!");
									});
							} else {
								toast.dismiss();
								toast.error("No file selected!");
							}
						} else {
							toast.dismiss();
							toast.error("No file selected!");
						}

						toast.dismiss();
					}}
					action=""
				>
					<input
						name="fileInput"
						type="file"
						accept="image/png, image/jpeg, image/gif"
						className="file-input file-input-primary"
					/>

					<button type="submit" className="btn btn-primary">
						Upload to web 3
					</button>
				</form>
			</div>
		</>
	);
};

export default TestPage;
