import { AnimPageTransition } from "@/lib/animations";
import Footer from "@/components/Footer";
import { NextPage } from "next";
import { motion } from "framer-motion";

const thePeople = [
	{
		name: "Gabbie",
		img: "https://scontent.fmnl17-2.fna.fbcdn.net/v/t39.30808-6/259425825_3145982925678296_8772332315210230055_n.jpg?stp=dst-jpg_s552x414&_nc_cat=109&ccb=1-7&_nc_sid=174925&_nc_eui2=AeFl_I0kmWy0e7jH3gwD_LNFjraa2pG4JeyOtprakbgl7BsgMmyTUTxmnvjqAc07wDklknSyIIJn1eijuqL1glu3&_nc_ohc=Tka4oH0HPK0AX_RO0tn&_nc_oc=AQmrcVfEf1v32XhTSPUPenXaIAc4mtlSzL5fuODpiZpbEY9t-OaFbXBNx07ZvQ1pBXg&_nc_ht=scontent.fmnl17-2.fna&oh=00_AfAVma2XFgs2aHmNwNkzka_GC3opSjc-W_tPhikTWdDusg&oe=63FE2C03",
		position: "Project Manager",
	},
	{
		name: "Gerald",
		img: "https://scontent.fmnl17-2.fna.fbcdn.net/v/t39.30808-6/311484914_163048533068797_9007400381193825351_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeElw3h9S1nHxrlr-xvUKqY_N0B-XKHYZ4c3QH5codhnh4xvFBuyInjQ2x20Y1SgUwEQGRqGP6feX97kBFpQHaEm&_nc_ohc=y9jz_0iB5p4AX8cBleh&_nc_oc=AQllCku53NwS4xG-fS1nQghInnIQRSvN3W35kYDK1tOUVDU5Ipu_idYmUgWij5eTHcQ&_nc_ht=scontent.fmnl17-2.fna&oh=00_AfDYtOJxQxn1M3qqyk5_0fePKn8R2jVtchzhw8-aXrgoRg&oe=63FE891E",
		position: "Principal Engineer (Wicket)",
	},
	{
		name: "Edz",
		img: "https://scontent.fmnl17-1.fna.fbcdn.net/v/t1.6435-9/120532600_2874550119455050_4965997204105022504_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=174925&_nc_eui2=AeG8uCdCRUF0RQyaSyPGNZYwJ11eWg_z9kEnXV5aD_P2QeDk3XfrcqqIGnTPzBInFSUA8ua0wWM4c3T2a8Po2O62&_nc_ohc=IyjxvVu19vMAX9f3Hi-&_nc_ht=scontent.fmnl17-1.fna&oh=00_AfCesP_FEt5sqV22Mz-8xOsCOJjcou3IK6WtzhPQbwAuHw&oe=64213B50",
		position: "Principal Engineer (Metaverse)",
	},
	{
		name: "Carlo",
		img: "https://scontent.fmnl17-3.fna.fbcdn.net/v/t39.30808-6/318716889_3439224729689412_8836940335539121092_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_eui2=AeEOa0dsypKrhwpXjE2NBi6GGmPf09jp0QUaY9_T2OnRBbe7J6QRsJMmmLCJychE7gYapxXxYUu4LXuUdC-rFJdS&_nc_ohc=ZVmAWf9BZQMAX9qyfeN&_nc_ht=scontent.fmnl17-3.fna&oh=00_AfAAd46PCA5475xivTlepb-oWyWXytSRPT7VCpeVfUqJpQ&oe=63FF8A7F",
		position: "Front-end Developer",
	},
	{
		name: "Trizha",
		img: "https://scontent.fmnl17-4.fna.fbcdn.net/v/t1.6435-1/161382868_2215778801889737_2123336780444100417_n.jpg?stp=dst-jpg_s200x200&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_eui2=AeGvv2UXBTsq04vf3q8mc2T8sHA9xE7NW5-wcD3ETs1bn7iwOaf_7kbuWHY3bo_dcRPoUOJrtVpSRXhOgnBoIAtf&_nc_ohc=oKGSuC-Qn3oAX-siDI0&_nc_ht=scontent.fmnl17-4.fna&oh=00_AfBbL8eD1IYM5ivh1Uy4-xf0LhzWdIo6B-MTdRSO0p5Pvg&oe=6421520F",
		position: "Writer",
	},
	{
		name: "Kevin",
		img: "https://scontent.fmnl17-3.fna.fbcdn.net/v/t39.30808-6/289511429_5077662955680332_2128374369712907889_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFOslY07o6Ak6bOtxAgfeGSxIYkjKkmaUrEhiSMqSZpSj-EtYvAd6PhXdAy6e6522j0L2YwTHW-Wm1Yy8HPx6xB&_nc_ohc=uFddMCSsiQMAX-k6x6t&_nc_ht=scontent.fmnl17-3.fna&oh=00_AfDj_YL-Vt1Hgw8f47jximheYSm_gCdDLlOcBOxshWq1Vg&oe=63FF0548",
		position: "Designer",
	},
	{
		name: "Novie",
		img: "https://scontent.fmnl17-1.fna.fbcdn.net/v/t39.30808-6/317247293_1999624140227606_8586978352296187326_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFP_osJy7M-ZYpBk7CI9A9ZmSEZPqNxVCKZIRk-o3FUIvFpbbKuT1lHxUWNWeYP8U1eJSkWWZ03ikQcUdObtI2k&_nc_ohc=hfmWqno4NWAAX8c-2tC&_nc_ht=scontent.fmnl17-1.fna&oh=00_AfBud8EMcYT-DOfERQjPU5qAv3MyeAWxPvuZj4koMPBX4g&oe=63FE680D",
		position: "Designer",
	},
	{
		name: "Jaymar",
		img: "https://scontent.fmnl17-4.fna.fbcdn.net/v/t1.6435-9/50822353_1873490919446572_6742196346515619840_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=174925&_nc_eui2=AeGTajqKHgsC9feoBzcy7X2_-m0fvuyHqjn6bR--7IeqOYOaX32xAgDTT9itOz0fZOV8XCG0BV9ligNd8P7RnXGM&_nc_ohc=PYagkrv-rOgAX8T-B6e&_nc_oc=AQnmMEY_z3IHU4xL_8AMp1LoFM1rOLRHH7pHIEKxZz-B8GqicFANmAE8zFWK1ACz5U0&_nc_ht=scontent.fmnl17-4.fna&oh=00_AfBkvDSVEAUX3nAqNcp6aTHtTTBoz4KO4bFC5pm0u-Mr0Q&oe=6421468C",
		position: "Metaverse Developer",
	},
	{
		name: "Efrhaim",
		img: "https://scontent.fmnl17-2.fna.fbcdn.net/v/t39.30808-1/270346577_4590645697700048_2739008001882973979_n.jpg?stp=dst-jpg_p200x200&_nc_cat=111&ccb=1-7&_nc_sid=7206a8&_nc_eui2=AeHGPv22bYjzlXLqb5OgvR5cjOHL6ZLXz2SM4cvpktfPZEvfwZgwxMRj3Le5rOCJl-gU5RfoWh5a4mqfVJV2YBye&_nc_ohc=C7kcX5Lq7r0AX_orfib&_nc_ht=scontent.fmnl17-2.fna&oh=00_AfAdboDJnF4Qc4tR3GfweOfDoUvI4ZBF2-JYgi_gByOjog&oe=63FF58E6",
		position: "Writer",
	},
	{
		name: "Lloyd",
		img: "https://scontent.fmnl17-2.fna.fbcdn.net/v/t1.6435-9/136453732_3749605491765572_6122066089272258254_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeGqH1TnVLNmBZ3Tw9Hync9ySe9GMtUBa0JJ70Yy1QFrQi1IysbcZiYTgMrJjot1qonSFJ9bHfvfv-kesF4KRHCm&_nc_ohc=G8JlGjU8vVUAX9xSdEf&_nc_ht=scontent.fmnl17-2.fna&oh=00_AfD3Fry-hiQx3QSEb-YuDKMOgpLqpZXheUggIfvofCIJ_w&oe=64215F78",
		position: "Meta Developer",
	},
	{
		name: "Jaypee",
		img: "https://scontent.fmnl17-3.fna.fbcdn.net/v/t39.30808-1/242166546_4305390912871103_6063649611982478208_n.jpg?stp=dst-jpg_p200x200&_nc_cat=103&ccb=1-7&_nc_sid=7206a8&_nc_eui2=AeGZhMPVqytV0V_s0ZBaiH12tEZP3tYxN-y0Rk_e1jE37OZDRBnxt7jeaVUyRukVebgiVc2x72IbRQ7fQryv-Fd5&_nc_ohc=0EqFyS46nq0AX8N0XDH&_nc_ht=scontent.fmnl17-3.fna&oh=00_AfCDSE9U2sTFDqdVjvMN1RDK9X6jSQ7jG80zNZnlLVJW2w&oe=63FF7B43",
		position: "Multimedia Manager",
	},
	{
		name: "Miks",
		img: "https://scontent.fmnl17-1.fna.fbcdn.net/v/t39.30808-6/285476384_2226206564222426_9192555490739058391_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=174925&_nc_eui2=AeHLwMvTdL1Z_jKccu7NwEZ62m9zNffjuwnab3M19-O7CT-nXXNl-f-QsA4vLAGnhyVOr4DkGePMpm5LCRSFdVxC&_nc_ohc=Kd1iq2AwQPQAX-_YTNz&_nc_ht=scontent.fmnl17-1.fna&oh=00_AfAhoOpNLT_JLXUjTOX6xet0b9Bz-P3iP31Bwz9vWnE4jw&oe=63FFB9BA",
		position: "Front-end Developer",
	},
];

