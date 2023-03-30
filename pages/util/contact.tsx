import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";

import { AnimPageTransition } from "@/lib/animations";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FormEvent, useRef, useState } from "react";
import { toast } from "react-hot-toast";

const ContactPage = () => {
	const form = useRef<HTMLFormElement>(null);

	const sendEmail = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.target as HTMLFormElement;

		emailjs
			.sendForm(
				"service_tl8oyb8",
				"template_cnwhbkn",
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
		toast.success("Your Inquiry has been Sent");
	};

	return (
		<>
			<motion.div
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-16 lg:pt-24 pb-36"
			>
				<h1 className="font-bold text-4xl tracking-wide">Contact Us</h1>
				<p className="pt-2">
					Do you have inquiries or suggestions? Fill out the form (below) and
					improve Wicket with us today!
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-16">
					<div className="flex flex-col gap-y-3">
						<div className="inline-flex gap-x-2 items-center">
							<FiPhone className="text-base-content text-2xl" />
							<span>+(63) 949 805 2916</span>
						</div>

						<div className="inline-flex gap-x-2 items-center">
							<FiMail className="text-base-content text-2xl" />
							<span>wicket.journeys@gmail.com</span>
						</div>

						<div className="inline-flex gap-x-2 items-center">
							<FiMapPin className="text-base-content text-2xl" />
							<span>Congressional Rd Ext, Caloocan, Metro Manila</span>
						</div>
					</div>

					<div className="bg-base-200 rounded-btn shadow-lg p-5 px-0 lg:px-5 max-w-xl">
						<form onSubmit={sendEmail} className="flex flex-col space-y-4">
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
								<label className="text-sm  ml-4">Email Address</label>
								<input
									type="email"
									placeholder="johndoe@mail.com"
									className="input input-primary input-bordered"
									name="user_mail"
								/>
							</div>

							<div className="flex flex-col">
								<label className="text-sm  ml-4">Message</label>
								<textarea
									placeholder="Your Message"
									rows={4}
									className="textarea textarea-primary textarea-bordered"
									name="user_msg"
								/>
							</div>

							<button className="btn btn-primary btn-block">
								Send Message
							</button>
						</form>
					</div>
				</div>
			</motion.div>

			<Footer />
		</>
	);
};

export default ContactPage;
