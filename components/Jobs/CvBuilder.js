import { FiPlus } from "react-icons/fi";
import Skills from "../../schemas/skills.json";
import dayjs from "dayjs";
import { useState } from "react";

const CvBuilder = () => {
  const [secondarySkills, setSecondarySkills] = useState([]);
  const [workExperiences, setWorkExperiences] = useState([]);

  return (
    <>
      <main className="mt-5">
        <p>Under Construction</p>
      </main>
    </>
  );
};

export default CvBuilder;

// <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//   {/* personal details */}
//   <div className="flex flex-col">
//     <p className="text-xl mb-2 text-primary">Personal Details</p>

//     <label className="font-bold">First Name</label>
//     <input
//       type="text"
//       name="firstName"
//       className="input input-bordered"
//       placeholder="First Name"
//     />

//     <label className="font-bold">Last Name</label>
//     <input
//       type="text"
//       name="lastName"
//       className="input input-bordered"
//       placeholder="Last Name"
//     />

//     <label className="font-bold">Email</label>
//     <input
//       type="text"
//       name="email"
//       className="input input-bordered"
//       placeholder="Email"
//     />

//     <label className="font-bold">Birthdate</label>
//     <input
//       type="date"
//       name="birthdate"
//       className="input input-bordered"
//       max={dayjs().format("YYYY-MM-DD")}
//     />

//     <label className="font-bold">Birthplace</label>
//     <input
//       type="text"
//       name="birthplace"
//       className="input input-bordered"
//       placeholder="Birthplace"
//     />
//   </div>

//   {/* education */}
//   <div className="flex flex-col">
//     <p className="text-xl mb-2 text-primary">Education</p>

//     <label className="font-bold">Primary School</label>
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
//       <input
//         type="text"
//         name="primarySchool"
//         className="input input-bordered col-span-full lg:col-span-2"
//         placeholder="Primary School"
//       />
//       <input
//         type="number"
//         name="yearGraduatedPrimarySchool"
//         className="input input-bordered col-span-full lg:col-span-1"
//         min={1900}
//         max={2099}
//         step={1}
//         placeholder="Year Graduated"
//       />
//     </div>

//     <label className="font-bold">Junior School</label>
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
//       <input
//         type="text"
//         name="juniorSchool"
//         className="input input-bordered col-span-full lg:col-span-2"
//         placeholder="Junior School"
//       />
//       <input
//         type="number"
//         name="yearGraduatedJuniorSchool"
//         className="input input-bordered col-span-full lg:col-span-1"
//         min={1900}
//         max={2099}
//         step={1}
//         placeholder="Year Graduated"
//       />
//     </div>

//     <label className="font-bold">Senior School</label>
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
//       <input
//         type="text"
//         name="seniorSchool"
//         className="input input-bordered col-span-full lg:col-span-2"
//         placeholder="Senior School"
//       />
//       <input
//         type="number"
//         name="yearGraduatedSeniorSchool"
//         className="input input-bordered col-span-full lg:col-span-1"
//         min={1900}
//         max={2099}
//         step={1}
//         placeholder="Year Graduated"
//       />
//     </div>

//     <label className="font-bold">University</label>
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
//       <input
//         type="text"
//         name="university"
//         className="input input-bordered col-span-full lg:col-span-2"
//         placeholder="University"
//       />
//       <input
//         type="number"
//         name="yearGraduatedUniversity"
//         className="input input-bordered col-span-full lg:col-span-1"
//         min={1900}
//         max={2099}
//         step={1}
//         placeholder="Year Graduated"
//       />
//     </div>

//     <label className="font-bold">Degree</label>
//     <input
//       type="text"
//       name="degree"
//       className="input input-bordered"
//       placeholder="Bachelor of Science in Computer Science"
//     />
//   </div>

//   {/* work experiences */}
//   <div className="flex flex-col">
//     <p className="text-xl mb-2 text-primary">Work Experiences</p>

//     <button className="btn btn-primary">
//       <FiPlus />
//       <span>Add Work Experience</span>
//     </button>
//   </div>

//   {/* skills */}
//   <div className="flex flex-col">
//     <p className="text-xl mb-2 text-primary">Skills</p>

//     <label className="font-bold">Primary Skill</label>
//     <select name="primarySkill" className="select select-bordered">
//       <option value="">Select Primary Skill</option>
//       {Skills.map((skill, index) => (
//         <option key={index} value={skill}>
//           {skill}
//         </option>
//       ))}
//     </select>
//   </div>
// </div>;
