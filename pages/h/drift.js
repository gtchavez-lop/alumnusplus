import { useEffect, useState } from "react";

import { FiLoader } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { __PageTransition } from "../../lib/animation";
// import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { __supabase } from "../../supabase";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const DriftPage = () => {
  const [driftLoading, setDriftLoading] = useState(true);
  const [driftData, setDriftData] = useState([]);
  // const __supabase = useSupabaseClient();

  const fetchDriftData = async () => {
    const {
      data: { user },
    } = await __supabase.auth.getUser();

    // const { data, error } = await __supabase.rpc("getpeoplebylocation", {
    //   in_location: user.user_metadata?.address?.city,
    // });

    const { data, error } = await __supabase
      .from("user_provisioners")
      .select("*")
      .limit(100);

    // check for address
    if (!user.user_metadata?.address?.city) {
      toast.error("Please add your address to find people near you");
      return;
    }

    // compare city
    const filteredData = data.filter((company) => {
      return company.address?.city === user.user_metadata?.address?.city;
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    setDriftData(filteredData);
    setDriftLoading(false);
  };

  useEffect(() => {
    fetchDriftData();
  }, []);

  if (driftLoading) {
    return (
      <div className="flex justify-center items-center flex-col gap-2 w-full h-screen">
        <FiLoader className="animate-spin text-4xl text-primary" />
        <p>Finding companies near your area</p>
      </div>
    );
  }

  return (
    <>
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
          {driftData.map((company, index) => (
            <Link
              key={`company-${index}`}
              href={`/p/${company.legalName}`}
              passHref
              className="p-3 bg-base-300 rounded-btn"
            >
              <div className="flex flex-col items-center gap-2 cursor-pointer">
                <Image
                  src={`https://avatars.dicebear.com/api/bottts/${company.legalName}.svg`}
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <p>{company.legalName}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.main>
    </>
  );
};

export default DriftPage;
