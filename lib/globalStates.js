import create from "zustand/react";

const __user = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

const __userData = create((set) => ({
  userData: null,
  setUserData: (userData) => set({ userData }),
}));

export { __user, __userData };
