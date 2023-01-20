import { FiInfo, FiPlus } from "react-icons/fi";

import Skills from "../../schemas/skills.json";
import dayjs from "dayjs";
import { useState } from "react";

const CvBuilder = () => {
  return (
    <>
      <main>
        <div className="text-3xl font-bold flex items-start">
          Wicket CV Builder
          <label
            htmlFor="generalinformation"
            className="badge badge-accent ml-2 cursor-pointer"
          >
            <FiInfo />
          </label>
        </div>

        <div className="alert alert-info mt-4">
          <p>Please click the badge beside the title for more information</p>
        </div>
        <div className="alert alert-warning mt-4">
          <p>
            This feature is still in development. Breaking changes can occur
            without prior notice. Please use this feature at your own risk.
          </p>
        </div>

        <p className="mt-10">
          Your data from your Wicket Account will be migrated to the output
        </p>

        {/* input fields */}
        <div className="grid grid-cols-1 gap-5 mt-5">
          {/* professional cover statement */}
          <div className="flex flex-col">
            <p className="text-xl mb-2 text-primary">Additional Input Fields</p>

            <label className="font-bold text-lg">Cover Statement</label>
            <textarea
              type="text"
              name="coverStatement"
              className="textarea textarea-bordered min-h-[200px]"
              placeholder="Cover Statement"
            />
          </div>
        </div>

        {/* theme picker */}
        <div className="mt-10">
          <p className="text-xl mb-2 text-primary">Themes</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 ">
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  style={{
                    animationDelay: `${i * 50}ms`,
                  }}
                  className="w-full h-[120px] bg-base-300 animate-pulse"
                />
              ))}
          </div>
        </div>

        {/* create button */}
        <div className="mt-10">
          <button className="btn btn-primary btn-block items-center gap-2">
            <FiPlus />
            Create
          </button>
        </div>
      </main>

      <input type="checkbox" id="generalinformation" className="modal-toggle" />
      <label htmlFor="generalinformation" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl">About Wicket CV Builder</h3>
          <p className="py-4 flex flex-col gap-2">
            <span>
              For the best experience, please use a desktop or laptop computer.
            </span>
            <span>
              The CV builder will migrate your data from your Wicket account to
              the downloadable output. All you need to do is to fill in an
              addional field in the CV builder, pick a theme, confirm your
              choices, and download the file.
            </span>
            <span>
              You can use your PDF copy to apply for jobs inside or outside the
              bounds of Wicket.
            </span>
          </p>
          <div className="modal-action">
            <label htmlFor="generalinformation" className="btn">
              Close
            </label>
          </div>
        </div>
      </label>
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
