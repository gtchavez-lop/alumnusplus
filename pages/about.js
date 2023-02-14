import { AnimatePresence, motion } from "framer-motion";
import { FiCheck, FiChevronDown, FiX } from "react-icons/fi";
import { useState } from "react";
import Footer from "../components/Landing/Footer";

const about = () => {
  return (
    <>
      <img
        src="./registrationbg.svg"
        class="absolute w-full min-h-[50vh] left-0 top-0 object-contain object-top opacity-30"
        alt=""
      ></img>

      <div class="min-h-screen justify-center items-center mt-44">
        <h2 class="text-center font-bold text-5xl mb-14">About</h2>

        <div class="px-20 text-center-justify">
          <div>
            <p class="text-2xl font-bold mt-24">About Wicket</p>
            <p class="py-5 text-lg px-5 mb-14">
              Come on in and discover what opportunities await you at Wicket—a
              progressive web career platform for Hunters and Provisioners (in
              Manila/ or ibang chika idk). By establishing a platform where job
              providers and job seekers can interact with each other, Wicket
              aims to help the steady increase of the employment rate in the
              Philippines.
            </p>
          </div>
          <div>
            <p class="text-2xl font-bold">Who Are We?</p>
            <p class="py-5 text-lg px-5">
              Wicket is developed by Wicket Journeys _ a band of senior college
              students (from UCC) running on caffeine-injected three-hour
              sleeps, dreams of making it to the end of the semester, and hopes
              of alleviating employment issues in (Metro Manila/ the
              Philippines).
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default about;
