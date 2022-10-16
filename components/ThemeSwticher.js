import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const ThemeSwticher = ({ isOpen, setOpen }) => {
  const themes = ["wicket-light", "wicket-dark"];

  const switchTheme = (theme) => {
    localStorage.setItem("theme", theme);
    document.body.setAttribute("data-theme", theme);
    toast(`Switched to ${theme} theme`, {
      duration: 1000,
    });
  };

  return (
    <>
      {isOpen && (
        <motion.main
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.3,
              ease: "circOut",
            },
          }}
          exit={{
            opacity: 0,
            y: -100,
            transition: {
              duration: 0.3,
              ease: "circIn",
              delay: 0.5,
            },
          }}
          onClick={() => setOpen(false)}
          className="transition-colors fixed top-0 left-0 w-full min-h-screen flex justify-center items-center bg-base-100 z-[999]"
        >
          <div className="transition-colors duration-200 w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 px-5 gap-4 items-center place-items-center">
            {/* <div data-theme="light" className="btn-primary btn btn-circle" /> */}
            {themes.map((theme, i) => (
              <button
                onClick={() => switchTheme(theme)}
                className="btn btn-primary w-full"
                key={`theme-${i}`}
              >
                <span>
                  wicket {theme === "wicket-light" ? "light" : "dark"}
                </span>
              </button>
            ))}
          </div>
        </motion.main>
      )}
    </>
  );
};

export default ThemeSwticher;
