export const AnimPageTransition = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transformOrigin: "top",
    transition: { duration: 0.5, ease: [.1,1,0,1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: "circIn" },
  },
};

export const AnimTabTransition = {
  initial: {
    opacity: 0,
    translateX: -20,
  },
  animate: {
    opacity: 1,
    translateX: 0,
    transition: { duration: 0.2, ease: "circOut" },
  },
  exit: {
    opacity: 0,
    translateX: 20,
    transition: { duration: 0.1, ease: "circIn" },
  },
};