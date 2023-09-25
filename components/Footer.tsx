import { FiMapPin } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
	return (
		<>
			<div className="h-[2px] w-96 bg-primary my-5 mx-auto rounded-lg print:hidden" />
			<footer className="flex justify-between p-10 print:hidden">
				<div className="flex flex-col gap-9">
					<div className="flex flex-col md:flex-row md:items-center">
						<Image
							src="/logo/wicket-new-adaptive.png"
							alt="logo"
							width={50}
							height={50}
						/>
						<p className="font-bold">Wicket Journeys</p>
					</div>
					<div className="flex flex-col md:flex-row">
						<div className="flex flex-col md:flex-row items-center gap-x-2 font-bold">
							<FiMapPin />
							Philippines
						</div>
					</div>
					<p>Congressional Rd Ext, Caloocan, Metro Manila</p>
				</div>
				<div className="flex flex-col">
					<span className="text-lg font-bold">Features</span>
					<Link
						href={"/util/mini-blogging"}
						className="hover:underline underline-offset-4"
					>
						Mini Blogging
					</Link>
					<Link
						href="/util/geo-company"
						className="hover:underline underline-offset-4"
					>
						Geo-Company Hunting
					</Link>
					<Link
						href={"/util/job-posting"}
						className="hover:underline underline-offset-4"
					>
						Job Posting
					</Link>
					<Link
						href={"/util/metaverse"}
						className="hover:underline underline-offset-4"
					>
						Metaverse
					</Link>
				</div>
				<div className="flex flex-col">
					<span className="text-lg font-bold">Company</span>
					<Link
						href={"/util/about-us"}
						className="hover:underline underline-offset-4"
					>
						About
					</Link>
					<Link
						href={"/util/contact"}
						className="hover:underline underline-offset-4"
					>
						Contact
					</Link>
				</div>
				<div className="flex flex-col">
					<span className="text-lg font-bold">Legal</span>
					<Link
						href={"/util/terms-of-use"}
						className="hover:underline underline-offset-4"
					>
						Terms of use
					</Link>
					<Link
						href={"/util/privacy-policy"}
						className="hover:underline underline-offset-4"
					>
						Privacy policy
					</Link>
					<Link
						href={"/util/cookies"}
						className="hover:underline underline-offset-4"
					>
						Cookie policy
					</Link>
				</div>
			</footer>
		</>
	);
};

export default Footer;
