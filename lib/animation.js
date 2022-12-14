const __PageTransition = {
  initial: {
    opacity: 0,
    x: -40,
    transition: { duration: 0.5, ease: "circOut" },
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "circOut" },
  },
  exit: {
    opacity: 0,
    x: 40,
    transition: { duration: 0.2, ease: "circIn" },
  },
};

export default {
  __PageTransition,
};
