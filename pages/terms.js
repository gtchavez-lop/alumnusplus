import { __PageTransition } from "../lib/animation";
import { motion } from "framer-motion";

const TermsAndConditionsPage = () => {
	return (
		<motion.main
			variants={__PageTransition}
			initial="initial"
			animate="animate"
			exit="exit"
			className="pb-36 lg:pt-24 pt-20 flex flex-col gap-5"
		>
			<h1 className="text-5xl font-bold text-primary mt-32 mb-16">Terms and Conditions</h1>

			<p>
				These terms and conditions (the &quot;Terms&quot;) govern your use of our website, [website URL] (the
				&quot;Site&quot;) and any services offered through the Site (the &quot;Services&quot;). Please read these Terms
				carefully before using the Site or Services. By using the Site or Services, you agree to be bound by these
				Terms. If you do not agree to these Terms, do not use the Site or Services.
			</p>

			<h2 className="text-3xl mt-5">Use of the Site and Services</h2>

			<p>
				You may use the Site and Services only for lawful purposes and in accordance with these Terms. You agree not to
				use the Site or Services:
			</p>

			<ul className="list-disc pl-10">
				<li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
				<li>
					To transmit, or procure the sending of, any advertising or promotional material, including any &quot;junk
					mail,&quot; &quot;chain letter,&quot; &quot;spam,&quot; or any other similar solicitation
				</li>
				<li>
					To impersonate or attempt to impersonate [company name], an employee of [company name], or any other person or
					entity
				</li>
			</ul>

			<h2 className="text-3xl mt-5">Content and Intellectual Property</h2>

			<p>
				The Site and Services may contain content (including, but not limited to, text, graphics, images, and software)
				that is the property of [company name] or its licensors. This content is protected by copyright, trademark, and
				other intellectual property laws. You may not use any content on the Site or Services for any commercial purpose
				without the express written consent of [company name].
			</p>

			<h2 className="text-3xl mt-5">Links to Other Websites</h2>

			<p>
				The Site and Services may contain links to third-party websites or resources. We have no control over the
				content of these websites or resources, and you acknowledge and agree that [company name] is not responsible for
				the availability or accuracy of such websites or resources. You further acknowledge and agree that [company
				name] shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be
				caused by or in connection with the use of or reliance on any such content, goods, or services available on or
				through any such website or resource.
			</p>

			<h2 className="text-3xl mt-5">Disclaimer of Warranties</h2>

			<p>
				The Site and Services are provided on an &quot;as is&quot; and &quot;as available&quot; basis. [company name]
				makes no representations or warranties of any kind, express or implied, as to the operation of the Site or
				Services, or the information, content, materials, or products included on the Site or Services. [company name]
				will not be liable for any damages of any kind arising from the use of the Site or Services, including, but not
				limited to, direct, indirect, incidental, punitive, and consequential damages.
			</p>

			<h2 className="text-3xl mt-5">Governing Law</h2>

			<p>
				These Terms and your use of the Site and Services shall be governed by and construed in accordance with the laws
				of the State of [state], without giving effect to any principles of conflicts of law.
			</p>

			<h2 className="text-3xl mt-5">Changes to These Terms</h2>

			<p>
				We may update these Terms from time to time. We will post any updates on this page, so please check back
				regularly. Your continued use of the Site and Services after any changes to these Terms will be deemed
				acceptance of those changes.
			</p>

			<h2 className="text-3xl mt-5">Contact Us</h2>

			<p>If you have any questions about these Terms, please contact us at [contact information].</p>
		</motion.main>
	);
};

export default TermsAndConditionsPage;
