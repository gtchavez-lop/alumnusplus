import { FormEvent, useEffect, useRef, useState } from "react";

import { $accountDetails } from "@/lib/globalStates";
import { AnimPageTransition } from "@/lib/animations";
import { IUserHunter } from "@/lib/types";
import { IsNationalId } from "@/lib/id_types";
import { MdWarning } from "react-icons/md";
import Tesseract from "tesseract.js";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useStore } from "@nanostores/react";

const NationalID_RegexFormat = /[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}/g;
const DriverLicense_RegexFormat = /^[A-Z][0-9]{2}-[0-9]{2}-[0-9]{6}$/g;

const VerifyIdentity = () => {
	const [loadingValue, setLoadingValue] = useState(0);
	const [mediaStream, setMediaStream] = useState<MediaStream>();
	const [capturedImage, setCapturedImage] = useState<string>();
	const videoRef = useRef<HTMLVideoElement>(null);
	const _currentUser = useStore($accountDetails) as IUserHunter;
	const [tempUserData, setTempUserData] = useState<IUserHunter>(_currentUser);
	const router = useRouter();
	const [selectedIDType, setSelectedIDType] = useState<
		"national id" | "passport" | "driver's license"
	>("national id");

	const formatIdNumber = (
		input: string,
		idType: "national id" | "passport" | "driver's license",
	) => {
		return input;
	};

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

				const { error } = await supabase
					.from("user_hunters")
					.update({
						id_type: "national id" as
							| "national id"
							| "passport"
							| "driver's license"
							| "other",
						id_number: textInput.value,
						is_verified: true,
					})
					.eq("id", _currentUser.id);

				if (error) {
					toast.dismiss();
					toast.error(error.message);
					filInput.disabled = false;
					textInput.disabled = false;
					button.disabled = false;
					return;
				}

				toast.dismiss();
				toast.success("Account details updated.");
				router.push("/h/me");
			} else {
				toast.dismiss();
				toast.error("National ID is invalid.");
				filInput.disabled = false;
				textInput.disabled = false;
				button.disabled = false;
				return;
			}
		} else {
			toast.error("Unable to detect ID.");
			filInput.disabled = false;
			textInput.disabled = false;
			button.disabled = false;
			return;
		}
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
				<p className="alert alert-warning justify-start mt-3">
					<MdWarning className="text-xl" />
					<span>
						This feature is a work in progress. Some features may not work or
						may be replaced in the future
					</span>
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
					{/* <p className="alert alert-warning justify-center">
						<MdWarning />
						We only accept Philippine National Identity Card in this version.
					</p> */}
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
						<select
							disabled={_currentUser.is_verified}
							className="select select-primary mb-2"
						>
							<option value="national id">National ID</option>
							<option value="driver's license">Driver&apos;s License</option>
							<option disabled>UMID (Coming Soon)</option>
							<option disabled>Passport (Coming Soon)</option>
							<option disabled>Voter&apos;s ID (Coming Soon)</option>
							<option disabled>PhilHealth ID (Coming Soon)</option>
							<option disabled>NBI Clearance (Coming Soon)</option>
							<option disabled>PRC ID (Coming Soon)</option>
						</select>
					</label>
					<label className="flex flex-col">
						<span>ID Number</span>
						<input
							placeholder={
								selectedIDType === "national id"
									? "0000-0000-0000-0000"
									: selectedIDType === "driver's license"
										? "A00000000-0000000-0000000"
										: "0000-0000-0000-0000"
							}
							disabled={_currentUser.is_verified}
							type="text"
							value={tempUserData.id_number}
							onChange={(e) => {
								let formattedIdNumber = e.target.value;
								console.log(
									"driver's license",
									DriverLicense_RegexFormat.test(e.target.value),
								);

								if (selectedIDType === "national id") {
									formattedIdNumber = e.target.value.replace(
										NationalID_RegexFormat,
										"$1-$2-$3-$4",
									);
								}

								if (selectedIDType === "driver's license") {
									// formattedIdNumber = e.target.value.replace(
									// 	/[A-Za-z][0-9]+-[0-9]+-[0-9]+/,
									// 	"$1-$2-$3",
									// );
								}

								// set id number
								setTempUserData({
									...tempUserData,
									id_number: formattedIdNumber,
									id_type: selectedIDType,
								});
							}}
							className="input input-primary"
						/>
					</label>
					<label className="flex flex-col">
						<span>Select Image</span>
						<input
							disabled={_currentUser.is_verified}
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
