import { $schema_hunter } from "../../schemas/user";
import Cities from "../../schemas/ph_location.json";
import { FiX } from "react-icons/fi";
import Link from "next/link";
import SkillList from "../../schemas/skills.json";
import { __PageTransition } from "../../lib/animation";
import { __supabase } from "../../supabase";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useState } from "react";

const RegisterHunter = () => {
  const router = useRouter();

  const [secondarySkillInput, setSecondarySkillInput] = useState("");
  const [selectedSecondarySkills, setSelectedSecondarySkills] = useState([]);
  const [secondarySkillResults, setSecondarySkillResults] = useState([]);

  const schema = $schema_hunter;

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Registering...");

    // disable all inputs from form
    // const elems = e.elements;
    // elems.forEach((element) => {
    //   element.disabled = true;
    // });

    const form = e.target;

    // validate form
    const formData = new FormData(form);

    const data = Object.fromEntries(formData.entries());

    // update schema
    schema.address.address = data.address;
    schema.address.city = data.city;
    schema.address.postalCode = data.postalCode;
    schema.birthdate = data.birthdate;
    schema.birthplace = data.birthplace;
    schema.connections = [];
    schema.createdAt = dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    schema.education = [];
    schema.email = data.email;
    schema.gender = data.gender;
    schema.fullName.first = data.firstName;
    schema.fullName.last = data.lastName;
    schema.fullName.middle = data.middleName;
    schema.skillPrimary = data.primarySkill;
    schema.skillSecondary = selectedSecondarySkills;
    schema.type = "hunter";
    schema.updatedAt = dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    schema.username = data.username;

    // register to supabase
    const { error: err } = await __supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: schema,
      },
    });

    if (err) {
      toast.error(err.message);
      // elems.forEach((element) => {
      //   element.disabled = false;
      // });
    }

    toast.success("Registered successfully!");

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
        <h1 className="text-3xl font-bold">Register as a Hunter</h1>

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

          <p className="text-xl font-bold mt-5">Personal Details</p>
          <div className="flex flex-col bg-base-200 p-3 rounded-btn">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              className="input"
              placeholder="Username"
              required
            />

            <label htmlFor="firstname" className="mt-2">
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              className="input"
              placeholder="John"
              required
            />

            <label htmlFor="middlename" className="mt-2">
              Middle Name
            </label>
            <input
              type="text"
              name="middlename"
              id="middlename"
              className="input"
              placeholder="Doe"
            />

            <label htmlFor="lastname" className="mt-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              className="input"
              placeholder="Doe"
              required
            />

            <label htmlFor="gender" className="mt-2">
              Gender
            </label>
            <select name="gender" id="gender" className="select">
              <option value="" selected>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="na">Prefer not to say</option>
            </select>

            <label htmlFor="birthdate" className="mt-2">
              Birthdate
            </label>
            <input
              type="date"
              name="birthdate"
              id="birthdate"
              className="input"
              required
            />

            <label htmlFor="birthplace" className="mt-2">
              Birthplace
            </label>
            <input
              type="text"
              name="birthplace"
              id="birthplace"
              className="input"
              placeholder="City, Country"
              required
            />
          </div>

          <p className="text-xl font-bold mt-5">Home Address</p>
          <div className="flex flex-col bg-base-200 p-3 rounded-btn">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              className="input"
              placeholder="Address"
              required
            />

            <label htmlFor="city" className="mt-2">
              City
            </label>
            <select name="city" id="city" className="select">
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
              min={0}
              max={9999}
              required
              defaultValue={1428}
            />
          </div>

          <p className="text-xl font-bold mt-5">Skillset</p>
          <div className="flex flex-col bg-base-200 p-3 rounded-btn">
            <label htmlFor="primarySkill">Primary Skill</label>
            <select name="primarySkill" id="primarySkill" className="select">
              {SkillList.map((skill) => (
                <option value={skill}>{skill}</option>
              ))}
            </select>

            <label htmlFor="secondarySkill" className="mt-2">
              Secondary Skill
            </label>
            <input
              type="text"
              name="secondarySkill"
              id="secondarySkill"
              className="input"
              placeholder="Secondary Skill"
              value={secondarySkillInput}
              onChange={(e) => setSecondarySkillInput(e.target.value)}
            />
            {secondarySkillInput.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {SkillList.filter((skill) =>
                  skill
                    .toLowerCase()
                    .includes(secondarySkillInput.toLowerCase())
                ).map((skill) => (
                  <div
                    className="badge badge-primary cursor-pointer hover:badge-secondary"
                    onClick={() => {
                      setSelectedSecondarySkills([
                        ...selectedSecondarySkills,
                        skill,
                      ]);
                      setSecondarySkillInput("");
                    }}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            )}
            {selectedSecondarySkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSecondarySkills.map((skill) => (
                  <div className="flex items-center gap-2 bg-base-300 p-2 rounded-btn">
                    <p>{skill}</p>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setSelectedSecondarySkills(
                          selectedSecondarySkills.filter(
                            (selectedSkill) => selectedSkill !== skill
                          )
                        );
                      }}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* submit */}
          <div className="flex flex-col mt-5">
            <button type="submit" className="btn btn-primary">
              Register
            </button>

            <p className="text-sm">
              By clicking Register, you agree to our{" "}
              <Link href="/terms" className="link">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="link">
                Privacy Policy
              </Link>
            </p>

            <p className="text-center mt-10">
              Already have an account? <Link href="/login">Login</Link>
            </p>
          </div>
        </form>
      </motion.main>
    </>
  );
};

export default RegisterHunter;
