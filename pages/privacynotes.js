import { __PageTransition } from "../lib/animation";
import { motion } from "framer-motion";

const PrivacyNotesPage = () => {
	return (
		<motion.main
			variants={__PageTransition}
			initial="initial"
			animate="animate"
			exit="exit"
			className="pb-36 lg:pt-24 pt-20 flex flex-col gap-5"
		>
			<h1 className="text-5xl font-bold text-primary mt-32 mb-16">Data Privacy Notice</h1>

			<p>
				This data privacy notice explains how Wicket Journeys collects, uses, and shares personal data when you use our
				website, https://www.wicket.vercel.app, and other online services.
			</p>

			<h2 className="text-3xl mt-5">Information We Collect</h2>

			<p>We may collect the following types of personal data from you:</p>

			<ul className="list-disc pl-10">
				<li>Contact information, such as your name, email address, and phone number</li>
				<li>Demographic information, such as your age, gender, and interests</li>
				<li>Technical information, such as your IP address, browser type, and device type</li>
			</ul>

			<h2 className="text-3xl mt-5">How We Use Your Personal Data</h2>

			<p>We may use your personal data for the following purposes:</p>

			<ul className="list-disc pl-10">
				<li>To provide and improve our services</li>
				<li>To communicate with you, such as to send you newsletters or updates</li>
				<li>To personalize your experience on our website</li>
			</ul>

			<h2 className="text-3xl mt-5">Sharing Your Personal Data</h2>

			<p>We may share your personal data with third parties for the following purposes:</p>

			<ul className="list-disc pl-10">
				<li>To service providers who help us provide and improve our services</li>
				<li>To legal or regulatory authorities, as required by law</li>
			</ul>

			<h2 className="text-3xl mt-5">Data Security</h2>

			<p>
				We take reasonable measures to protect your personal data from unauthorized access, use, or disclosure. However,
				no method of transmission over the internet is completely secure, and we cannot guarantee the security of your
				personal data.
			</p>

			<h2 className="text-3xl mt-5">Your Data Privacy Rights</h2>

			<p>You have the following rights with respect to your personal data:</p>

			<ul className="list-disc pl-10">
				<li>The right to access your personal data</li>
				<li>The right to rectify any errors in your personal data</li>
				<li>The right to request the deletion of your personal data</li>
				<li>The right to withdraw your consent to the processing of your personal data</li>
				<li>The right to object to the processing of your personal data</li>
			</ul>

			<p>If you would like to exercise any of these rights, please contact us at [contact information].</p>

			<h2 className="text-3xl mt-5">Changes to This Data Privacy Notice</h2>

			<p>
				We may update this data privacy notice from time to time. We will post any updates on this page, so please check
				back regularly.
			</p>
		</motion.main>
	);
};

export default PrivacyNotesPage;
