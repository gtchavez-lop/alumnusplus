export const AnimPageTransition = {
  initial: {
    // clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0% 100%)',
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    // clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
    opacity: 1,
    scale: 1,
    transformOrigin: "top",
    transition: { duration: 0.3, ease: [.22,.77,.13,.93], delay: 0.3 },
  },
  exit: {
    opacity: 0,
    // clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
    transition: { duration: 0.3, ease: [.92,.08,.84,.15] },
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

export const AnimLoading = {
  animate: {
    opacity: [0,1,1,1,0],
    clipPath: [
      'polygon(0 0, 0% 0, 0% 100%, 0% 100%)',
      'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
      'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
    ],
    transition: { duration: 2, ease: 'easeInOut', repeat: Infinity},
  },
}