const AboutPage: NextPage = () => {
	return (
		<>
			<motion.div
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-16 lg:pt-24 pb-36"
			>
				<div className="flex flex-col lg:flex-row justify-between gap-8">
					<div className="w-full lg:w-5/12 flex flex-col justify-center">
						<h1 className="text-3xl lg:text-4xl font-bold leading-9 text-primary pb-4">
							About Us
						</h1>
						<p className="font-normal text-base leading-6 text-base-content ">
							Come on in and discover what opportunities await you at Wicket—a
							progressive web career platform for Hunters and Provisioners (in
							Manila/ or ibang chika idk). By establishing a platform where job
							providers and job seekers can interact with each other, Wicket
							aims to help the steady increase of the employment rate in the
							Philippines.
						</p>
					</div>
					<div className="w-full lg:w-8/12 ">
						<img
							className="w-full h-full object-cover rounded-btn"
							src="https://scontent.fmnl17-2.fna.fbcdn.net/v/t1.15752-9/315092373_702370021036486_3384845880542952343_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=ae9488&_nc_eui2=AeH3092hEVMner9C85AwEIJepaKSLdlVJM-lopIt2VUkz3TkFwVsmlGcJ4SRiP4v9-e-oC_QxRqzC5ymwOkiX7u6&_nc_ohc=JyElUvVdYIwAX-w9cp2&_nc_ht=scontent.fmnl17-2.fna&oh=03_AdStBFcFDF5SuNy3NtYhLKrLnAD4Tt6Y50WpAQI_0LKhbg&oe=6421600D"
							alt="A group of People"
						/>
					</div>
				</div>

				<div className="flex lg:flex-row flex-col justify-between gap-8 pt-12">
					<div className="w-full lg:w-5/12 flex flex-col justify-center">
						<h1 className="text-3xl lg:text-4xl font-bold leading-9 text-primary pb-4">
							Our Story
						</h1>
						<p className="font-normal text-base leading-6 text-base-content ">
							Wicket is developed by Wicket Journeys - a band of college
							students (from UCC) running on caffeine-injected three-hour
							sleeps, dreams of making it to the end of the semester, and hopes
							of alleviating employment issues in (Metro Manila/ the
							Philippines).
						</p>
					</div>
					<div className="w-full lg:w-8/12 lg:pt-8">
						<div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-2 lg:gap-2">
							{thePeople.map((person, key: number) => (
								<div
									key={`person-${key + 1}`}
									className="p-4 pb-6 flex justify-center flex-col items-center"
								>
									<img
										className="md:block hidden object-cover object-center w-[100px] h-[100px] rounded-full"
										src={person.img}
										alt={person.name}
									/>
									<img
										className="md:hidden block object-cover object-center w-[100px] h-[100px] rounded-full"
										src={person.img}
										alt={person.name}
									/>
									<p className="font-medium text-xl leading-5 mt-4 text-center">
										{person.name}
										<br />
										<span className="font-normal leading-none opacity-50 text-xs">
											{person.position}
										</span>
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</motion.div>
			<Footer />
		</>
	);
};

export default AboutPage;
