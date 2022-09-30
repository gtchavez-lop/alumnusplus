import __supabase from "./auth";

const user = null;

const getUser = async (e) => {
  const thisUser = await __supabase.auth.user();
  if (thisUser) {
    user = thisUser;
  }

  return user;
};

export { user, getUser };
