import { useQueries, useQuery } from "@tanstack/react-query";

import { __supabase } from "@/supabase";
import { useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";

const TestPage = () => {
  const localUser = useUser();

  const getUserDetails = async () => {
    const { data, error } = await __supabase
      .from("user_hunters")
      .select("*")
      .eq("id", localUser.id)
      .single();

    if (error) {
      console.log("error", error);
      return null;
    }

    return data;
  };

  const currentUser = useQuery({
    queryKey: ["currentUser"],
    queryFn: getUserDetails,
    enabled: !!localUser,
  });

  const getUserConnections = async () => {
    const userConnections = currentUser.data.connections;

    const { data, error } = await __supabase
      .from("public_posts")
      .select("*")
      .in("uploader", [...userConnections, localUser.id]);

    if (error) {
      console.log("error", error);
      return [];
    }

    return data;
  };

  const [feedList] = useQueries({
    queries: [
      {
        queryKey: ["connections"],
        queryFn: getUserConnections,
        enabled: !!currentUser.isSuccess,
      },
    ],
  });

  console.log("connections", feedList);

  return <div className="py-32"></div>;
};

export default TestPage;
