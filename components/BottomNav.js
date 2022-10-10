import {
  FiGrid,
  FiHome,
  FiMail,
  FiMapPin,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import { useEffect, useState } from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const BottomNav = (e) => {
  const router = useRouter();
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    if (
      router.pathname === "/" ||
      router.pathname === "/signin" ||
      router.pathname === "/signup"
    ) {
      setHasUser(false);
    } else {
      setHasUser(true);
    }
  }, [router.pathname]);

  return (
    hasUser && (
      <>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="btm-nav btm-nav-md lg:hidden bg-base-200"
        >
          <button>
            <FiMapPin className="text-lg" />
          </button>
          <button>
            <FiSearch className="text-lg" />
          </button>
          <Link href={"/feed"}>
            <button
              className={`${router.pathname == "/feed" && "active bg-primary"}`}
            >
              <FiGrid className="text-lg" />
            </button>
          </Link>
          <Link href={"/messages"}>
            <button
              className={`${
                router.pathname == "/messages" && "active bg-primary"
              }`}
            >
              <FiMail className="text-lg" />
            </button>
          </Link>
          <Link href={"/me"}>
            <button
              className={`${router.pathname == "/me" && "active bg-primary"}`}
            >
              <FiUser className="text-lg" />
            </button>
          </Link>
        </motion.div>
      </>
    )
  );
};

export default BottomNav;
