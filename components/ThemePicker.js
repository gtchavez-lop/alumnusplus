import { useEffect, useState } from "react";

import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

const ThemePicker = ({ visible, setVisible }) => {
  const [selectedTheme, setSelectedTheme] = useState();

  const dayThemes = [
    {
      name: "Light",
      value: "light",
    },
    {
      name: "Cupcake",
      value: "cupcake",
    },
    {
      name: "Bumblebee",
      value: "bumblebee",
    },
    {
      name: "Emerald",
      value: "emerald",
    },
    {
      name: "Corporate",
      value: "corporate",
    },
    {
      name: "Retro",
      value: "retro",
    },
    {
      name: "Cyberpunk",
      value: "cyberpunk",
    },
    {
      name: "Valentine",
      value: "valentine",
    },
    {
      name: "Garden",
      value: "garden",
    },
    {
      name: "Lofi",
      value: "lofi",
    },
    {
      name: "Pastel",
      value: "pastel",
    },
    {
      name: "Fantasy",
      value: "fantasy",
    },
    {
      name: "Wireframe",
      value: "wireframe",
    },
    {
      name: "CMYK",
      value: "cmyk",
    },
    {
      name: "Autumn",
      value: "autumn",
    },
    {
      name: "Acid",
      value: "acid",
    },
    {
      name: "Lemonade",
      value: "lemonade",
    },
    {
      name: "Winter",
      value: "winter",
    },
  ];

  const nightThemes = [
    {
      name: "Dark",
      value: "dark",
    },
    {
      name: "Synthwave",
      value: "synthwave",
    },
    {
      name: "Halloween",
      value: "halloween",
    },
    {
      name: "Forest",
      value: "forest",
    },
    {
      name: "Aqua",
      value: "aqua",
    },
    {
      name: "Black",
      value: "black",
    },
    {
      name: "Luxury",
      value: "luxury",
    },
    {
      name: "Dracula",
      value: "dracula",
    },
    {
      name: "Business",
      value: "business",
    },
    {
      name: "Night",
      value: "night",
    },
  ];

  const changeTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    setSelectedTheme(theme);
    setTimeout(() => {
      setVisible(false);
    }, 500);
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      changeTheme(theme);
    } else {
      changeTheme("light");
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.main
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { ease: "circOut", duration: 0.5 },
            }}
            exit={{
              opacity: 0,
              transition: { ease: "circIn", duration: 0.25 },
            }}
            className="fixed z-[999] px-4 top-0 left-0 w-full h-screen bg-base-100 overflow-y-scroll flex justify-center"
          >
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                scale: 1,
                transition: { ease: "circOut", duration: 0.5 },
              }}
              exit={{
                y: -40,
                opacity: 0,
                scale: 0.9,
                transformOrigin: "top",
                transition: { ease: "circIn", duration: 0.25 },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-max w-full max-w-4xl py-32 gap-2"
            >
              <p className="text-2xl col-span-full text-center">Day Themes</p>
              {dayThemes.map((theme, i) => (
                <div
                  key={`theme-day-${i + 1}`}
                  className={`btn ${
                    selectedTheme === theme.value ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => changeTheme(theme.value)}
                >
                  {theme.name}
                </div>
              ))}

              <p className="text-2xl col-span-full mt-10 text-center">
                Night Themes
              </p>
              {nightThemes.map((theme, i) => (
                <div
                  key={`theme-night-${i + 1}`}
                  className={`btn ${
                    selectedTheme === theme.value ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => changeTheme(theme.value)}
                >
                  {theme.name}
                </div>
              ))}
            </motion.div>
          </motion.main>
        </>
      )}
    </AnimatePresence>
  );
};

export default ThemePicker;
