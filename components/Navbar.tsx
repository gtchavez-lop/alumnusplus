import { $SolidAccountType, $SolidHunterAccountData } from "@/lib/globalstore";
import { FC, useEffect, useState } from "react";
import { FiSun, FiUser } from "react-icons/fi";

import { IUserHunter } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { themeChange } from "theme-change";
import { useStore } from '@nanostores/react'

type NavbarProps = {}

const Navbar: FC<NavbarProps> = () => {
  const [accountType, setAccountType] = useState<"hunter" | "provisioner" | "visitor">("visitor");

  useEffect(() => {
    themeChange(false);
  }, [])

  useEffect(() => {
    setAccountType($SolidAccountType.get());
  }, [$SolidAccountType.get()])

  return (
    <nav className="fixed top-0 left-0 w-full py-5 z-50 bg-base-100 flex items-center justify-center">
      <div className="flex justify-between items-center w-full max-w-5xl px-2 lg:px-0">
        <Image
          width={50}
          height={50}
          alt="Wicket Logo"
          src={"/logo/wicket-new-adaptive.png"}
        />
        {accountType === "hunter" && (
          <div className="flex items-center gap-2">
            <Link href="/hunter/feed" className="btn btn-ghost">
              Feed
            </Link>
            <Link href="/hunter/companies" className="btn btn-ghost">
              Companies
            </Link>
            <Link href="/hunter/jobs" className="btn btn-ghost">
              Jobs
            </Link>
            <Link href="/hunter/me" className="btn btn-ghost btn-square">
              {$SolidHunterAccountData.get() && <Image
                alt="User Avatar"
                width={30}
                height={30}
                className="avatar mask mask-circle"
                src={($SolidHunterAccountData.get() as IUserHunter).avatar_url}
              />}
            </Link>
          </div>
        )}
        {accountType === "provisioner" && (
          <p>PROVISIONER</p>
        )}
        {accountType === "visitor" && (
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="btn btn-primary btn-sm">
              Login
            </Link>
            <button
              type="button"
              data-toggle-theme="dark,light"
              className="btn btn-ghost btn-square btn-sm" >
              <FiSun />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;