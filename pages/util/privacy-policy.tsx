import { AnimPageTransition } from "@/lib/animations";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				<>
					<h1 className="text-4xl font-bold mb-5">Privacy Notice for Wicket</h1>

					<p>
						This privacy notice for Wicket Journeys (&quot;Company&quot;,
						&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), describes how
						and why we might collect, store, use, and/or share
						(&quot;process&quot;) your information when you use our services
						(&quot;Services&quot;), such as when you:
					</p>

					<p className="mt-5 font-bold text-xl text-primary">
						<strong>Summary Key Points</strong>
					</p>
					<p>
						This summary provides key points from our privacy notice, but you
						can find out more details about any of these topics by clicking the
						link following each key point or by using our table of contents
						below to find the section you are looking for. You can also click{" "}
						<Link
							href={"#table_of_contents"}
							className="link link-hover link-error"
						>
							here
						</Link>{" "}
						to go directly to our table of contents.
					</p>
					<p className="mt-5 font-bold text-xl text-primary">
						What personal information do we process?
					</p>
					<p>
						When you visit, use, or navigate our Services, we may process
						personal information depending on how you interact with Wicket
						Journeys and the Services, the choices you make, and the products
						and features you use. Click{" "}
						<Link
							href={"#process_information"}
							className="link link-hover link-error"
						>
							here
						</Link>{" "}
						to learn more.
					</p>

					<p className="mt-5 font-bold text-xl text-primary">
						Do we process any sensitive personal information?
					</p>
					<p>
						We may process sensitive personal information when necessary, with
						your consent or as otherwise permitted by applicable law. Click{" "}
						<Link
							href={"#personal_information"}
							className="link link-hover link-error"
						>
							here
						</Link>{" "}
						to learn more.
					</p>

					<p className="mt-5 font-bold text-xl text-primary">
						Do we receive any information from third parties?
					</p>
					<p>We do not receive any information from third parties.</p>

					<p className="mt-5 font-bold text-xl text-primary">
						How do we process your information?
					</p>
					<p>
						We process your information to provide, improve, and administer our
						Services, communicate with you, for security and fraud prevention,
						and to comply with the law. We may also process your information for
						other purposes, with your consent. We process your information only
						when we have a valid legal reason to do so.
					</p>

					<p className="mt-5 font-bold text-xl text-primary">
						In what situations and with which parties do we share personal
						information?
					</p>
					<p>
						We may share information in specific situations and with specific
						third parties.
					</p>

					<p className="mt-5 font-bold text-xl text-primary">
						How do we keep your information safe?
					</p>
					<p>
						We have organizational and technical processes and procedures in
						place to protect your personal information. However, no electronic
						transmission over the internet or information storage technology can
						be guaranteed to be 100% secure, so we cannot promise or guarantee
						that hackers, cybercriminals, or other unauthorized third parties
						will not be able to defeat our security and improperly collect,
						access, steal, or modify your information.
					</p>

					<p className="mt-5 font-bold text-xl text-primary">
						What are your rights?
					</p>
					<p>
						Depending on where you are located geographically, the applicable
						privacy law may mean you have certain rights regarding your personal
						information.
					</p>

					<p className="mt-5 font-bold text-xl text-primary">
						How do you exercise your rights?
					</p>
					<p>
						The easiest way to exercise your rights is by filling out our data
						subject request form available here:{" "}
						<Link
							href={"https://www.wicket.vercel.app/contact"}
							className="link link-hover link-error"
						>
							https://www.wicket.vercel.app/contact
						</Link>
						, or by contacting us. We will consider and act upon any request in
						accordance with applicable data protection laws.
					</p>

					<p className="mt-5 font-bold text-xl text-primary">
						Want to learn more about what Wicket Journeys does with any
						information we collect?
					</p>
					<p>Proceed below to review the notice in full.</p>

					<p className="mt-5 text-3xl font-bold mb-5" id="table_of_contents">
						Table of Contents
					</p>

					<ol type="1" className="pl-8 list-decimal">
						<li>WHAT INFORMATION DO WE COLLECT?</li>
						<li>HOW DO WE PROCESS YOUR INFORMATION?</li>
						<li>WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</li>
						<li>WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?</li>
						<li>DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</li>
						<li>HOW DO WE HANDLE YOUR SOCIAL LOGINS?</li>
						<li>HOW LONG DO WE KEEP YOUR INFORMATION?</li>
						<li>HOW DO WE KEEP YOUR INFORMATION SAFE?</li>
						<li>DO WE COLLECT INFORMATION FROM MINORS?</li>
						<li>WHAT ARE YOUR PRIVACY RIGHTS?</li>
						<li>CONTROLS FOR DO-NOT-TRACK FEATURES</li>
						<li>DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</li>
						<li>DO WE MAKE UPDATES TO THIS NOTICE?</li>
						<li>HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</li>
						<li>
							HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
							YOU?
						</li>
					</ol>

					<p className="mt-5 font-bold text-xl text-primary">
						<strong>What Information Do We Collect?</strong>
					</p>
					<p>
						<b>In Short:</b> We collect personal information that you provide to
						us.
					</p>

					<p className="mt-2">
						We collect personal information that you voluntarily provide to us
						when you register on the Services, express an interest in obtaining
						information about us or our products and Services when you
						participate in activities on the Services, or otherwise when you
						contact us.
					</p>
					<p className="mt-2">
						<b className="underline">Personal Information Provided by You.</b>{" "}
						The personal information that we collect depends on the context of
						your interactions with us and the Services, the choices you make,
						and the products and features you use. The personal information we
						collect may include the following:
					</p>

					<ul className="list-disc mt-2 pl-8">
						<li>Names</li>
						<li>Phone Numbers</li>
						<li>Email Addresses</li>
						<li>Mailing Addresses</li>
						<li>Job Titles</li>
						<li>Usernames</li>
						<li>Passwords</li>
						<li>Contact or Authentication Data</li>
						<li>Debit/Credit Card Numbers</li>
						<li>Names</li>
					</ul>

					<p className="mt-2">
						<b className="underline">Sensitive Information.</b> When necessary,
						with your consent or as otherwise permitted by applicable law, we
						process the following categories of sensitive information:
					</p>

					<ul className="list-disc mt-2 pl-8">
						<li>Data about a person&apos;s sex life or sexual orientation</li>
						<li>Student Data</li>
						<li>Social Security Numbers or other government identifiers</li>
					</ul>

					<p className="mt-2">
						<b className="underline">Social Media Login Data.</b> We may provide
						you with the option to register with us using your existing social
						media account details, like your Facebook, Twitter, or other social
						media accounts.
					</p>
					<p>
						If you choose to register in this way, we will collect the
						information described in the section called “HOW DO WE HANDLE YOUR
						SOCIAL LOGINS?” below.
					</p>

					<p className="mt-2">
						<b>Application Data.</b> If you use our application/s, we also may
						collect the following information if you choose to provide us with
						access or permission:
					</p>

					<ul className="list-disc mt-2 pl-8">
						<li className="mt-2">
							<b>Geolocation Information.</b> We may request access or
							permission to track location-based information from your mobile
							device, either continuously or while you are using our mobile
							application/s, to provide certain location-based services. If you
							wish to change our access or permissions, you may do so in your
							device&apos;s settings.
						</li>
						<li className="mt-2">
							<b>Mobile Device Access.</b> We may request access or permission
							to certain features from your mobile device, including your mobile
							&apos;s microphone, camera, social media accounts, storage,
							calendar, gallery, and other features. If you wish to change our
							access or permissions, you may do so in your device&apos;s
							settings.
						</li>
						<li className="mt-2">
							<b>Mobile Device Data.</b> We automatically collect device
							information (such as your mobile device ID, model, and
							manufacturer), operating system, version information and system
							configuration information, device and application identification
							numbers, browser type and version, hardware model Internet service
							provider and/or mobile carrier, and Internet Protocol (IP) address
							(or proxy server).{" "}
							<p>
								If you are using our application/s, we may also collect
								information about the phone network associated with your mobile
								device, your mobile device&apos;s operating system or platform,
								the type of mobile device you use, your mobile device&apos;s
								unique device ID, and information about the features of our
								application/s you accessed.
							</p>
						</li>
						<li className="mt-2">
							<b>Push Notifications.</b> We may request to send you push
							notifications regarding your account or certain features of the
							application/s. If you wish to opt-out from receiving these types
							of communications, you may turn them off in your device&apos;s
							settings.
						</li>
					</ul>
					<p className="mt-2">
						This information is primarily needed to maintain the security and
						operation of our application/s, for troubleshooting, and for our
						internal analytics and reporting purposes.
					</p>

					<p className="mt-2">
						All personal information that you provide to us must be true,
						complete, and accurate, and you must notify us of any changes to
						such personal information.
					</p>

					<p className="mt-2">
						We automatically collect certain information when you visit, use, or
						navigate our Services. This information does not reveal your
						specific identity (like your name or contact information) but may
						include device and usage information, such as your IP address,
						browser and device characteristics, operating system, language
						preferences, referring URLs, device name, country, location,
						information about how and when you use our Services, and other
						technical information. This information is primarily needed to
						maintain the security and operation of our Services, and for our
						internal analytics and reporting purposes.
					</p>

					<p className="mt-2">
						Like many businesses, we also collect information through cookies
						and similar technologies. The information we collect includes:
					</p>

					<ul className="list-disc mt-2 pl-8">
						<li className="mt-2">
							<b>Log and Usage Data.</b> Log and usage data are service-related.
							Our servers automatically collect diagnostic, usage, and
							performance information when you access or use our Services and
							which we record in our log files. Depending on how you interact
							with us, this log data may include your IP address, device
							information, browser type, and settings and information about your
							activity in the Services (such as the date/time stamps associated
							with your usage, pages and files viewed, searches, and other
							actions you take such as which features you use), device event
							information (such as system activity, error reports (sometimes
							called “crash dumps”), and hardware settings).
						</li>
						<li className="mt-2">
							<b>Device Data.</b> We collect device data such as information
							about your computer, phone, tablet, or other devices you use to
							access the Services. Depending on the device used, this device
							data may include information such as your IP address (or proxy
							server), device and application identification numbers, location,
							browser type, hardware model, Internet service provider and/or
							mobile carrier, operating system, and system configuration
							information.
						</li>
						<li className="mt-2">
							<b>Location Data.</b> We collect location data such as information
							about your device&apos;s location which can be either precise or
							imprecise. How much information we collect depends on the type and
							settings of the device you use to access the Services. For
							example, we may use GPS and other technologies to collect
							geolocation data that tells us your current location (based on
							your IP address). You can opt out of allowing us to collect this
							information either by refusing access to the information or by
							disabling your Location setting on your device. However, if you
							choose to opt-out, you may not be able to use certain aspects of
							the Services.
						</li>
					</ul>

					<p
						className="mt-5 font-bold text-xl text-primary"
						id="process_information"
					>
						<strong>How Do We Process Your Information?</strong>
					</p>

					<p>
						<b>In Short:</b> We process your information to provide, improve,
						and administer our Services to communicate with you, for security
						and fraud prevention, and to comply with the law. We may also
						process your information for other purposes with your consent.
					</p>
					<p className="mt-2">
						We process your personal information for a variety of reasons,
						depending on how you interact with our Services, including:
					</p>

					<ul className="list-disc mt-2 pl-8">
						<li className="mt-2">
							<b>
								To facilitate account creation and authentication, and manage
								user accounts.
							</b>{" "}
							We may process your information so you can create and log in to
							your account, as well as keep your account in working order.
						</li>
						<li className="mt-2">
							<b>
								To deliver and facilitate the delivery of services to the user.
							</b>{" "}
							We may process your information to provide you with the requested
							service.
						</li>
						<li className="mt-2">
							<b>To respond to user inquiries/offer support to users.</b> We may
							process your information to respond to your inquiries and solve
							any potential issues you might have with the requested service.
						</li>
						<li className="mt-2">
							<b>To send administrative information to you.</b> We may process
							your information to send you details about our products and
							services, changes to our terms and policies, and other similar
							information.
						</li>
						<li className="mt-2">
							<b>To fulfill and manage your orders.</b> We may process your
							information to fulfill and manage your orders, payments, returns,
							and exchanges made through the Services.
						</li>
						<li className="mt-2">
							<b>To enable user-to-user communications.</b> We may process your
							information if you choose to use any of our offerings that allow
							for communication with another user.
						</li>
						<li className="mt-2">
							<b>To request feedback.</b> We may process your information when
							necessary to request feedback and to contact you about your use of
							our Services.
						</li>
						<li className="mt-2">
							<b>To deliver targeted advertising to you.</b> We may process your
							information to develop and display personalized content and
							advertising tailored to your interests, location, and more.
						</li>
						<li className="mt-2">
							<b>To post testimonials.</b> We post testimonials on our Services
							that may contain personal information.
						</li>
						<li className="mt-2">
							<b>To protect our Services.</b> We may process your information as
							part of our efforts to keep our Services safe and secure,
							including fraud monitoring and prevention.
						</li>
						<li className="mt-2">
							<b>
								To evaluate and improve our Services, products, marketing, and
								your experience.
							</b>{" "}
							We may process your information when we believe it is necessary to
							identify usage trends, determine the effectiveness of our
							promotional campaigns, and evaluate and improve our Services,
							products, marketing, and your experience.
						</li>
						<li className="mt-2">
							<b>
								To determine the effectiveness of our marketing and promotional
								campaigns.
							</b>{" "}
							We may process your information to better understand how to
							provide marketing and promotional campaigns that are most relevant
							to you.
						</li>
					</ul>

					<p
						className="mt-5 font-bold text-xl text-primary"
						id="personal_information"
					>
						<strong>
							When and With Whom Do We Share Your Personal Information?
						</strong>
					</p>

					<p>
						<b>In Short:</b> We may share information in specific situations
						described in this section and/or with third parties.
					</p>
					<p className="mt-2">
						We may need to share your personal information in the following
						situations:
					</p>

					<ul className="list-disc mt-2 pl-8">
						<li className="mt-2">
							<b>Business Transfers.</b> We may share or transfer your
							information in connection with, or during negotiations of, any
							merger, sale of company assets, financing, or acquisition of all
							or a portion of our business to another company.
						</li>
						<li className="mt-2">
							<b>Other Users.</b> When you share personal information (for
							example, by posting comments, contributions, or other content to
							the services) or otherwise interact with public areas or the
							Services, such personal information may be viewed by all users and
							may be publicly made available outside the services in perpetuity.
							If you interact with other users of our Services and register for
							our Services through a social network (such as Facebook), your
							contacts on the social network will see your name, profile photo,
							and descriptions of your activity. Similarly, other users will be
							able to view descriptions of your activity, communicate with you
							within our services, and view your profile.
						</li>
						<li className="mt-2">
							<b>Offer Wall.</b> Our application/s may display a
							third-party-hosted “offer wall.” Such an offer wall allows
							third-party advertisers to offer virtual currency, gifts, or other
							items to users in return for the acceptance and completion of an
							advertisement offer. Such an offer wall may appear in our
							application/s and be displayed to you based on certain data, such
							as your geographic area or demographic information. When you click
							on an offer wall, you will be brought to an external website
							belonging to other persons and will leave our application/s. A
							unique identifier, such as your user ID, will be shared with the
							offer wall provider in order to prevent fraud and properly credit
							your account with the relevant reward.
						</li>
					</ul>

					<p className="mt-5 font-bold text-xl text-primary">
						<strong>What is Our Stance On Third-Party Websites?</strong>
					</p>

					<p>
						<b>In Short:</b> We are not responsible for the safety of any
						information that you share with third parties that we may link to or
						who advertise on our Services but are not affiliated with us.
					</p>
					<p className="mt-2">
						The Services, including our offer wall, may link to third-party
						websites, online services, or mobile applications and/or contain
						advertisements from third parties that are not affiliated with us
						and which may link to other websites, services, or applications.
						Accordingly, we do not make any guarantee regarding any such third
						parties, and we will not be liable for any loss or damage caused by
						the use of such third-party websites, services, or applications. The
						inclusion of a link to a third-party website, service, or
						application does not imply an endorsement by us. We cannot guarantee
						the safety and privacy of the data you provide to any third parties.
						Any data collected by third parties is not covered by this privacy
						notice. We are not responsible for the content or privacy and
						security practices and policies of any third parties, including
						other websites, services, or applications that may be linked to or
						from the Services. You should review the policies of such third
						parties and contact them directly to respond to your questions.
					</p>

					<p className="mt-5 font-bold text-xl text-primary">
						<strong>Do We Use Cookies and Other Tracking Technologies?</strong>
					</p>

					<p>
						<b>In Short:</b> We may use cookies and other tracking technologies
						to collect and store your information.
					</p>
					<p className="mt-2">
						{" "}
						We may use cookies and similar tracking technologies (like web
						beacons and pixels) to access or store information. Specific
						information about how we use such technologies and how you can
						refuse certain cookies is set out in our <b>Cookie Notice.</b>
					</p>

					<p className="mt-5 font-bold text-xl text-primary">
						<strong>How Do We Handle Your Social Logins?</strong>
					</p>

					<p>
						<b>In Short:</b> If you choose to register or log in to our Services
						using a social media account, we may have access to certain
						information about you.
					</p>
					<p className="mt-2">
						Our Services offer you the ability to register and log in using your
						third-party social media account details (like your Facebook or
						Twitter logins). When you choose to do this, we will receive certain
						profile information about you from your social media provider. The
						profile information we receive may vary depending on the social
						media provider concerned, but will often include your name, email
						address, friends list, and profile picture, as well as other
						information you choose to make public on such a social media
						platform.
					</p>

					<p className="mt-2">
						We will use the information we receive only for the purposes that
						are described in this privacy notice or that are otherwise made
						clear to you on the relevant Services. Please note that we do not
						control and are not responsible for other uses of your personal
						information by your third-party social media provider. We recommend
						that you review their privacy notice to understand how they collect,
						use, and share your personal information, and how you can set your
						privacy preferences on their sites and apps.
					</p>

					<p className="mt-5 font-bold text-xl text-primary">
						<strong>How Long Do We Keep Your Information?</strong>
					</p>

					<p>
						<b>In Short:</b> We keep your information for as long as necessary
						to fulfill the purposes outlined in this privacy notice unless
						otherwise required by the law.
					</p>
					<p className="mt-2">
						We will only keep your personal information for as long as it is
						necessary for the purposes set out in this privacy notice, unless a
						longer retention period is required or permitted by the law (such as
						tax, accounting, or other legal requirements). No purpose in this
						notice will require us to keep your personal information for longer
						than the period of time in which users have an account with us.
					</p>
					<p className="mt-2">
						When we have no ongoing legitimate business need to process your
						personal information, we will either delete or anonymize such
						information, or, if this is not possible (for example, because your
						personal information has been stored in backup archives), then we
						will securely store your personal information and isolate it from
						any further processing until deletion is possible.
					</p>

					<p className="mt-5 font-bold text-xl text-primary">
						<strong>How Do We Keep Your Information Safe?</strong>
					</p>

					<p>
						<b>In Short:</b> We aim to protect your personal information through
						a system of organizational and technical security measures.
					</p>
					<p className="mt-2">
						We have implemented appropriate and reasonable technical and
						organizational security measures designed to protect the security of
						any personal information we process. However, despite our safeguards
						and efforts to secure your information, no electronic transmission
						over the Internet or information storage technology can be
						guaranteed to be 100% secure, so we cannot promise or guarantee that
						hackers, cybercriminals, or other unauthorized third parties will
						not be able to defeat our security and improperly collect, access,
						steal, or modify your information. Although we will do our best to
						protect your personal information, the transmission of your personal
						information to and from our Services is at your own risk. You should
						only access the Services within a secure environment.
					</p>

					<p className="mt-5 font-bold text-xl text-primary">
						<strong>Do We Collect Information From Minors?</strong>
					</p>

					<p>
						<b>In Short:</b> We do not knowingly collect data from or market to
						children under 18 years of age.
					</p>
					<p className="mt-2">
						We do not knowingly solicit data from or market to children under 18
						years of age. By using the Services, you represent that you are at
						least 18 or that you are the parent or guardian of such a minor and
						consent to such minor dependent&apos;s use of the Services. If we
						learn that personal information from users less than 18 years of age
						has been collected, we will deactivate the account and take
						reasonable measures to promptly delete such data from our records.
						If you become aware of any data, we may have collected from children
						under age 18, please contact us at{" "}
						<Link
							href={"mailto:<wicket.journeys@gmail.com>"}
							className="link link-hover link-error"
						>
							wicket.journeys@gmail.com
						</Link>
						.
					</p>

					<p className="mt-5 font-bold text-xl text-primary">
						<strong>What Are Your Privacy Rights?</strong>
					</p>

					<p>
						<b>In Short:</b> You may review, change, or terminate your account
						at any time.
					</p>

					<p className="mt-2">
						If you are located in the EEA or UK and you believe we are
						unlawfully processing your personal information, you also have the
						right to complain to your local data protection supervisory
						authority. You can find their contact details here:{" "}
						<Link
							href="https://commission.europa.eu/law/law-topic/data-protection_en"
							className="link link-error link-hover"
						>
							https://commission.europa.eu/law/law-topic/data-protection_en
						</Link>
						. If you are located in Switzerland, the contact details for the
						data protection authorities are available here:{" "}
						<Link
							href="https://www.edoeb.admin.ch/edoeb/en/home.html"
							className="link link-error link-hover"
						>
							https://www.edoeb.admin.ch/edoeb/en/home.html
						</Link>
						.
					</p>

					<p className="mt-2">
						<b className="underline">Withdrawing your consent:</b> If we are
						relying on your consent to process your personal information, which
						may be expressed and/or implied consent depending on the applicable
						law, you have the right to withdraw your consent at any time. You
						can withdraw your consent at any time by contacting us by using the
						contact details provided in the section &quot;HOW CAN YOU CONTACT US
						ABOUT THIS NOTICE?&quot; below.
					</p>

					<p className="mt-2">
						However, please note that this will not affect the lawfulness of the
						processing before its withdrawal nor, when applicable law allows,
						will it affect the processing of your personal information conducted
						in reliance on lawful processing grounds other than consent.
					</p>

					<p className="mt-5 text-lg text-secondary">Account Information</p>

					<p className="mt-2">
						If you would at any time like to review or change the information in
						your account or terminate your account, you can:
					</p>

					<ul className="list-disc mt-2 pl-8">
						<li>
							Log in to your account settings and update your user account, or
						</li>
						<li>Contact us using the contact information provided.</li>
					</ul>

					<p className="mt-2">
						Upon your request to terminate your account, we will deactivate or
						delete your account and information from our active databases.
						However, we may retain some information in our files to prevent
						fraud, troubleshoot problems, assist with any investigations,
						enforce our legal terms and/or comply with applicable legal
						requirements.
					</p>

					<p className="mt-2">
						<b className="underline">Cookies and similar technologies:</b> Most
						Web browsers are set to accept cookies by default. If you prefer,
						you can usually choose to set your browser to remove cookies and to
						reject cookies. If you choose to remove cookies or reject cookies,
						this could affect certain features or services of our Services. To
						opt out of interest-based advertising by advertisers on our Services
						visit:{" "}
						<Link
							href="http://www.aboutads.info/choices/"
							className="link link-error link-hover"
						>
							http://www.aboutads.info/choices/.
						</Link>
					</p>

					<p className="mt-2">
						If you have questions or comments about your privacy rights, you may
						email us at{" "}
						<Link
							href={"mailto:<wicket.journeys@gmail.com>"}
							className="link link-hover link-error"
						>
							wicket.journeys@gmail.com
						</Link>
						.
					</p>

					<p className="mt-5 font-bold text-xl text-primary">
						<strong>Controls for Do-Not-Track Features</strong>
					</p>

					<p className="mt-2">
						Most web browsers and some mobile operating systems and mobile
						applications include a Do-Not-Track (&quot;DNT&quot;) feature or
						setting you can activate to signal your privacy preference not to
						have data about your online browsing activities monitored and
						collected. At this stage, no uniform technology standard for
						recognizing and implementing DNT signals has been finalized. As
						such, we do not currently respond to DNT browser signals or any
						other mechanism that automatically communicates your choice not to
						be tracked online. If a standard for online tracking is adopted that
						we must follow in the future, we will inform you about that practice
						in a revised version of this privacy notice.
					</p>

					<p className="mt-5 font-bold text-xl text-primary">
						<strong>
							Do California Residents Have Specific Privacy Rights?
						</strong>
					</p>

					<p>
						<b>In Short:</b> Yes, if you are a resident of California, you are
						granted specific rights regarding access to your personal
						information.
					</p>

					<p className="mt-2">
						California Civil Code Section 1798.83, also known as the &quot;Shine
						The Light&quot; law, permits our users who are California residents
						to request and obtain from us, once a year and free of charge,
						information about categories of personal information (if any) we
						disclosed to third parties for direct marketing purposes and the
						names and addresses of all third parties with which we shared
						personal information in the immediately preceding calendar year. If
						you are a California resident and would like to make such a request,
						please submit your request in writing to us using the contact
						information provided below.
					</p>

					<p className="mt-2">
						If you are under 18 years of age, reside in California, and have a
						registered account with Services, you have the right to request the
						removal of unwanted data that you publicly post on the Services. To
						request the removal of such data, please contact us using the
						contact information provided below and include the email address
						associated with your account and a statement that you reside in
						California. We will make sure the data is not publicly displayed on
						the Services, but please be aware that the data may not be
						completely or comprehensively removed from all our systems (e.g.,
						backups, etc.).
					</p>

					<p className="mt-5 font-bold text-xl text-primary" id="notice">
						<strong>Do We Make Updates To This Notice?</strong>
					</p>

					<p>
						<b>In Short:</b> Yes, we will update this notice as necessary to
						stay compliant with relevant laws.
					</p>

					<p className="mt-2">
						We may update this privacy notice from time to time. The updated
						version will be indicated by an updated &quot;Revised&quot; date and
						the updated version will be effective as soon as it is accessible.
						If we make material changes to this privacy notice, we may notify
						you either by prominently posting a notice of such changes or by
						directly sending you a notification. We encourage you to review this
						privacy notice frequently to be informed of how we are protecting
						your information.
					</p>

					<p className="mt-5 font-bold text-xl text-primary">
						<strong>How Can Your Contact Us About This Notice?</strong>
					</p>

					<p className="mt-2">
						If you have questions or comments about this notice, you may email
						us at{" "}
						<Link
							href="mailto:<wicket.journeys@gmail.com>"
							className="link link-error link-hover"
						>
							wicket.journeys@gmail.com
						</Link>{" "}
						or by post to:
					</p>

					<ul className="list-disc mt-2 pl-8">
						<dt>Wicket Journeys</dt>
						<dt>1400 Congressional Rd Ext, Novaliches</dt>
						<dt>Caloocan</dt>
						<dt>Philippines</dt>
					</ul>

					<p className="mt-5 font-bold text-xl text-primary">
						<strong>
							How Can You Review , Update, or Delete The Data We Collect From
							You?
						</strong>
					</p>

					<p className="mt-2">
						Based on the applicable laws of your country, you may have the right
						to request access to the personal information we collect from you,
						change that information, or delete it. To request to review, update,
						or delete your personal information, please visit:{" "}
						<Link
							href="https://www.wicket.vercel.app/contact"
							className="link link-error link-hover"
						>
							https://www.wicket.vercel.app/contact
						</Link>
						.
					</p>
				</>
			</motion.main>
		</>
	);
}
