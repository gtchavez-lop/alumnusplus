const __PageTransition = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.2, ease: "circOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: "circIn" },
  },
};

const __TabTransition = {
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

export { __PageTransition, __TabTransition };
