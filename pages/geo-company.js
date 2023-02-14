import { AnimatePresence, motion } from "framer-motion";
import { FiCheck, FiChevronDown, FiX } from "react-icons/fi";
import { useState } from "react";
import Footer from "../components/Landing/Footer";

const geo = () => {
  return (
    <>
      <img
        src="./registrationbg.svg"
        class="absolute w-full min-h-[50vh] left-0 top-0 object-contain object-top opacity-30"
        alt=""
      ></img>

      <div class="min-h-screen justify-center items-center mt-44 px-20">
        <h2 class="text-center font-bold text-5xl mb-14">
          Geo-Company Hunting (Company Finder)
        </h2>

        <div>
          <div>
            <p class="text-2xl font-bold mt-24">[Hunter:]</p>
            <p class="py-5 text-lg px-5 mb-14">
              Discover companies near you using Wicket’s Drift, a geolocation
              company finder to easily view job openings from your area.
            </p>
          </div>
          <div>
            <p class="text-2xl font-bold">[Provisioner:]</p>
            <p class="py-5 text-lg px-5">
              <b>Be discovered!</b> At Wicket we have Drift, a geolocation
              company finder. Job hunters can easily find companies like you
              that offer career opportunities from the area.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default geo;
