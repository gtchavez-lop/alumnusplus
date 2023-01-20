import { __supabase } from "@/supabase";
import { useEffect } from "react";

const TestPage = () => {
  const fetchFeed = async () => {
    const { data, error, status } = await __supabase
      .from("public_posts")
      .select(
        `
          id,
          uploader(id,username,fullName)
        `
      )
      .order("createdAt", { ascending: false });

    if (error) {
      console.log(error);
    }

    console.log(data);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return <div className="py-32">Testing page</div>;
};

export default TestPage;
