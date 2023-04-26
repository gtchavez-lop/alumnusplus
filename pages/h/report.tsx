import Modal from "@/components/Modal";
import { AnimPageTransition } from "@/lib/animations";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { FormEvent, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { FiUserX, FiX } from "react-icons/fi";

const ReportPage = () => {
	const [showModal, setShowModal] = useState(false);

	const sendEmail = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		if (
			!form.user_name.value ||
			!form.user_mail.value ||
			!form.user_msg.value
		) {
			toast.error("all fields are required");
			return;
		}

		emailjs
			.sendForm(
				"service_4310hrm",
				"template_4j7dmmb",
				form,
				"TJt6Hz9Y176DgEzZZ",
			)
			.then(
				(result) => {
					console.log(result.text);
				},
				(error) => {
					console.log(error.text);
				},
			);
		form.reset();
		setShowModal(false);

		toast.success("Your Report has been Sent");
	};

	return (
		<>
			<button
				onClick={() => setShowModal(!showModal)}
				className="mt-40 btn btn-primary"
			>
				showModal
			</button>
			{showModal && (
				<Modal isVisible={showModal} setIsVisible={setShowModal}>
					<div className="flex justify-between">
						<h3 className="text-3xl font-semibold">Report</h3>
						<button
							className="btn btn-ghost btn-circle"
							type="button"
							onClick={() => setShowModal(!showModal)}
						>
							<FiX />
						</button>
					</div>
					<form onSubmit={sendEmail} className="flex flex-col gap-y-4">
						<div className="flex flex-col">
							<label className="text-sm  ml-4">Name</label>
							<input
								type="text"
								placeholder="John Doe"
								className="input input-primary input-bordered"
								name="user_name"
							/>
						</div>

						<div className="flex flex-col">
							<label className="text-sm  ml-4">Violation</label>
							<input
								type="email"
								placeholder="User's violation"
								className="input input-primary input-bordered"
								name="user_mail"
							/>
						</div>

						<div className="flex flex-col">
							<label className="text-sm  ml-4">Reason</label>
							<textarea
								placeholder="Please tell us the problem"
								rows={4}
								className="textarea textarea-primary textarea-bordered"
								name="user_msg"
							/>
						</div>

						<button className="btn btn-primary btn-block" type="submit">
							Submit
						</button>
					</form>
				</Modal>
			)}
		</>
	);
};

export default ReportPage;
