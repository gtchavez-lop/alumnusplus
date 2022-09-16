export const _Page_Transition = {
  initial: {
    opacity: 0,
    x: 10,
    transition: {
      duration: 0.2,
      ease: 'circOut',
    },
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: 'circOut',
    },
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.2,
      ease: 'circIn',
    },
  },
};
