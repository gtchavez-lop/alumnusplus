import { useQuery } from "@tanstack/react-query";

const fetchFeed = async () => {
  if (localStorage.getItem("supabase.auth.token")) {
    const user = localStorage.getItem("supabase.auth.token");
    const parsed = JSON.parse(user).currentSession.user;
    const mainUser = {
      ...parsed,
      user_metadata: {
        ...parsed.user_metadata,
        connections: parsed.user_metadata.connections
          ? JSON.parse(parsed.user_metadata.connections)
          : [],
      },
    };

    const res = await fetch(
      "/api/feed?" +
        new URLSearchParams({
          // connectionsList: mainUser.user_metadata.connections,
          id: mainUser.id,
        })
    );

    let { data } = await res.json();

    return data;
  }
  return [];
};

const fetchUserFeed = async () => {
  if (localStorage.getItem("supabase.auth.token")) {
    const user = localStorage.getItem("supabase.auth.token");
    const parsed = JSON.parse(user).currentSession.user;
    const mainUser = {
      ...parsed,
      user_metadata: {
        ...parsed.user_metadata,
        connections: JSON.parse(parsed.user_metadata.connections),
      },
    };

    const res = await fetch(
      "/api/feed?" +
        new URLSearchParams({
          id: mainUser.id,
        })
    );

    let { data } = await res.json();
    return data;
  }

  return [];
};

const useFeed = () => {
  const { data, error, isLoading, isSuccess } = useQuery(["$$feed"], fetchFeed);
  return { data, error, isLoading, isSuccess };
};

const useUserFeed = () => {
  const { data, error, isLoading, isSuccess } = useQuery(
    ["$$userFeed"],
    fetchUserFeed
  );
  return { data, error, isLoading, isSuccess };
};

export { useFeed, useUserFeed };
