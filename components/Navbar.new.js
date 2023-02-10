import {
  FiBell,
  FiBriefcase,
  FiGlobe,
  FiHome,
  FiLogIn,
  FiMap,
  FiPenTool,
  FiUser,
  FiUserPlus,
} from "react-icons/fi";

import Link from "next/link";
import Logo from "./Logo";
import { __supabase } from "@/supabase";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";

const Navbar = () => {
  const localUser = useUser();
  const router = useRouter();

  return (
    <>
      {/* desktop */}
      <div className="w-full fixed py-5 flex justify-center z-[999] px-5 lg:px-0 bg-base-100">
        <div className="w-full max-w-6xl flex items-center justify-between">
          <div>
            <Logo />
          </div>
          <div className="hidden lg:flex items-center gap-2">
            {!!localUser && (
              <>
                {localUser.user_metadata.type === "hunter" && (
                  <>
                    <Link
                      href="/h/feed"
                      className={`btn ${
                        router.pathname.includes("/h/feed")
                          ? "btn-primary"
                          : "btn-ghost"
                      }`}
                    >
                      <FiHome className="text-lg" />
                    </Link>
                    <Link
                      href="/h/drift"
                      className={`btn ${
                        router.pathname.includes("/h/drift")
                          ? "btn-primary"
                          : "btn-ghost"
                      }`}
                    >
                      <FiMap className="text-lg" />
                    </Link>
                    <Link
                      href="/h/jobs"
                      className={`btn ${
                        router.pathname.includes("/h/jobs")
                          ? "btn-primary"
                          : "btn-ghost"
                      }`}
                    >
                      <FiBriefcase className="text-lg" />
                    </Link>
                    <Link
                      href="/h/events"
                      className={`btn ${
                        router.pathname.includes("/h/events")
                          ? "btn-primary"
                          : "btn-ghost"
                      }`}
                    >
                      <FiGlobe className="text-lg" />
                    </Link>
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost">
                        <FiBell className="text-lg" />
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow-lg bg-base-200 rounded-btn w-[400px] gap-1"
                      >
                        {Array(5)
                          .fill()
                          .map((_, i) => (
                            <li key={`notifskeleton_${i}`}>
                              <a
                                style={{ animationDelay: `${i * 100}ms` }}
                                className="bg-zinc-500 bg-opacity-40 animate-pulse text-transparent"
                              >
                                Placeholder notification
                              </a>
                            </li>
                          ))}

                        <Link href="/h/notifications">
                          <li className="my-5 link text-center">
                            See all notifications
                          </li>
                        </Link>
                      </ul>
                    </div>
                    <Link
                      href="/h/me"
                      className={`btn ${
                        router.pathname.includes("/h/me")
                          ? "btn-primary"
                          : "btn-ghost"
                      }`}
                    >
                      <FiUser className="text-lg" />
                    </Link>
                  </>
                )}

                {localUser.user_metadata.type === "provisioner" && (
                  <>
                    <Link
                      href="/p/dashboard"
                      className={`btn ${
                        router.pathname.includes("/p/dashboard")
                          ? "btn-primary"
                          : "btn-ghost"
                      }`}
                    >
                      <FiHome className="text-lg" />
                    </Link>
                    <Link
                      href="/p/jobs"
                      className={`btn ${
                        router.pathname.includes("/p/jobs")
                          ? "btn-primary"
                          : "btn-ghost"
                      }`}
                    >
                      <FiBriefcase className="text-lg" />
                    </Link>
                    <Link
                      href="/p/events"
                      className={`btn ${
                        router.pathname.includes("/p/events")
                          ? "btn-primary"
                          : "btn-ghost"
                      }`}
                    >
                      <FiGlobe className="text-lg" />
                    </Link>
                    <Link
                      href="/p/me"
                      className={`btn ${
                        router.pathname.includes("/p/me")
                          ? "btn-primary"
                          : "btn-ghost"
                      }`}
                    >
                      <FiUser className="text-lg" />
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
          <div className="flex lg:hidden items-center gap-2">
            {!!localUser && (
              <>
                {localUser.user_metadata.type === "hunter" && (
                  <>
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost">
                        <FiBell className="text-lg" />
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow-lg bg-base-200 rounded-btn w-screen max-w-xl -mr-5 md:-mr-0"
                      >
                        <li>
                          <a>1</a>
                        </li>
                        <li>
                          <a>2</a>
                        </li>
                        <li>
                          <a>3</a>
                        </li>
                        <li>
                          <a>4</a>
                        </li>
                        <li>
                          <a>Only display 5 latest notifications</a>
                        </li>

                        <Link href="/h/notifications">
                          <li className="my-5 link text-center">
                            See all notifications
                          </li>
                        </Link>
                      </ul>
                    </div>
                    {/* <Link
                      href="/h/notifications"
                      className={`btn ${
                        router.pathname.includes("/h/notifications")
                          ? "btn-primary"
                          : "btn-ghost"
                      }`}
                    >
                      <FiBell className="text-lg" />
                    </Link> */}
                  </>
                )}

                {localUser.user_metadata.type === "provisioner" && (
                  <>
                    <Link
                      href="/p/dashboard"
                      className={`btn ${
                        router.pathname.includes("/p/dashboard")
                          ? "btn-primary"
                          : "btn-ghost"
                      }`}
                    >
                      <FiHome className="text-lg" />
                    </Link>
                    <Link
                      href="/p/jobs"
                      className={`btn ${
                        router.pathname.includes("/p/jobs")
                          ? "btn-primary"
                          : "btn-ghost"
                      }`}
                    >
                      <FiBriefcase className="text-lg" />
                    </Link>
                    <Link
                      href="/p/events"
                      className={`btn ${
                        router.pathname.includes("/p/events")
                          ? "btn-primary"
                          : "btn-ghost"
                      }`}
                    >
                      <FiGlobe className="text-lg" />
                    </Link>
                    <Link
                      href="/p/me"
                      className={`btn ${
                        router.pathname.includes("/p/me")
                          ? "btn-primary"
                          : "btn-ghost"
                      }`}
                    >
                      <FiUser className="text-lg" />
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {!localUser && (
            <div className="flex items-center gap-2">
              <Link
                href="/register"
                className={`btn btn-primary gap-2 items-center`}
              >
                <FiUserPlus className="text-lg" />
                <span>Register</span>
              </Link>
              <Link
                href="/login"
                className={`btn btn-ghost gap-2 items-center`}
              >
                <FiLogIn className="text-lg" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* mobile */}
      <div className="w-full fixed py-5 bottom-0 flex justify-around md:justify-center lg:hidden z-[999] px-5 lg:px-0 bg-base-100 gap-2">
        {!!localUser && (
          <>
            {localUser.user_metadata.type === "hunter" && (
              <>
                <Link
                  href="/h/feed"
                  className={`btn ${
                    router.pathname.includes("/h/feed")
                      ? "btn-primary"
                      : "btn-ghost"
                  }`}
                >
                  <FiHome className="text-lg" />
                </Link>
                <Link
                  href="/h/drift"
                  className={`btn ${
                    router.pathname.includes("/h/drift")
                      ? "btn-primary"
                      : "btn-ghost"
                  }`}
                >
                  <FiMap className="text-lg" />
                </Link>
                <Link
                  href="/h/jobs"
                  className={`btn ${
                    router.pathname.includes("/h/jobs")
                      ? "btn-primary"
                      : "btn-ghost"
                  }`}
                >
                  <FiBriefcase className="text-lg" />
                </Link>
                <Link
                  href="/h/events"
                  className={`btn ${
                    router.pathname.includes("/h/events")
                      ? "btn-primary"
                      : "btn-ghost"
                  }`}
                >
                  <FiGlobe className="text-lg" />
                </Link>
                <Link
                  href="/h/me"
                  className={`btn ${
                    router.pathname.includes("/h/me")
                      ? "btn-primary"
                      : "btn-ghost"
                  }`}
                >
                  <FiUser className="text-lg" />
                </Link>
              </>
            )}

            {localUser.user_metadata.type === "provisioner" && (
              <>
                <Link
                  href="/p/dashboard"
                  className={`btn ${
                    router.pathname.includes("/p/dashboard")
                      ? "btn-primary"
                      : "btn-ghost"
                  }`}
                >
                  <FiHome className="text-lg" />
                </Link>
                <Link
                  href="/p/jobs"
                  className={`btn ${
                    router.pathname.includes("/p/jobs")
                      ? "btn-primary"
                      : "btn-ghost"
                  }`}
                >
                  <FiBriefcase className="text-lg" />
                </Link>
                <Link
                  href="/p/events"
                  className={`btn ${
                    router.pathname.includes("/p/events")
                      ? "btn-primary"
                      : "btn-ghost"
                  }`}
                >
                  <FiGlobe className="text-lg" />
                </Link>
                <Link
                  href="/p/me"
                  className={`btn ${
                    router.pathname.includes("/p/me")
                      ? "btn-primary"
                      : "btn-ghost"
                  }`}
                >
                  <FiUser className="text-lg" />
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
