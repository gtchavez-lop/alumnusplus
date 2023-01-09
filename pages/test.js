import { useEffect, useState } from "react";

import { __supabase } from "../supabase";

const TestPage = ({ session }) => {
  const fetchUser = async () => {
    const { data, error } = await __supabase.rpc("get_hunter_by_id", {
      input_id: "cfcd8fea-ccff-43cc-87cf-9b5fd736670b",
    });
    console.log(data, error);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return <div className="mt-16"></div>;
};

export default TestPage;
