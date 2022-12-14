import { useEffect, useState } from "react";

import { FiLoader } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { __PageTransition } from "../../lib/animation";
import { __supabase } from "../../supabase";
import { motion } from "framer-motion";

const DriftPage = () => {
  const [driftLoading, setDriftLoading] = useState(true);
  const [driftData, setDriftData] = useState([]);

  const fetchDriftData = async () => {
    const {
      data: { user },
    } = await __supabase.auth.getUser();

    const { data, error } = await __supabase.rpc("getpeoplebylocation", {
      in_location: user.user_metadata?.address?.city,
    });

    const filtered = data.filter(
      (thisUser) => thisUser.username !== user.user_metadata.username
    );

    if (error) {
      toast.error(error.message);
      return;
    }

    setDriftLoading(false);
    setDriftData(filtered);
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
          People near you
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
          {/* mock data from users */}
          {driftData.map((user, index) => (
            <Link
              key={`user-${index}`}
              href={`/h/${user.username}`}
              className="flex flex-col gap-4 px-4 py-3 bg-base-300 rounded-btn cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <Image
                src={`https://avatars.dicebear.com/api/bottts/${user.username}.svg`}
                width={70}
                height={70}
                className="self-center"
              />

              <div className="flex flex-col">
                <p className="text-xl font-semibold text-center">
                  {user.username}
                </p>
                <p className="text-center text-sm opacity-50">
                  {user.address?.city}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </motion.main>
    </>
  );
};

export default DriftPage;
