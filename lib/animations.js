const _PageTransition = {
  initial: {
    opacity: 0,
    x: -10,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      ease: "circOut",
      duration: 0.25,
    },
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: {
      ease: "circIn",
      duration: 0.25,
    },
  },
};

export { _PageTransition };
