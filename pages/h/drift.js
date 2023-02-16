import { useEffect, useState } from "react";

import { FiLoader } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { __PageTransition } from "@/lib/animation";
import { __supabase } from "@/supabase";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useQueries } from "@tanstack/react-query";

// import ProtectedPageContainer from "@/components/ProtectedPageContainer";

// import { useSupabaseClient } from "@supabase/auth-helpers-react";






const ProtectedPageContainer = dynamic(
  () => import("@/components/ProtectedPageContainer"),
  { ssr: false }
);

const DriftPage = () => {
  const [driftLoading, setDriftLoading] = useState(true);
  // const __supabase = useSupabaseClient();

  const [driftData] = useQueries({
    queries: [
      {
        queryKey: ["drift-data"],
        queryFn: async () => {
          const { data, error } = await __supabase
            .from("user_provisioners")
            .select("*")
            .limit(9);

          if (error) {
            toast.error(error.message);
          }

          return data;
        },
      },
    ],
  });

  return (
    <>
      <ProtectedPageContainer>
        {driftData.isLoading ? (
          <motion.main
            variants={__PageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative min-h-screen w-full pt-24 pb-36"
          >
            <h1 className="text-2xl lg:text-3xl mb-10 font-bold text-center">
              Companies near your area
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
              {Array(9)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={`company-skeleton-${index}`}
                    className="p-3 bg-base-300 rounded-btn h-[224px]"
                  >
                    <div className="flex flex-col items-center gap-2 cursor-pointer">
                      <div className="w-[100px] h-[100px] bg-base-100 rounded-full animate-pulse" />
                      <div className="w-[100px] h-[24px] bg-base-100 animate-pulse delay-75" />
                      <div className="w-full rounded-btn h-[48px] mt-4 bg-base-100 animate-pulse delay-150" />
                    </div>
                  </div>
                ))}
            </div>
          </motion.main>
        ) : (
          <motion.main className="relative min-h-screen w-full pt-24 pb-36">
            <h1 className="text-2xl lg:text-3xl mb-10 font-bold text-center">
              Companies near your area
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
              {driftData.data.map((company, index) => (
                <Link
                  key={`company-${index}`}
                  href={`/p/${company.id}`}
                  passHref
                  className="p-3 bg-base-300 rounded-btn h-[224px]"
                >
                  <div className="flex flex-col items-center gap-2 cursor-pointer">
                    <Image
                      src={`https://avatars.dicebear.com/api/bottts/${company.id}.svg`}
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                    <p>{company.legalName}</p>
                  </div>

                  <div className="btn btn-primary btn-block mt-5">See more</div>
                </Link>
              ))}
            </div>
          </motion.main>
        )}
      </ProtectedPageContainer>
    </>
  );
};

export default DriftPage;
