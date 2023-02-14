import { FiArrowRight } from "react-icons/fi";
import Footer from "@/components/Landing/Footer";
import Link from "next/link";
import { __PageTransition } from "@/lib/animation";
import { motion } from "framer-motion";

export default function FeaturesPage() {
  return (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative min-h-screen w-full pt-24 pb-36"
      >
        <div class="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8">
          <div class="items-end justify-between sm:flex">
            <div class="max-w-xl">
              <h2 class="text-4xl font-bold tracking-tight sm:text-5xl">
                See what Wicket can do for you
              </h2>

              <p class="mt-8 max-w-lg opacity-50">
                Wicket is a career platform that allows you to connect
                professionals in your area. Providing you with the tools to
                succeed.
              </p>
            </div>

            <Link href="/login" class="mt-8 btn btn-primary sm:mt-0 lg:mt-8">
              Get started today
              <FiArrowRight className="ml-4" />
            </Link>
          </div>

          <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <blockquote
              id="blogging"
              class="flex h-full flex-col justify-between p-0 lg:p-4"
            >
              <div class="mt-4">
                <h3 class="text-xl font-bold text-secondary sm:text-2xl">
                  Mini-blogging
                </h3>

                <p class="mt-4 opacity-60">
                  This mini-blogging feature allows you to share your thoughts
                  with your followers. You can also share your thoughts with
                  other users.
                </p>
              </div>
            </blockquote>

            <blockquote
              id="companyhunting"
              class="flex h-full flex-col justify-between p-0 lg:p-4"
            >
              <div class="mt-4">
                <h3 class="text-xl font-bold text-secondary sm:text-2xl">
                  Geo-Company Hunting
                </h3>

                <p class="mt-4 opacity-60">
                  Hunters can search for companies in their current location.
                  Without the hassle of searching for companies on other sites.
                </p>
              </div>
            </blockquote>

            <blockquote
              id="jobposting"
              class="flex h-full flex-col justify-between p-0 lg:p-4"
            >
              <div class="mt-4">
                <h3 class="text-xl font-bold text-secondary sm:text-2xl">
                  Job Posting
                </h3>

                <p class="mt-4 opacity-60">
                  As a company, you can post jobs for other users to apply for.
                  Providing other users with the opportunity to work for your
                  company.
                </p>
              </div>
            </blockquote>

            <blockquote
              id="metaverse"
              class="flex h-full flex-col justify-between p-0 lg:p-4"
            >
              <div class="mt-4">
                <h3 class="text-xl font-bold text-secondary sm:text-2xl">
                  Metaverse
                </h3>

                <p class="mt-4 opacity-60">
                  The metaverse is a virtual world that allows you to connect
                  with other users as well as interact with the companies you
                  follow.
                </p>
              </div>
            </blockquote>
          </div>
        </div>
      </motion.main>

      <Footer />

      {/* <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative min-h-screen w-full pt-24 pb-36"
      >
        <h1 className="text-3xl font-bold mb-10">Wicket Features</h1>

        <p className="text-lg">Mini-blogging</p>
      </motion.main> */}
    </>
  );
}
