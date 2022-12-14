import {
  $prov_companySize,
  $prov_companyType,
  $prov_industryType,
  $prov_tags,
  $schema_provisioner,
} from "../../schemas/user";

import Cities from "../../schemas/ph_location.json";
import Link from "next/link";
import { __PageTransition } from "../../lib/animation";
import { __supabase } from "../../supabase";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const RegisterProvisioner = () => {
  const schema = $schema_provisioner;
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Creating account...");

    const form = e.target;

    // validate form
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // update schema
    schema.address.physicalAddress = data.address;
    schema.address.city = data.city;
    schema.address.postalCode = data.postalCode;
    schema.alternativeNames = data.alternativeNames.split(",");
    schema.companySize = data.companySize;
    schema.companyType = data.companyType;
    schema.contactInformation.email = data.email;
    schema.contactInformation.phone = data.phone;
    schema.foundingYear = data.foundingYear;
    schema.fullDescription = data.fullDescription;
    schema.industryType = data.industryType;
    schema.legalName = data.legalName;
    schema.shortDescription = data.shortDescription;
    schema.socialProfiles.facebook = data.facebook;
    schema.socialProfiles.instagram = data.instagram;
    schema.socialProfiles.linkedin = data.linkedin;
    schema.socialProfiles.twitter = data.twitter;
    schema.type = "provisioner";
    schema.website = data.website;

    const { error } = await __supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: schema,
      },
    });

    if (error) {
      console.log(error);
    }

    toast.dismiss();
    toast.success("Account created successfully!");

    router.push("/login");
  };

  return (
    <>
      <img
        src="/registrationbg.svg"
        alt="Background"
        className="fixed top-0 left-0 w-full h-full object-cover opacity-25"
      />

      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative min-h-screen w-full pt-24 pb-36"
      >
        <h1 className="text-3xl font-bold">Register as a Provisioner</h1>

        <form onSubmit={handleSubmit} className="flex flex-col max-w-md mt-10">
          <p className="text-xl font-bold">Account Details</p>
          <div className="flex flex-col bg-base-200 p-3 rounded-btn">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="input"
              placeholder="Email"
              required
            />

            <label htmlFor="password" className="mt-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="input"
              placeholder="************"
              required
            />
          </div>

          <p className="text-xl font-bold mt-5">Company Details</p>
          <div className="flex flex-col bg-base-200 p-3 rounded-btn">
            <label htmlFor="legalName">Company Name</label>
            <input
              type="text"
              name="legalName"
              id="legalName"
              className="input"
              placeholder="Company Name"
              required
            />

            <label htmlFor="alternativeNames">
              Alternative Name (optional)
            </label>
            <input
              type="text"
              name="alternativeNames"
              id="alternativeNames"
              className="input"
              placeholder="Alternative name"
            />

            <label htmlFor="companyType" className="mt-2">
              Company Type
            </label>
            <select name="companyType" id="companyType" className="input">
              <option value="" disabled selected>
                Select a company type
              </option>
              {$prov_companyType.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <label htmlFor="companySize" className="mt-2">
              Company Size
            </label>
            <select name="companySize" id="companySize" className="input">
              <option value="" disabled selected>
                Select a company size
              </option>
              {$prov_companySize.map((size, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <label htmlFor="industryType" className="mt-2">
              Industry Type
            </label>
            <select name="industryType" id="industryType" className="input">
              <option value="" disabled selected>
                Select an industry type
              </option>
              {$prov_industryType.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <label htmlFor="foundingYear" className="mt-2">
              Year Founded
            </label>
            <input
              type="number"
              name="foundingYear"
              id="foundingYear"
              className="input"
              placeholder="Year founded"
              required
            />
          </div>

          <p className="text-xl font-bold mt-5">Company Address</p>
          <div className="flex flex-col bg-base-200 p-3 rounded-btn">
            <label htmlFor="address">Physical Address</label>
            <input
              type="text"
              name="address"
              id="address"
              className="input"
              placeholder="Physical Address"
              required
            />

            <label htmlFor="city" className="mt-2">
              City
            </label>
            <select name="city" id="city" className="select">
              <option value="" disabled selected>
                Select a city
              </option>
              {Cities.map((city) => (
                <option
                  selected={city.city === "Caloocan City"}
                  value={city.city}
                >
                  {city.city}
                </option>
              ))}
            </select>

            <label htmlFor="postalCode" className="mt-2">
              Postal Code
            </label>
            <input
              type="number"
              name="postalCode"
              id="postalCode"
              className="input"
              placeholder="Postal Code"
              required
            />
          </div>

          <p className="text-xl font-bold mt-5">Company Description</p>
          <div className="flex flex-col bg-base-200 p-3 rounded-btn">
            <label htmlFor="shortDescription">Short Description</label>
            <textarea
              name="shortDescription"
              id="shortDescription"
              className="textarea"
              placeholder="Short Description"
              required
            />

            <label htmlFor="fullDescription" className="mt-2">
              Full Description
            </label>
            <textarea
              name="fullDescription"
              id="fullDescription"
              className="textarea"
              placeholder="Full Description"
              required
            />
          </div>

          <p className="text-xl font-bold mt-5">Contact Information</p>
          <div className="flex flex-col bg-base-200 p-3 rounded-btn">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              name="phone"
              id="phone"
              className="input"
              placeholder="Phone Number"
              required
            />

            <label htmlFor="facebook" className="mt-2">
              Facebook Link (Optional)
            </label>
            <input
              type="text"
              name="facebook"
              id="facebook"
              className="input"
              placeholder="Facebook Link"
            />

            <label htmlFor="instagram">Instagram Link (Optional)</label>
            <input
              type="text"
              name="instagram"
              id="instagram"
              className="input"
              placeholder="Instagram Link"
            />

            <label htmlFor="linkedin">LinkedIn Link (Optional)</label>
            <input
              type="text"
              name="linkedin"
              id="linkedin"
              className="input"
              placeholder="LinkedIn Link"
            />

            <label htmlFor="twitter">Twitter Link (Optional)</label>
            <input
              type="text"
              name="twitter"
              id="twitter"
              className="input"
              placeholder="Twitter Link"
            />

            <label htmlFor="youtube">YouTube Link (Optional)</label>
            <input
              type="text"
              name="youtube"
              id="youtube"
              className="input"
              placeholder="YouTube Link"
            />

            <label htmlFor="website">Website Link (Optional)</label>
            <input
              type="text"
              name="website"
              id="website"
              className="input"
              placeholder="Website Link"
            />
          </div>

          {/* submit */}
          <div className="flex flex-col mt-5 w-full">
            <button type="submit" className="btn btn-primary w-full">
              Submit
            </button>

            <p>
              By clicking the button, you agree to our{" "}
              <Link href="/terms" className="link link-primary">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="link link-primary">
                Privacy Policy
              </Link>
            </p>
            <p className="mt-10 text-center">
              Already have an account?{" "}
              <Link href="/login" className="link link-primary">
                Login
              </Link>
            </p>
          </div>
        </form>
      </motion.main>
    </>
  );
};

export default RegisterProvisioner;
