import { useEffect, useState } from "react";

import { __PageTransition } from "../../lib/animtions";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const Finder = () => {
  const router = useRouter();
  const [userCoorinates, setUserCoordinates] = useState();
  const [userIP, setUserIP] = useState();

  const getLocation = async () => {
    const res = await fetch(`http://ip-api.com/json/${userIP.ip}`);
    const data = await res.json();

    setUserCoordinates(data);
  };

  const getIP = async () => {
    const res = await fetch("https://ipapi.co/json/", {
      // fix cors issue
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const data = await res.json();

    // setUserIP(data);
    // getLocation();

    console.log(data);
  };

  useEffect(() => {
    getIP();
  }, []);

  return (
    <>
      <motion.main
        variants={__PageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="mt-16"
      >
        <p>Finder</p>

        <p>{JSON.stringify(userCoorinates)}</p>
      </motion.main>
    </>
  );
};

export default Finder;
