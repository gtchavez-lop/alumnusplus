import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const ThemeSwticher = ({ isOpen, setOpen }) => {
  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
  ];

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
          <div className="transition-colors duration-200 w-full max-w-xl grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 px-5 gap-4 items-center place-items-center">
            {/* <div data-theme="light" className="btn-primary btn btn-circle" /> */}
            {themes.map((theme, i) => (
              <div data-tip={theme} key={`theme_${i + 1}`} className="tooltip">
                <div
                  data-theme={theme}
                  onClick={(e) => switchTheme(theme)}
                  className="btn-primary btn btn-circle ring-2 ring-offset-2 ring-secondary"
                />
              </div>
            ))}
          </div>
        </motion.main>
      )}
    </>
  );
};

export default ThemeSwticher;
