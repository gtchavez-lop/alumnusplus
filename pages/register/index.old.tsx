import { AnimPageTransition } from "@/lib/animations";
import Image from "next/image";
import Link from "next/link";
import { NextPage } from "next";
import { motion } from "framer-motion";

const RegisterHomePage: NextPage = () => {
	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36 md:pb-0"
			>
				<div>
					<h1 className="text-5xl text-primary font-bold text-center">
						Welcome to Wicket
					</h1>
					<p className="text-center max-w-lg mx-auto">
						We&apos;re glad you&apos;re here. Let&apos;s get started by creating
						your account.
					</p>
				</div>

				<div className="mt-10 flex flex-col gap-4">
					<div className="flex flex-col items-center">
						<h4 className="text-3xl text-secondary">Select Account Type</h4>
						<p className="text-lg">
							What type of account would you like to create?
						</p>
						<p className="text-sm opacity-50">
							Once you&apos;ve created an account, you cannot change your
							account type.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<Link
							href='/register/hunter'
							className="h-[200px] lg:h-[300px] rounded-btn group relative overflow-hidden cursor-pointer"
						>
							<Image
								src="https://images.pexels.com/photos/3756678/pexels-photo-3756678.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
								alt=""
								className="absolute top-0 left-0 w-full h-full object-cover object-center opacity-50 transition group-hover:opacity-100 group-hover:scale-110"
								width={500}
								height={300}
							/>
							<div className="z-10 absolute bottom-0 py-5 bg-gradient-to-t from-base-100 to-transparent group-hover:opacity-50 transition flex flex-col items-center w-full">
								<p className="text-xl lg:text-2xl font-bold">
									Hunter (Job Seeker)
								</p>
								<p className="text-center w-full">
									Find a suitable job for your needs.
								</p>
							</div>
						</Link>
						<Link
							href='/register/provisioner'
							className="h-[200px] lg:h-[300px] rounded-btn group relative overflow-hidden cursor-pointer"
						>
							<Image
								src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
								alt=""
								className="absolute top-0 left-0 w-full h-full object-cover object-center opacity-50 transition group-hover:opacity-100 group-hover:scale-110"
								width={500}
								height={300}
							/>
							<div className="z-10 absolute bottom-0 py-5 bg-gradient-to-t from-base-100 to-transparent group-hover:opacity-50 transition flex flex-col items-center w-full">
								<p className="text-xl lg:text-2xl font-bold">
									Provisioner (Job Provider)
								</p>
								<p className="text-center w-full">
									Post a job and find the right candidate for your company.
								</p>
							</div>
						</Link>
					</div>
				</div>
			</motion.main>
		</>
	);
};

export default RegisterHomePage;
