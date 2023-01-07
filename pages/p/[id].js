import { __PageTransition } from "../../lib/animation";
import { __supabase } from "../../supabase";
import { motion } from "framer-motion";

export const getServerSideProps = async (context) => {
  const { id } = context.query;

  const { data, error } = await __supabase
    .from("user_provisioners")
    .select("*")
    .eq("id", id)
    .single();

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
  if (notFound) {
    return (
      <div className="flex justify-center items-center flex-col gap-2 w-full h-screen">
        <FiAlertCircle className="text-4xl text-primary" />
        <p>Company not found</p>
      </div>
    );
  }

  // {
  //   "address": {
  //     "city": "Caloocan City",
  //     "physicalAddress": "1234 Main St.",
  //     "postalCode": "1428"
  //   },
  //   "alternativeNames": [
  //     ""
  //   ],
  //   "companySize": "11-50",
  //   "companyType": "Private Companies",
  //   "contactInformation": {
  //     "email": "chavezgerald23+2@gmail.com",
  //     "phone": "1234567890"
  //   },
  //   "foundingYear": 2021,
  //   "fullDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  //   "id": "542eaac9-d851-4b0b-8ef3-793d0c9098d1",
  //   "industryType": "",
  //   "jobPostings": [],
  //   "legalName": "Wicket Journeys",
  //   "shortDescription": "Masaya sa Wicket Journeys",
  //   "socialProfiles": {
  //     "facebook": "",
  //     "github": "",
  //     "instagram": "",
  //     "linkedin": "",
  //     "twitter": "",
  //     "youtube": ""
  //   },
  //   "tags": [],
  //   "type": "provisioner",
  //   "website": "",
  //   "companyEmail": "chavezgerald23+2@gmail.com"
  // }

  return (
    <>
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

          <h1 className="text-2xl lg:text-3xl font-bold text-center">
            {companyData.legalName}
          </h1>

          <p className="text-center">{companyData.fullDescription}</p>

          {/* tabs */}
          <div className="tabs tabs-boxed justify-center mt-10">
            <p className="tab">Tab 1</p>
            <p className="tab tab-active">Tab 2</p>
            <p className="tab">Tab 3</p>
          </div>

          <div className="flex flex-col gap-2 mt-10">
            <p className="text-2xl font-bold text-primary">
              Company Information
            </p>
            <p className="flex justify-between">
              <span className="font-bold">Company Type:</span>{" "}
              {companyData.companyType || "N/A"}
            </p>
            <p className="flex justify-between">
              <span className="font-bold">Company Size:</span>{" "}
              {companyData.companySize || "N/A"}
            </p>
            <p className="flex justify-between">
              <span className="font-bold">Industry Type:</span>{" "}
              {companyData.industryType || "N/A"}
            </p>
            <p className="flex justify-between">
              <span className="font-bold">Founding Year:</span>{" "}
              {companyData.foundingYear || "N/A"}
            </p>
          </div>

          <div className="flex flex-col gap-2 mt-10">
            <p className="text-2xl font-bold text-primary">
              Location and Contact Information
            </p>
            <p className="flex justify-between">
              <span className="font-bold">Email:</span>{" "}
              {companyData.contactInformation.email || "N/A"}
            </p>
            <p className="flex justify-between">
              <span className="font-bold">Phone:</span>{" "}
              {companyData.contactInformation.phone || "N/A"}
            </p>
            <p className="flex justify-between">
              <span className="font-bold">Website:</span>{" "}
              {companyData.website || "N/A"}
            </p>

            <p className="flex justify-between">
              <span className="font-bold">Physical Address:</span>{" "}
              {companyData.address.physicalAddress || "N/A"}
            </p>
            <p className="flex justify-between">
              <span className="font-bold">City:</span>{" "}
              {companyData.address.city || "N/A"}
            </p>
            <p className="flex justify-between">
              <span className="font-bold">Postal Code:</span>{" "}
              {companyData.address.postalCode || "N/A"}
            </p>
          </div>

          <div className="flex flex-col gap-2 mt-10">
            <p className="text-2xl font-bold text-primary">Social Profiles</p>
            <p className="flex justify-between">
              <span className="font-bold">Facebook:</span>{" "}
              {companyData.socialProfiles.facebook || "N/A"}
            </p>
            <p className="flex justify-between">
              <span className="font-bold">Twitter:</span>{" "}
              {companyData.socialProfiles.twitter || "N/A"}
            </p>
            <p className="flex justify-between">
              <span className="font-bold">Instagram:</span>{" "}
              {companyData.socialProfiles.instagram || "N/A"}
            </p>
            <p className="flex justify-between">
              <span className="font-bold">LinkedIn:</span>{" "}
              {companyData.socialProfiles.linkedin || "N/A"}
            </p>
            <p className="flex justify-between">
              <span className="font-bold">Github:</span>{" "}
              {companyData.socialProfiles.github || "N/A"}
            </p>
            <p className="flex justify-between">
              <span className="font-bold">Youtube:</span>{" "}
              {companyData.socialProfiles.youtube || "N/A"}
            </p>
          </div>
        </div>
      </motion.main>
    </>
  );
};

export default CompanyPage;
