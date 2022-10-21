import { useEffect, useState } from "react";

import { __PageTransition } from "../../lib/animtions";
import __supabase from "../../lib/supabase";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const Finder = () => {
  const router = useRouter();
  const [userCoorinates, setUserCoordinates] = useState();
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  // const getDeviceLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       setUserCoordinates({
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude,
  //       });
  //     });
  //   } else {
  //     alert("Geolocation is not supported by this browser.");
  //   }
  // };

  const getSuggestedUsers = async () => {
    const { data, error } = await __supabase
      .from("user_data")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.log(error);
    } else {
      const user = __supabase.auth.user();
      // filter out the current user based on residing city same as the user's
      // residing city
      const filtered = data.filter(
        (e) => e.residing_city === user.user_metadata.residing_city
      );
      setSuggestedUsers(filtered);

      // getDeviceLocation();
    }
  };

  const checkUser = async () => {
    const user = __supabase.auth.user();
    if (!user) {
      router.push("/");
    } else {
      // getDeviceLocation();
      getSuggestedUsers();
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="pb-16 lg:pt-24 pt-36"
      >
        <p className="text-3xl">Finder</p>
      </motion.main>
    </>
  );
};

export default Finder;
