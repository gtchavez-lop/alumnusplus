import { FormEvent, useEffect, useRef, useState } from "react";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { IUserHunter } from "@/lib/types";
import { IsNationalId } from "@/lib/id_types";
import { MdWarning } from "react-icons/md";
import Tesseract from "tesseract.js";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useStore } from "@nanostores/react";

const NationalID_RegexFormat = /^[0-9]{4}-[0-9]{4}-[0-9]{4}$-[0-9]{4}$/;

const VerifyIdentity = () => {
	const [loadingValue, setLoadingValue] = useState(0);
	const [mediaStream, setMediaStream] = useState<MediaStream>();
	const [capturedImage, setCapturedImage] = useState<string>();
	const videoRef = useRef<HTMLVideoElement>(null);
	const _currentUser = useStore($accountDetails) as IUserHunter;
	const [tempUserData, setTempUserData] = useState<IUserHunter>(_currentUser);

	// const setupStream = async () => {
	// 	try {
	// 		const userMedia = await navigator.mediaDevices.getUserMedia({
	// 			video: {
	// 				facingMode: "user",
	// 			},
	// 			audio: false,
	// 		});
	// 		setMediaStream(userMedia);
	// 	} catch (error) {
	// 		toast.error(
	// 			"Unable to access camera. Please allow access to your camera.",
	// 		);
	// 		throw error;
	// 	}
	// };

	// const setupCamera = async () => {
	// 	if (!mediaStream) {
	// 		await setupStream();
	// 	} else {
	// 		const currentVid = videoRef.current;
	// 		if (!currentVid) return;

	// 		const video = currentVid;
	// 		if (!video.srcObject) {
	// 			video.srcObject = mediaStream;
	// 		}
	// 	}
	// };

	// // verify identity
	// const verifyIdentity = async () => {
	// 	// convert base64 to image
	// 	const image = new Image() as HTMLImageElement;
	// 	image.src = capturedImage as string;

	// 	// get text from image
	// 	const {
	// 		data: { text },
	// 	} = await Tesseract.recognize(image, "eng", {
	// 		logger: (m) => {
	// 			setLoadingValue(m.progress);
	// 		},
	// 	});

	// 	const result = IsNationalId(text, _currentUser, "hunter");

	// 	console.log(result);
	// };

	// const captureImage = () => {
	// 	const currentVid = videoRef.current;
	// 	if (!currentVid) return;

	// 	const canvas = document.createElement("canvas");
	// 	canvas.width = currentVid.videoWidth;
	// 	canvas.height = currentVid.videoHeight;
	// 	const ctx = canvas.getContext("2d");
	// 	if (!ctx) return;

	// 	ctx.drawImage(currentVid, 0, 0, canvas.width, canvas.height);

	// 	const data = canvas.toDataURL("image/png");
	// 	setCapturedImage(data);
	// 	verifyIdentity();
	// };

	// useEffect(() => {
	// 	setupCamera();
	// }, [mediaStream]);

	const handleFileUpload = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const filInput = form.querySelector(
			"input[type='file']",
		) as HTMLInputElement;
		const button = form.querySelector(
			"button[type='submit']",
		) as HTMLButtonElement;
		const textInput = form.querySelector(
			"input[type='text']",
		) as HTMLInputElement;
		const file = filInput!.files![0];

		// check if all fields are filled
		if (!(file && textInput.value)) {
			toast.error("Please fill all fields.");
			return;
		}

		filInput.disabled = true;
		button.disabled = true;
		textInput.disabled = true;

		const {
			data: { text },
		} = await Tesseract.recognize(file, "eng", {
			logger: (m) => {
				if (m.status === "recognizing text") {
					toast.dismiss();
					toast.loading(
						`Detecting ID Validity ${Math.floor(m.progress * 100)}%`,
						{
							id: "loading",
						},
					);
				} else {
					toast.dismiss();
					toast.loading("Initializing API", {
						id: "loading",
					});
				}
			},
		});

		const res = IsNationalId(text, tempUserData, "hunter");

		toast.dismiss();

		if (res) {
			if (res.isNationalId) {
				toast.success("National ID is valid.");
				toast.loading("Updating account details...");
			} else {
				toast.error("National ID is invalid.");
			}
		} else {
			toast.error("Unable to detect ID.");
		}

		// enable fields
		filInput.disabled = false;
		textInput.disabled = false;
		button.disabled = false;
	};

	return (
		tempUserData &&
		_currentUser && (
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				<h1 className="text-4xl font-bold">Verify Identity</h1>

				{/* add warning as this is a beta feateure */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
					<p className="alert alert-warning justify-center">
						<MdWarning />
						This feature is a work in progress. Please use with caution.
					</p>
					<p className="alert alert-warning justify-center">
						<MdWarning />
						We only accept Philippine National Identity Card in this version.
					</p>
				</div>

				{/* mobile webcam */}
				<div className="hidden flex-col items-center justify-center mt-10 ">
					{!capturedImage && (
						<>
							<select className="select select-primary mb-2">
								<option value="national id">National ID</option>
								<option disabled>UMID (Coming Soon)</option>
								<option disabled>Driver&apos;s License (Coming Soon)</option>
								<option disabled>Passport (Coming Soon)</option>
								<option disabled>Voter&apos;s ID (Coming Soon)</option>
								<option disabled>PhilHealth ID (Coming Soon)</option>
								<option disabled>NBI Clearance (Coming Soon)</option>
								<option disabled>PRC ID (Coming Soon)</option>
							</select>

							<div className="w-96 h-96 bg-base-300 rounded-btn overflow-hidden relative">
								<video
									className="absolute w-full h-full object-center object-cover"
									ref={videoRef}
									autoPlay
									muted
								/>
							</div>

							<button className="btn btn-primary mt-5">Capture</button>
						</>
					)}

					{capturedImage && (
						<>
							<div className="w-96 h-96 bg-base-300 rounded-btn overflow-hidden relative">
								<img
									src={capturedImage}
									alt="Captured Image"
									className="absolute w-full h-full object-center object-cover"
								/>
							</div>

							<p className="text-lg font-bold">Verifying your identity...</p>
						</>
					)}
				</div>

				{/* dekstop file picker  */}
				<form
					onSubmit={handleFileUpload}
					className="grid grid-cols-1 md:grid-cols-2 mt-16 gap-2"
				>
					<label className="flex flex-col">
						<span>Select ID Type</span>
						<select className="select select-primary mb-2">
							<option value="national id">National ID</option>
							<option disabled>UMID (Coming Soon)</option>
							<option disabled>Driver&apos;s License (Coming Soon)</option>
							<option disabled>Passport (Coming Soon)</option>
							<option disabled>Voter&apos;s ID (Coming Soon)</option>
							<option disabled>PhilHealth ID (Coming Soon)</option>
							<option disabled>NBI Clearance (Coming Soon)</option>
							<option disabled>PRC ID (Coming Soon)</option>
						</select>
					</label>
					<label className="flex flex-col">
						<span>Id Number</span>
						<input
							type="text"
							value={tempUserData.id_number}
							onChange={(e) => {
								// format id number
								const idNumber = e.target.value.replace(/[^0-9]/g, "");
								const formattedIdNumber = idNumber.replace(
									/(\d{4})(\d{4})(\d{4})(\d{4})/,
									"$1-$2-$3-$4",
								);
								// limit id number to 19 characters
								if (formattedIdNumber.length > 19) return;

								// set id number
								setTempUserData({
									...tempUserData,
									id_number: formattedIdNumber,
									id_type: "national id",
								});
							}}
							className="input input-primary"
						/>
					</label>
					<label className="flex flex-col">
						<span>Select Image</span>
						<input
							type="file"
							accept="image/*"
							className="file-input file-input-primary"
						/>
					</label>

					<button
						type="submit"
						className="btn btn-primary btn-block mt-2 col-span-full"
					>
						Verify
					</button>
				</form>
				{/* <form
				onSubmit={handleFileUpload}
				className="flex flex-col justify-center mt-10 "
			>
				<input className="file-input file-input-primary" type="file" />
				<button type="submit" className="btn btn-primary btn-block mt-2">
					Verify
				</button>
			</form> */}
			</motion.main>
		)
	);
};

export default VerifyIdentity;
