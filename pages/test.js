import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useEffect, useState } from "react";

import { useSupabaseClient } from "@supabase/auth-helpers-react";

const TestPage = ({ session }) => {
  const supabase = useSupabaseClient();

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    console.log(error);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return <div className="mt-16"></div>;
};

export default TestPage;
