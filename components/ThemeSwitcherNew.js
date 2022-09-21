import { useEffect, useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import { _Page_Transition } from '../lib/_animations';
import { motion } from 'framer-motion';

const dayThemes = [
  {
    name: 'Light',
    value: 'light',
  },
  {
    name: 'Cupcake',
    value: 'cupcake',
  },
  {
    name: 'Bumblebee',
    value: 'bumblebee',
  },
  {
    name: 'Emerald',
    value: 'emerald',
  },
  {
    name: 'Corporate',
    value: 'corporate',
  },
  {
    name: 'Retro',
    value: 'retro',
  },
  {
    name: 'Cyberpunk',
    value: 'cyberpunk',
  },
  {
    name: 'Valentine',
    value: 'valentine',
  },
  {
    name: 'Garden',
    value: 'garden',
  },
  {
    name: 'Lofi',
    value: 'lofi',
  },
  {
    name: 'Pastel',
    value: 'pastel',
  },
  {
    name: 'Fantasy',
    value: 'fantasy',
  },
  {
    name: 'Wireframe',
    value: 'wireframe',
  },
  {
    name: 'CMYK',
    value: 'cmyk',
  },
  {
    name: 'Autumn',
    value: 'autumn',
  },
  {
    name: 'Acid',
    value: 'acid',
  },
  {
    name: 'Lemonade',
    value: 'lemonade',
  },
  {
    name: 'Winter',
    value: 'winter',
  },
];
const nightThemes = [
  {
    name: 'Dark',
    value: 'dark',
  },
  {
    name: 'Synthwave',
    value: 'synthwave',
  },
  {
    name: 'Halloween',
    value: 'halloween',
  },
  {
    name: 'Forest',
    value: 'forest',
  },
  {
    name: 'Aqua',
    value: 'aqua',
  },
  {
    name: 'Black',
    value: 'black',
  },
  {
    name: 'Luxury',
    value: 'luxury',
  },
  {
    name: 'Dracula',
    value: 'dracula',
  },
  {
    name: 'Business',
    value: 'business',
  },
  {
    name: 'Night',
    value: 'night',
  },
];

const ThemeSwitcherNew = ({ className, text }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState();

  const changeTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    setSelectedTheme(theme);
    setIsVisible(false);
  };

  useEffect(() => {
    const localTheme = localStorage.getItem('theme');
    if (localTheme) {
      document.documentElement.setAttribute('data-theme', localTheme);
      setSelectedTheme(localTheme);
    }
  }, []);

  return (
    <>
      <button onClick={(e) => setIsVisible(!isVisible)} className={className}>
        <span>{text || 'Select Theme'}</span>
      </button>

      <AnimatePresence>
        {isVisible && (
          <motion.main
            variants={_Page_Transition}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => {
              e.currentTarget === e.target && setIsVisible(false);
            }}
            className="fixed z-[99] w-screen h-screen top-0 left-0 flex justify-center bg-base-100 transition-colors"
          >
            <motion.div className=" z-[99] max-w-5xl p-5 w-screen h-screen bg-base-100 transition-colors grid gap-5 grid-cols-2 md:grid-cols-3 px-16 auto-rows-min overflow-y-auto pb-32">
              <p className="col-span-full text-4xl text-center my-10">
                Theme List
              </p>

              <p className="col-span-full text-2xl">Day themes</p>
              {dayThemes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={(e) => changeTheme(theme.value)}
                  data-theme={theme.value}
                  className={`btn btn-primary no-animation transition-all ${
                    selectedTheme === theme.value
                      ? 'ring-4 ring-primary btn-ghost'
                      : 'ring-4 ring-transparent'
                  }`}
                >
                  {theme.name} Theme
                </button>
              ))}

              <p className="col-span-full text-2xl mt-10">Night themes</p>
              {nightThemes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={(e) => changeTheme(theme.value)}
                  data-theme={theme.value}
                  className={`btn btn-primary no-animation transition-all ${
                    selectedTheme === theme.value
                      ? 'ring-4 ring-primary btn-ghost'
                      : 'ring-4 ring-transparent'
                  }`}
                >
                  {theme.name} Theme
                </button>
              ))}

              {/* overflow white gradient */}
              <div className="fixed bg-gradient-to-b w-full h-32 bottom-0 left-0 from-transparent to-base-100 transition-colors z-50" />
            </motion.div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
};

export default ThemeSwitcherNew;
