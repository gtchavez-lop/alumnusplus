import { FiAlertCircle } from "react-icons/fi";
import ProtectedPageContainer from "@/components/ProtectedPageContainer";
import { __PageTransition } from "../../lib/animation";
import { __supabase } from "../../supabase";
import { motion } from "framer-motion";

export const getServerSideProps = async (context) => {
	const { id } = context.query;

	const { data, error } = await __supabase.from("user_provisioners").select("*").eq("id", id).single();

	if (error) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			companyData: data,
		},
	};
};

const CompanyPage = ({ companyData, notFound }) => {
	return (
		<>
			<ProtectedPageContainer>
				{notFound && (
					<div className="flex justify-center items-center flex-col gap-2 w-full h-screen">
						<FiAlertCircle className="text-4xl text-primary" />
						<p>Company not found</p>
					</div>
				)}
				{!!companyData && (
					<motion.main
						variants={__PageTransition}
						initial="initial"
						animate="animate"
						exit="exit"
						className="pb-36 lg:pt-24 pt-20"
					>
						<div className="flex flex-col mx-auto max-w-lg gap-5">
							<img
								// dicebear avatars
								src={`https://avatars.dicebear.com/api/bottts/${companyData.id}.svg`}
								alt="Company Logo"
								className="w-32 h-32 mx-auto rounded-full"
							/>

							<h1 className="text-2xl lg:text-3xl font-bold text-center">{companyData.legalName}</h1>

							<p className="text-center">{companyData.fullDescription}</p>

							{/* tabs */}
							<div className="tabs tabs-boxed justify-center mt-10">
								<p className="tab">Tab 1</p>
								<p className="tab tab-active">Tab 2</p>
								<p className="tab">Tab 3</p>
							</div>

							<div className="flex flex-col gap-2 mt-10">
								<p className="text-2xl font-bold text-primary">Company Information</p>
								<p className="flex justify-between">
									<span className="font-bold">Company Type:</span> {companyData.companyType || "N/A"}
								</p>
								<p className="flex justify-between">
									<span className="font-bold">Company Size:</span> {companyData.companySize || "N/A"}
								</p>
								<p className="flex justify-between">
									<span className="font-bold">Industry Type:</span> {companyData.industryType || "N/A"}
								</p>
								<p className="flex justify-between">
									<span className="font-bold">Founding Year:</span> {companyData.foundingYear || "N/A"}
								</p>
							</div>

							<div className="flex flex-col gap-2 mt-10">
								<p className="text-2xl font-bold text-primary">Location and Contact Information</p>
								<p className="flex justify-between">
									<span className="font-bold">Email:</span> {companyData.contactInformation.email || "N/A"}
								</p>
								<p className="flex justify-between">
									<span className="font-bold">Phone:</span> {companyData.contactInformation.phone || "N/A"}
								</p>
								<p className="flex justify-between">
									<span className="font-bold">Website:</span> {companyData.website || "N/A"}
								</p>

								<p className="flex justify-between">
									<span className="font-bold">Physical Address:</span> {companyData.address.physicalAddress || "N/A"}
								</p>
								<p className="flex justify-between">
									<span className="font-bold">City:</span> {companyData.address.city || "N/A"}
								</p>
								<p className="flex justify-between">
									<span className="font-bold">Postal Code:</span> {companyData.address.postalCode || "N/A"}
								</p>
							</div>

							<div className="flex flex-col gap-2 mt-10">
								<p className="text-2xl font-bold text-primary">Social Profiles</p>
								<p className="flex justify-between">
									<span className="font-bold">Facebook:</span> {companyData.socialProfiles.facebook || "N/A"}
								</p>
								<p className="flex justify-between">
									<span className="font-bold">Twitter:</span> {companyData.socialProfiles.twitter || "N/A"}
								</p>
								<p className="flex justify-between">
									<span className="font-bold">Instagram:</span> {companyData.socialProfiles.instagram || "N/A"}
								</p>
								<p className="flex justify-between">
									<span className="font-bold">LinkedIn:</span> {companyData.socialProfiles.linkedin || "N/A"}
								</p>
								<p className="flex justify-between">
									<span className="font-bold">Github:</span> {companyData.socialProfiles.github || "N/A"}
								</p>
								<p className="flex justify-between">
									<span className="font-bold">Youtube:</span> {companyData.socialProfiles.youtube || "N/A"}
								</p>
							</div>
						</div>
					</motion.main>
				)}
			</ProtectedPageContainer>
		</>
	);
};

export default CompanyPage;
