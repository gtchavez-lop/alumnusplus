import { useSession, useUser } from "@supabase/auth-helpers-react";

import Link from "next/link";

const ProtectedPageContainer = ({ children, ...pageProps }) => {
  const thisSession = useSession();

  return (
    <>
      {!!thisSession ? (
        <>{children}</>
      ) : (
        <>
          <div className="flex flex-col py-28 relative justify-center min-h-screen">
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-3xl font-bold text-center">
                You must be logged in to view this page.
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-md mt-10">
                <Link href={"/register"} className="btn btn-primary btn-block">
                  Sign Up
                </Link>
                <Link href={"/login"} className="btn btn-ghost btn-block">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProtectedPageContainer;
