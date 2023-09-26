import { $accountDetails, $accountType } from "@/lib/globalStates";
import { FiArchive, FiBriefcase, FiHome, FiMenu } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { useStore } from "@nanostores/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Drawer } from "vaul";
import { Button } from "./ui/button";

const NavbarNew = () => {
	const [isOpen, setIsOpen] = useState(false);
	const _accountType = useStore($accountType);
	const _accountDetails = useStore($accountDetails);
	return (
		<div className="fixed top-0 left-0 w-full flex justify-center py-5 px-3 bg-background z-50">
			<div className="w-full max-w-5xl flex items-center justify-between">
				{/* brand and mobile menu */}
				<div className="flex gap-2 items-center">
					<Drawer.Root
						shouldScaleBackground
						open={isOpen}
						onOpenChange={(e) => setIsOpen(e)}
					>
						<Drawer.Trigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="inline-flex lg:hidden"
							>
								<FiMenu className="text-lg" />
							</Button>
						</Drawer.Trigger>
						<Drawer.Portal>
							<Drawer.Overlay className="fixed bg-black/80 top-0 left-0 w-full h-screen z-[51]" />
							<Drawer.Content className="fixed bottom-0 left-0 w-full min-h-[200px] z-[52] flex items-end justify-between">
								<div className="relative w-full max-w-5xl rounded-t-xl bg-background pt-16 pb-12 px-5 flex flex-col gap-1">
									<div className="absolute top-0 left-0 w-full py-5 flex justify-center">
										<div className="w-12 h-1 bg-foreground/10 rounded-full " />
									</div>
									{/* no one logged in */}
									{!_accountType && (
										<>
											<Button variant="ghost">About</Button>
											<Button variant="ghost">Contact</Button>
											<Link href="/login" className="w-full">
												<Button variant="ghost" className="w-full">
													Login
												</Button>
											</Link>
											<Link href="/register" className="w-full">
												<Button className="w-full">Register</Button>
											</Link>
										</>
									)}
									{/* hunter */}
									{_accountType === "hunter" && (
										<>
											<Link href="/h/feed">
												<Button
													onClick={() => setIsOpen(false)}
													className="w-full"
													variant="ghost"
												>
													My Content Feed
												</Button>
											</Link>
											<Link href="/h/jobs">
												<Button
													onClick={() => setIsOpen(false)}
													className="w-full"
													variant="ghost"
												>
													Jobs
												</Button>
											</Link>
											<Link href="/h/drift">
												<Button
													onClick={() => setIsOpen(false)}
													className="w-full"
													variant="ghost"
												>
													Companies
												</Button>
											</Link>
											<Link href="/h/me">
												<Button
													onClick={() => setIsOpen(false)}
													className="w-full"
													variant="ghost"
												>
													My Profile
												</Button>
											</Link>
										</>
									)}
									{/* provisioner */}
								</div>
							</Drawer.Content>
							<Drawer.Overlay />
						</Drawer.Portal>
					</Drawer.Root>

					<Image
						alt="logo"
						height={45}
						width={45}
						src="/logo/wicket-new-adaptive.png"
					/>
				</div>
				<div className="hidden lg:flex items-center gap-2">
					{/* no one logged in */}
					{/* {!_accountType && (
						<>
							<Button variant="ghost">About</Button>
							<Button variant="ghost">Contact</Button>
							<Button variant="ghost">Login</Button>
							<Button>Register</Button>
						</>
					)} */}
					{/* hunter */}
					{_accountType === "hunter" && (
						<>
							<Link href="/h/feed">
								<Button variant="ghost" size='icon'>
									<FiHome />
								</Button>
							</Link>
							<Link href="/h/jobs">
								<Button variant="ghost" size='icon'>
									<FiBriefcase />
								</Button>
							</Link>
							<Link href="/h/drift">
								<Button variant="ghost" size='icon'>
									<FiArchive />
								</Button>
							</Link>
							<Link href="/h/me">
								<Avatar className="ml-4">
									<AvatarFallback>
										{_accountDetails?.type === "hunter" &&
											_accountDetails.full_name.first[0]}
										{_accountDetails?.type === "hunter" &&
											_accountDetails.full_name.last[0]}
									</AvatarFallback>
									<AvatarImage
										src={
											_accountDetails?.type === "hunter"
												? _accountDetails.avatar_url
												: "https://avatars.dicebear.com/api/avataaars/123.svg"
										}
									/>
								</Avatar>
							</Link>
						</>
					)}
					{/* provisioner */}
				</div>
			</div>
		</div>
	);
};

export default NavbarNew;
