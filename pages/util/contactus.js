import { FiHome, FiMail, FiPhone, FiSend } from "react-icons/fi";

import Footer from "@/components/Landing/Footer";
import { __PageTransition } from "@/lib/animation";
import { motion } from "framer-motion";

export default function ContactUsPage() {
  return (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative min-h-screen w-full pt-24 pb-36"
      >
        <section class="relative z-10 overflow-hidden py-20 ">
          <div class="container mx-auto">
            <div class="-mx-4 flex flex-wrap lg:justify-between relative">
              <img
                className="absolute h-full hidden lg:block right-24 -z-10 opacity-50"
                src="/uuundulate.svg"
              />
              <div class="w-full px-4 lg:w-1/2 xl:w-6/12">
                <div class="mb-12 max-w-[570px] lg:mb-0">
                  <span class="text-primary mb-4 block text-base font-semibold">
                    Contact Us
                  </span>
                  <h2 class="text-dark mb-6 text-[32px] font-bold uppercase sm:text-[40px] lg:text-[36px] xl:text-[40px]">
                    GET IN TOUCH WITH US
                  </h2>
                  <p class="text-body-color mb-9 text-base leading-relaxed">
                    We are here to help you. Please fill out the form below and
                    we will get back to you as soon as possible.
                  </p>
                  <div class="mb-8 flex w-full max-w-[370px]">
                    <div class="bg-primary text-primary mr-6 flex h-[60px] w-full max-w-[100px] items-center justify-center overflow-hidden rounded bg-opacity-5 sm:h-[70px] sm:max-w-[70px]">
                      <FiHome className="text-2xl" />
                    </div>
                    <div class="w-full">
                      <h4 class="text-dark mb-1 text-xl font-bold">
                        Our Location
                      </h4>
                      <p class="text-body-color text-base">
                        Congressional Rd. Camarin, Caloocan City
                      </p>
                    </div>
                  </div>
                  <div class="mb-8 flex w-full max-w-[370px]">
                    <div class="bg-primary text-primary mr-6 flex h-[60px] w-full max-w-[100px] items-center justify-center overflow-hidden rounded bg-opacity-5 sm:h-[70px] sm:max-w-[70px]">
                      <FiPhone className="text-2xl" />
                    </div>
                    <div class="w-full">
                      <h4 class="text-dark mb-1 text-xl font-bold">
                        Phone Number
                      </h4>
                      <p class="text-body-color text-base">
                        (+639) 12 345 6789
                      </p>
                    </div>
                  </div>
                  <div class="mb-8 flex w-full max-w-[370px]">
                    <div class="bg-primary text-primary mr-6 flex h-[60px] w-full max-w-[100px] items-center justify-center overflow-hidden rounded bg-opacity-5 sm:h-[70px] sm:max-w-[70px]">
                      <FiMail className="text-2xl" />
                    </div>
                    <div class="w-full">
                      <h4 class="text-dark mb-1 text-xl font-bold">
                        Email Address
                      </h4>
                      <p class="text-body-color text-base">
                        info@yourdomain.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-full px-4 lg:w-1/2 xl:w-5/12">
                <div class="relative rounded-lg bg-base-200 bg-opacity-50 p-8 sm:p-12">
                  <form>
                    <div class="mb-6">
                      <input
                        type="text"
                        placeholder="Your Name"
                        class="input input-primary w-full"
                      />
                    </div>
                    <div class="mb-6">
                      <input
                        type="email"
                        placeholder="Your Email"
                        class="input input-primary w-full"
                      />
                    </div>
                    <div class="mb-6">
                      <textarea
                        rows="6"
                        placeholder="Your Message"
                        class="textarea textarea-primary w-full"
                      ></textarea>
                    </div>
                    <div>
                      <button
                        type="submit"
                        class="btn btn-primary btn-block items-center gap-2"
                      >
                        Send Message <FiSend />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </motion.main>
      <Footer />
    </>
  );
}
