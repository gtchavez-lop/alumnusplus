import { FiLoader } from "react-icons/fi";
import __supabase from "../../lib/supabase";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelect } from "react-supabase";

const HunterPage = () => {
  const router = useRouter();
  const { username } = router.query;

  const [
    { data: hunterData, loading: hunterLoading, error: hunterError },
    reexecuteHunter,
  ] = useSelect("user_hunters", {
    columns: "*",
    filter: (query) => query.eq("username", username),
    options: { count: "exact" },
  });

  if (hunterLoading) {
    return (
      <>
        <main className="fixed top-0 left-0 w-full h-screen flex flex-col justify-center items-center">
          <FiLoader className="text-4xl animate-spin" />
        </main>
      </>
    );
  }

  return (
    <>
      <main className="pt-28">
        <h1>{username}</h1>
      </main>
    </>
  );
};

export default HunterPage;
