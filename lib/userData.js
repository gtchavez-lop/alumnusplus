import __supabase from "./auth";

const getUserData = () => {
  __supabase
    .from("user_data")
    .select("*")
    .eq("id", __supabase.auth.user().id)
    .then((data) => {
      return data;
    });
};

export { getUserData };
