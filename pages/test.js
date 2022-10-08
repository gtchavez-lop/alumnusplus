import __supabase from "../lib/supabase";
import { useEffect } from "react";

const PageTest = (e) => {
  const fetchFeed = async () => {
    let user = await __supabase.auth.user();
    let currentConnections = user.user_metadata.connections
      ? JSON.parse(user.user_metadata.connections)
      : [];

    let list = [user.id, ...currentConnections];

    const res = await fetch(
      "/api/feed?" +
        new URLSearchParams({
          connectionsList: JSON.stringify(list),
          id: user.id,
        })
    );
    const data = await res.json();

    console.log(data);
  };

  const fetchRecommendedUsers = async () => {
    const res = await fetch(
      "./api/recommendedUsers?" +
        new URLSearchParams({
          id: __supabase.auth.user().id,
          // connectionList: [],
        })
    );

    const data = await res.json();
    console.log(data);
  };

  const fetchUser = async () => {
    const user = await __supabase.auth.user();
    const res = await fetch(
      "/api/userData?" +
        new URLSearchParams({
          idList: JSON.stringify([user.id]),
        })
    );
    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    fetchUser();
    // fetchFeed();
    // fetchRecommendedUsers();
  }, []);

  return (
    <>
      <p>Test Area for API</p>
    </>
  );
};

export default PageTest;
