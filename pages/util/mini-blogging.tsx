import { AnimPageTransition } from "@/lib/animations";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function BloggingPage() {
	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				<h1 className="text-4xl font-bold mb-5 text-primary">Mini Blogging</h1>
				<p className="mt-5 font-bold text-xl text-secondary">
					<strong>Mini-blog:</strong>
				</p>

				<p className="mt-2">Have you recently...</p>
				<p className="mt-2">got a new hobby?</p>
				<p className="mt-2">reached a new milestone?</p>
				<p className="mt-2">discovered something interesting?</p>
				<p className="mt-2">
					Or perhaps, do you just want a space to share what you have been up
					to, what currently fuels your creativity, or a cool tip on the perfect
					coffee-to-motivating-quotes (or bill payment reminders) ratio to keep
					one awake and alert during a 7 AM meeting?
				</p>
				<p className="mt-2">
					Share those and more with other Hunters and keep each other awake,
					alert, and motivated as each of you build your career with Wicket.
				</p>
				<p className="mt-2">
					Make sure you also get your message through with the appropriate
					intensity and emphasis as they were meant to deliver by using markdown
					style formatting concepts.
				</p>
				<p className="mt-2">
					Scroll down for a quick start guide or click{" "}
					<Link href={"#markdown"} className="link link-hover link-error">
						here
					</Link>{" "}
					to discover other cool things you can do with markdown style
					formatting!
				</p>

				<div className="grid grid-cols-4 gap-2 text-xl p-5 mt-2" id="markdown">
					<strong className="text-secondary">Element</strong>
					<strong className="text-secondary">Name</strong>
					<strong className="text-secondary">Markdown</strong>
					<strong className="text-secondary">Output</strong>

					<div>H1</div>
					<div>Header 1</div>
					<div>#wicket</div>
					<p className="text-7xl">wicket</p>

					<div>H2</div>
					<div>Header 2</div>
					<div>##wicket</div>
					<p className="text-6xl">wicket</p>

					<div>H3</div>
					<div>Header 3</div>
					<div>###wicket</div>
					<p className="text-5xl">wicket</p>

					<div>H4</div>
					<div>Header 4</div>
					<div>####wicket</div>
					<p className="text-4xl">wicket</p>

					<div>H5</div>
					<div>Header 5</div>
					<div>#####wicket</div>
					<p className="text-3xl">wicket</p>

					<div>H6</div>
					<div>Header 6</div>
					<div>######wicket</div>
					<p className="text-2xl">wicket</p>

					<div>p</div>
					<div>paragraph</div>
					<div>wicket</div>
					<p>wicket</p>
				</div>

				<div className="grid grid-cols-3 gap-2 text-xl p-5 mt-2">
					<strong className="text-secondary">Style/Emphasis</strong>
					<strong className="text-secondary">Markdown</strong>
					<strong className="text-secondary">Output</strong>

					<div>bold</div>
					<div>**wicket**</div>
					<b>wicket</b>

					<div>italic</div>
					<div>*wicket*</div>
					<i>wicket</i>

					<div>bold and italic</div>
					<div>***wicket***</div>
					<b className="italic">wicket</b>
				</div>

				<p className="mt-2 font-bold text-xl text-secondary">
					<strong>Interaction:</strong>
				</p>

				<p className="mt-2">
					Show your appreciation for another Hunter&apos;s post by giving them
					an upvote.
				</p>
				<p className="mt-2">
					But if upvoting a post would not do it, you may also leave a
					professionally-crafted comment to append information or evidence to
					support a post, start a discussion, or simply put your admiration into
					words!
				</p>
				<p className="mt-2">
					Promote and practice kindness with each other no matter the platform
					or circumstance.
				</p>

				<p className="mt-5 font-bold text-xl text-secondary">
					<strong>Expand-connections:</strong>
				</p>
				<p className="mt-2">
					Expand your community as you build your path to your dream career
					through Wicket&apos;s Suggested Connections section. Add other Hunters
					as Connections and be there for them for every achievement, lesson
					learned, and glow-up.
				</p>
				<p className="mt-2">
					Looking for a specific person? Manually search for them on the search
					bar found on your Feed page to add them as a Connection.
				</p>

				<p className="mt-5 font-bold text-xl text-secondary">
					<strong>Ai-chatbot:</strong>
				</p>
				<p className="mt-2">
					Do you need assistance installing Wicket on your mobile phone? Or have
					you been experiencing errors from Wicket&apos;s offered services?
				</p>
				<p className="mt-2">
					Utilize Wicket&apos;s AI-powered chatbot to answer Frequently Asked
					Questions (FAQs) and receive instant replies and solutions even for
					other website-related concerns.
				</p>
				<p className="mt-2">
					In case of an overwhelmed AI chatbot, you may also directly reach out
					to the developers for your concerts, suggestions, and other inquiries
					by sending an email to{" "}
					<Link
						href="mailto:<wicket.journeys@gmail.com>"
						className="link link-error link-hover"
					>
						wicket.journeys@gmail.com
					</Link>
					.
				</p>
			</motion.main>
		</>
	);
}
