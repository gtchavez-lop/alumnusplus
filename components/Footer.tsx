import Image from "next/image";
import Link from "next/link";

const Footer = () => {
	return (
		<>
			<div className="h-[2px] w-96 bg-primary my-5 mx-auto rounded-lg print:hidden" />
			<footer className="footer p-10 text-base-content print:hidden">
				<div className="flex flex-col md:flex-row md:items-center">
					<Image
						src="/logo/wicket-new-adaptive.png"
						alt="logo"
						width={50}
						height={50}
					/>
					<p className="font-bold">Wicket Journeys</p>
				</div>
				<div>
					<span className="footer-title">Features</span>
					<Link href="/util/features#blogging" className="link link-hover">
						Mini Blogging
					</Link>
					<Link
						href="/util/features#companyhunting"
						className="link link-hover"
					>
						Geo-Company Hunting
					</Link>
					<Link href="/util/features#jobposting" className="link link-hover">
						Job Posting
					</Link>
					<Link href="/util/features#metaverse" className="link link-hover">
						Metaverse
					</Link>
				</div>
				<div>
					<span className="footer-title">Company</span>
					<Link href={"/util/about-us"} className="link link-hover">
						About
					</Link>
					<Link href={"/util/contact"} className="link link-hover">
						Contact
					</Link>
				</div>
				<div>
					<span className="footer-title">Legal</span>
					<Link href={"/util/terms-of-use"} className="link link-hover">
						Terms of use
					</Link>
					<Link href={"/util/privacy-policy"} className="link link-hover">
						Privacy policy
					</Link>
					<Link href={"/util/cookies"} className="link link-hover">
						Cookie policy
					</Link>
				</div>
			</footer>
		</>
	);
};

export default Footer;
