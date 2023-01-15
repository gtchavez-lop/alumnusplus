const __PageTransition = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "circOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1, ease: "circIn" },
  },
};

const __TabTransition = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "circOut" },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.1, ease: "circIn" },
  },
};

export { __PageTransition, __TabTransition };
