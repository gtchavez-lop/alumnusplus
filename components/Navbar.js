import {
  FiGrid,
  FiMail,
  FiMapPin,
  FiMenu,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";

import Link from "next/link";
import Logo from "./Logo";
import __supabase from "../lib/auth";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "./UserContext";

const Navbar = ({ routePath }) => {
  const { $user, $userData, $setUser, $setUserData } = useUser();
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("supabase.auth.token")
      ? JSON.parse(localStorage.getItem("supabase.auth.token"))
      : null;

    if (session) {
      $setUser(session.currentSession.user);

      if (!$userData) {
        __supabase
          .from("user_data")
          .select("*")
          .single()
          .eq("id", session.currentSession.user.id)
          .then((res) => {
            if (res.data) {
              $setUserData(res.data);
            }
          });
      }
    }
  }, [routePath]);

  useEffect(() => {
    const session = localStorage.getItem("supabase.auth.token")
      ? JSON.parse(localStorage.getItem("supabase.auth.token"))
      : null;

    if (session) {
      $setUser(session.currentSession.user);
    }
  }, []);

  return (
    $user && (
      <>
        <nav className="z-[99] px-4 lg:px-0 py-5 hover:py-7 duration-500 transition-all fixed top-0 left-0 w-full flex justify-center bg-base-300">
          <main className="w-full max-w-4xl flex justify-between items-center">
            <Logo />
            <div className="lg:flex gap-2 hidden">
              <Link href="/feed">
                <div className="btn btn-ghost btn-square">
                  <FiGrid size={17} />
                </div>
              </Link>
              <div className="btn btn-ghost btn-square">
                <FiMail size={17} />
              </div>
              <div className="btn btn-ghost btn-square">
                <FiMapPin size={17} />
              </div>
              <div className="btn btn-ghost btn-square">
                <FiShoppingCart size={17} />
              </div>
              <Link href={"/me"}>
                <div className="btn btn-ghost btn-square">
                  <FiUser size={17} />
                </div>
              </Link>
            </div>

            {/* mobile menu */}

            <label
              htmlFor="mobileDrawer"
              className="btn btn-primary btn-square btn-sm drawer-button lg:hidden"
            >
              <FiMenu />
            </label>
          </main>
        </nav>
      </>
    )
  );
};

export default Navbar;
