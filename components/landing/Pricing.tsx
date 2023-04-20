import { AnimatePresence, motion } from "framer-motion";
import { FC, useState } from "react";
import { FiCheck, FiChevronDown, FiX } from "react-icons/fi";

const Pricing: FC = () => {
	const [accountType, setAccountType] = useState("hunter");

	return (
		<>
			{/* desktop */}
			<main className="min-h-[50vh] hidden lg:block">
				<h2 className="text-center font-bold text-3xl">
					Find the right plan for you
				</h2>
				<p className="text-center">
					Subscribe to our plans and get access to all our features.
				</p>

				{/* picker */}
				<div className="w-full relative max-w-xl gap-4 grid grid-cols-2 p-2 rounded-full mx-auto mt-10">
					{/* animated slider */}
					<motion.div
						animate={{
							x: accountType === "hunter" ? 0 : "100%",
						}}
						transition={{ duration: 0.5, ease: [0.87, 0.29, 0.13, 0.8] }}
						className="absolute w-1/2 h-full bg-primary/60 rounded-full"
					/>

					{/* buttons */}
					<button
						onClick={() => setAccountType("hunter")}
						className="rounded-full z-10"
					>
						Hunters
					</button>
					<button
						onClick={() => setAccountType("provisioner")}
						className="rounded-full z-10"
					>
						Provisioners
					</button>
				</div>

				<>
					<AnimatePresence mode="sync">
						{accountType === "hunter" && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								{/* grid container */}
								<>
									<div className="flex flex-col mt-10">
										{/* header */}
										<div className="grid grid-cols-3 gap-2 mb-10 ">
											<div className="col-span-1" />
											<div className="flex flex-col items-center justify-center">
												<h3 className="text-center font-bold text-2xl">
													Junior
												</h3>
												<div className="flex items-center justify-center mt-4">
													<p className="text-2xl font-bold">₱</p>
													<p className="text-5xl font-bold">0</p>
												</div>
												<p className="text-center">/month</p>
											</div>
											<div className="flex flex-col items-center justify-center">
												<h3 className="text-center font-bold text-2xl">
													Expert
												</h3>
												<div className="flex items-center justify-center mt-4">
													<p className="text-2xl font-bold">₱</p>
													<p className="text-5xl font-bold">148</p>
												</div>
												<p className="text-center">/month</p>
											</div>

										</div>
									</div>
								</>
								{/* blog feed */}
								<>
									<div className="grid grid-cols-3 gap-2 mb-1">
										<p className="col-span-1 text-lg text-center font-bold">
											Blog Feed
										</p>
									</div>
									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">Blog Post</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>
									</div>
									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Posts  Image Embed
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiX className="text-red-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>

									</div>
									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Upvoting Posts
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>

									</div>
									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Commenting on Posts
										</p>

										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>
									</div>
									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Advertisement Cards
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiX className="text-red-500" />
										</p>

									</div>
									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Hunter Suggestion
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>

									</div>
								</>

								{/* finder */}
								<>
									<div className="grid grid-cols-3 gap-2 mt-5 mb-1">
										<p className="col-span-1 text-lg text-center font-bold">
											Finder
										</p>
									</div>

									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Nearby Company
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>

									</div>

									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Job Prioritization
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiX className="text-red-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>

									</div>
								</>

								{/* Metaverse */}
								<>
									<div className="grid grid-cols-3 gap-2 mt-5 mb-1">
										<p className="col-span-1 text-lg text-center font-bold">
											Metaverse
										</p>
									</div>

									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Metaverse Access
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiX className="text-red-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>

									</div>

									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Voice Chatting
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiX className="text-red-500" />
										</p>

										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>
									</div>

									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Avatar Customization
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiX className="text-red-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>

									</div>
								</>

								{/* Wicket Profile */}
								<>
									<div className="grid grid-cols-3 gap-2 mt-5 mb-1">
										<p className="col-span-1 text-lg text-center font-bold">
											Wicket Profile
										</p>
									</div>

									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Profile Customization
										</p>
										<p className="flex justify-center items-center text-center w-full">
											Basic
										</p>
										<p className="flex justify-center items-center text-center w-full">
											Customized
										</p>
									</div>

									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Profile Bio Template Options
										</p>
										<p className="flex justify-center items-center text-center w-full">
											Basic
										</p>
										<p className="flex justify-center items-center text-center w-full">
											Expert + 5
										</p>

									</div>

									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Job Application Prioritization
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiX className="text-red-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>

									</div>
								</>

								{/* Job Seeking */}
								<>
									<div className="grid grid-cols-3 gap-2 mt-5 mb-1">
										<p className="col-span-1 text-lg text-center font-bold">
											Job Seeking
										</p>
									</div>

									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Prioritization by Career Tagging
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiX className="text-red-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>

									</div>

									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Prioritization by Proximity
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiX className="text-red-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>

									</div>
								</>


							</motion.div>
						)}

						{/* provisioner's pricing */}
						{accountType === "provisioner" && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								{/* grid container */}
								<>
									<div className="flex flex-col mt-10">
										{/* header */}
										<div className="grid grid-cols-3 gap-2 mb-10 ">
											<div className="col-span-1" />
											<div className="flex flex-col items-center justify-center">
												<h3 className="text-center font-bold text-2xl">
													Junior
												</h3>
												<div className="flex items-center justify-center mt-4">
													<p className="text-2xl font-bold">₱</p>
													<p className="text-5xl font-bold">0</p>
												</div>
												<p className="text-center">/month</p>
											</div>
											<div className="flex flex-col items-center justify-center">
												<h3 className="text-center font-bold text-2xl">
													Expert
												</h3>
												<div className="flex items-center justify-center mt-4">
													<p className="text-2xl font-bold">₱</p>
													<p className="text-5xl font-bold">148</p>
												</div>
												<p className="text-center">/month</p>
											</div>

										</div>
									</div>
								</>

								{/* blog feed */}
								<>
									<div className="grid grid-cols-3 gap-2 mb-1">
										<p className="col-span-1 text-lg text-center font-bold">
											Blog Feed
										</p>
									</div>
									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">Blog Post</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>
									</div>
									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Posts Image Embed
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiX className="text-red-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>

									</div>
									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Upvoting Posts
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>

									</div>
									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Commenting on Posts
										</p>

										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>
									</div>
									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Advertisement Cards
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiX className="text-red-500" />
										</p>

									</div>
								</>

								{/* job postings */}
								<>
									<div className="grid grid-cols-3 mt-5 gap-2 mb-1">
										<p className="col-span-1 text-lg text-center font-bold">
											Job Postings
										</p>
									</div>

									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">Template</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>

									</div>
									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Prioritization
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiX className="text-red-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>

									</div>
									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">Featured</p>
										<p className=" text-center w-full">N/A</p>
										<p className=" text-center w-full">1/Month</p>
									</div>
								</>

								{/* metaverse */}
								<>
									<div className="grid grid-cols-3 mt-5 gap-2 mb-1">
										<p className="col-span-1 text-lg text-center font-bold">
											Metaverse
										</p>
									</div>
									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Create / Host Venue
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiX className="text-red-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>

									</div>
									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Maximum Participants
										</p>
										<p className=" text-center w-full">N/A</p>
										<p className=" text-center w-full">50</p>
									</div>

									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Invite Guest/s
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiX className="text-red-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>
									</div>
								</>

								{/* Profile */}
								<>
									<div className="grid grid-cols-3 mt-5 gap-2 mb-1">
										<p className="col-span-1 text-lg text-center font-bold">
											Profile
										</p>
									</div>

									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Profile Customization
										</p>
										<p className=" text-center w-full">Basic</p>
										<p className=" text-center w-full">Customized</p>
									</div>

									<div className="grid grid-cols-3 gap-2 w-full hover:bg-primary/60 rounded-full hover:py-2 transition-all">
										<p className="col-span-1 text-center w-full">
											Suggestion Prioritization on Hunters
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiX className="text-red-500" />
										</p>
										<p className="flex justify-center items-center text-center w-full">
											<FiCheck className="text-green-500" />
										</p>
									</div>
								</>
							</motion.div>
						)}
					</AnimatePresence>
				</>
			</main>

			{/* mobile */}
			<main className="min-h-[50vh] lg:hidden">
				<h2 className="text-center font-bold text-3xl">
					Find the right plan for you
				</h2>
				<p className="text-center">
					Subscribe to our plans and get access to all our features.
				</p>

				{/* picker */}
				<div className="w-full relative max-w-xl gap-4 grid grid-cols-2 p-2 rounded-full mx-auto my-10">
					{/* animated slider */}
					<motion.div
						animate={{
							x: accountType === "hunter" ? 0 : "100%",
						}}
						transition={{ duration: 0.5, ease: [0.87, 0.29, 0.13, 0.8] }}
						className="absolute w-1/2 h-full bg-base-300 rounded-full"
					/>
					{/* buttons */}
					<button
						onClick={() => setAccountType("hunter")}
						className="rounded-full z-10"
					>
						Hunters
					</button>
					<button
						onClick={() => setAccountType("provisioner")}
						className="rounded-full z-10"
					>
						Provisioners
					</button>
				</div>

				{/* accordion */}
				{
					<AnimatePresence>
						{accountType === "hunter" && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 20 }}
								transition={{ duration: 0.5, ease: [0.87, 0.29, 0.13, 0.8] }}
							>
								{/* Junior tier */}
								<div tabIndex={0} className="collapse">
									<div className="collapse-title pr-0 flex justify-between text-xl font-medium">
										<span>Junior Tier</span>
										<span className="text-2xl font-bold flex items-center">
											₱0
											<FiChevronDown />
										</span>
									</div>
									<div className="collapse-content">
										{/* blog feed */}
										<div className="mb-5 flex flex-col gap-1 w-full">
											<p className="text-lg font-bold">Blog Feed</p>
											<p className="flex justify-between w-full items-center">
												<span>Blog Post</span>
												<FiCheck className="text-green-500" />
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Posts Image Embed</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Upvoting Posts</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Commenting on Posts</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Advertisement Cards</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Hunter Suggestion</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
										</div>
										{/* Finder */}
										<div className="mb-5 flex flex-col gap-1 w-full">
											<p className="text-lg font-bold">Finder</p>
											<p className="flex justify-between w-full items-center">
												<span>Finder Proximity</span>
												<FiCheck className="text-green-500" />
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Job Prioritization</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
										</div>
										{/* Metaverse */}
										<div className="mb-5 flex flex-col gap-1 w-full">
											<p className="text-lg font-bold">Metaverse</p>
											<p className="flex justify-between w-full items-center">
												<span>Metaverse Access</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Voice Chatting</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Avatar Customization</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
										</div>
										{/* Wicket Profile */}
										<div className="mb-5 flex flex-col gap-1 w-full">
											<p className="text-lg font-bold">Wicket Profile</p>
											<p className="flex justify-between w-full items-center">
												<span>Profile Customization</span>
												<span>Basic</span>
											</p>

											<p className="flex justify-between w-full items-center">
												<span>Profile Bio Template Options</span>
												<span>Basic</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Job Application Prioritization</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
										</div>
										{/* Job Seeking */}
										<div className="mb-5 flex flex-col gap-1 w-full">
											<p className="text-lg font-bold">Job Seeking</p>
											<p className="flex justify-between w-full items-center">
												<span>Prioritization by Career Tagging</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Prioritization by Proximity</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
										</div>

									</div>
								</div>
								{/* Expert tier */}
								<div tabIndex={0} className="collapse">
									<div className="collapse-title pr-0 flex justify-between text-xl font-medium">
										<span>Expert Tier</span>
										<span className="text-2xl font-bold flex items-center">
											₱148/m
											<FiChevronDown />
										</span>
									</div>
									<div className="collapse-content">
										{/* blog feed */}
										<div className="mb-5 flex flex-col gap-1 w-full">
											<p className="text-lg font-bold">Blog Feed</p>
											<p className="flex justify-between w-full items-center">
												<span>Blog Post</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Posts Image Embed</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Upvoting Posts</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Commenting on Posts</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Advertisement Cards</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Hunter Suggestion</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
										</div>
										{/* Finder */}
										<div className="mb-5 flex flex-col gap-1 w-full">
											<p className="text-lg font-bold">Finder</p>
											<p className="flex justify-between w-full items-center">
												<span>Finder Proximity</span>
												<FiCheck className="text-green-500" />
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Job Prioritization</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
										</div>
										{/* Metaverse */}
										<div className="mb-5 flex flex-col gap-1 w-full">
											<p className="text-lg font-bold">Metaverse</p>
											<p className="flex justify-between w-full items-center">
												<span>Metaverse Access</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Voice Chatting</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Avatar Customization</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
										</div>
										{/* Wicket Profile */}
										<div className="mb-5 flex flex-col gap-1 w-full">
											<p className="text-lg font-bold">Wicket Profile</p>
											<p className="flex justify-between w-full items-center">
												<span>Profile Customization</span>
												<span>Limited</span>
											</p>

											<p className="flex justify-between w-full items-center">
												<span>Profile Bio Template Options</span>
												<span>Expert + 5</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Job Application Prioritization</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
										</div>
										{/* Job Seeking */}
										<div className="mb-5 flex flex-col gap-1 w-full">
											<p className="text-lg font-bold">Job Seeking</p>
											<p className="flex justify-between w-full items-center">
												<span>Prioritization by Career Tagging</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Prioritization by Proximity</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
										</div>
									</div>
								</div>

							</motion.div>
						)}

						{/* Provisioner's pricing mobile */}

						{accountType === "provisioner" && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 20 }}
								transition={{ duration: 0.5, ease: [0.87, 0.29, 0.13, 0.8] }}
							>
								{/* Junior tier */}
								<div tabIndex={0} className="collapse">
									<div className="collapse-title pr-0 flex justify-between text-xl font-medium">
										<span>Junior Tier</span>
										<span className="text-2xl font-bold flex items-center">
											₱0
											<FiChevronDown />
										</span>
									</div>
									<div className="collapse-content">
										{/* blog feed */}
										<div className="mb-5 flex flex-col gap-1 w-full">
											<p className="text-lg font-bold">Blog Feed</p>
											<p className="flex justify-between w-full items-center">
												<span>Blog Post</span>
												<span>5 posts/day</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Image Attachments in posts</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Upvoting Posts</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Commenting on Posts</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Advertisement Cards</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
										</div>

										{/* Job Posting */}
										<div className="mb-5 flex flex-col gap-1 w-full">
											<p className="text-lg font-bold">Job Postings</p>
											<p className="flex justify-between w-full items-center">
												<span>Template</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Prioritization</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Featured</span>
												<span>N/A</span>
											</p>
										</div>
										{/* Metaverse */}
										<div className="mb-5 flex flex-col gap-1 w-full">
											<p className="text-lg font-bold">Metaverse</p>
											<p className="flex justify-between w-full items-center">
												<span>Create / Host Venue</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Maximum Participants</span>
												<span>N/A</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Invite Guest/s</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
										</div>
										{/* Wicket Profile */}
										<div className="mb-5 flex flex-col gap-1 w-full">
											<p className="text-lg font-bold">Profile</p>
											<p className="flex justify-between w-full items-center">
												<span>Profile Customization</span>
												<span>Basic</span>
											</p>

											<p className="flex justify-between w-full items-center">
												<span>Suggestion Prioritization on Hunters</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
										</div>
									</div>
								</div>
								{/*Expert tier */}
								<div tabIndex={0} className="collapse">
									<div className="collapse-title pr-0 flex justify-between text-xl font-medium">
										<span>Expert Tier</span>
										<span className="text-2xl font-bold flex items-center">
											₱148/m
											<FiChevronDown />
										</span>
									</div>
									<div className="collapse-content">
										{/* blog feed */}
										<div className="mb-5 flex flex-col gap-1 w-full">
											<p className="text-lg font-bold">Blog Feed</p>
											<p className="flex justify-between w-full items-center">
												<span>Blog Post</span>
												<span>15 posts/day</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Image Attachments in posts</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Upvoting Posts</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Commenting on Posts</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Advertisement Cards</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
										</div>

										{/* Job Posting */}
										<div className="mb-5 flex flex-col gap-1 w-full">
											<p className="text-lg font-bold">Job Postings</p>
											<p className="flex justify-between w-full items-center">
												<span>Template</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Prioritization</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Featured</span>
												<span>1/Month</span>
											</p>
										</div>
										{/* Metaverse */}
										<div className="mb-5 flex flex-col gap-1 w-full">
											<p className="text-lg font-bold">Metaverse</p>
											<p className="flex justify-between w-full items-center">
												<span>Create / Host Venue</span>
												<span>
													<FiCheck className="text-green-500" />
												</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Maximum Participants</span>
												<span>25</span>
											</p>
											<p className="flex justify-between w-full items-center">
												<span>Invite Guest/s</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
										</div>
										{/* Wicket Profile */}
										<div className="mb-5 flex flex-col gap-1 w-full">
											<p className="text-lg font-bold">Profile</p>
											<p className="flex justify-between w-full items-center">
												<span>Profile Customization</span>
												<span>Limited</span>
											</p>

											<p className="flex justify-between w-full items-center">
												<span>Suggestion Prioritization on Hunters</span>
												<span>
													<FiX className="text-red-500" />
												</span>
											</p>
										</div>
									</div>
								</div>

							</motion.div>
						)}
					</AnimatePresence>
				}
			</main>
		</>
	);
};

export default Pricing;
